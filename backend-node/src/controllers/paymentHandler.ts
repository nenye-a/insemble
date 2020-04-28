import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../prisma';
import stripe from '../config/stripe';
import {
  subscriptionPlans,
  subscriptionPlansCheck,
} from '../constants/subscriptions';
import { TenantTier, LandlordTier } from '@prisma/client';
import { trialCheck } from '../helpers/trialCheck';
import { getBillingAnchor } from '../helpers/getBillingAnchor';

const signingSecret = process.env.STRIPE_WH_SECRET || '';

export async function paymentHandler(request: Request, response: Response) {
  let signature = request.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      request.rawBody,
      signature,
      signingSecret,
    );
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }
  let { type, data } = event;

  if (type === 'customer.subscription.deleted') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let object: { [key: string]: any } = data.object;
    let { customer: stripeCustomerId, items } = object;
    let productId = items.data[0]?.plan?.product;
    let subscriptionPlan = subscriptionPlans.find(
      (plan) => plan.id === productId,
    );
    let subscriptionId = items.data[0]?.subscription;
    if (!subscriptionId) {
      response.status(400).send(`This invoice doesn't contain a subscription`);
      return;
    }
    if (!subscriptionPlan) {
      response
        .status(400)
        .send(`This invoice doesn't contain a recognized subscription product`);
      return;
    }
    let { nextPlan, spaceId } = object.metadata;
    if (nextPlan) {
      if (subscriptionPlan.role === 'LANDLORD') {
        let subsPlan = subscriptionPlansCheck.find(
          (plan) => plan.id === nextPlan,
        );
        if (!subsPlan) {
          throw new Error('No plan found.');
        }
        if (subsPlan.role === 'TENANT') {
          throw new Error('This is tenant plan.');
        }
        let user = await prisma.landlordUser.findOne({
          where: {
            stripeCustomerId,
          },
        });
        if (!user) {
          throw new Error('User not found');
        }
        try {
          let { id: newSubscriptionId } = await stripe.subscriptions.create({
            customer: user.stripeCustomerId,
            items: [
              {
                plan: nextPlan,
              },
            ],
            billing_cycle_anchor: getBillingAnchor(subsPlan.cycle),
            proration_behavior: 'always_invoice',
            metadata: { spaceId },
          });
          await prisma.space.update({
            where: {
              id: spaceId,
            },
            data: {
              stripeSubscriptionId: newSubscriptionId,
            },
          });
        } catch {
          response.json({ received: true });
        }
      } else {
        let user = await prisma.tenantUser.findOne({
          where: {
            stripeCustomerId,
          },
        });
        if (!user) {
          throw new Error('User not found');
        }
        let { id: newSubscriptionId } = await stripe.subscriptions.create({
          customer: user.stripeCustomerId,
          items: [
            {
              plan: nextPlan,
            },
          ],
        });
        await prisma.tenantUser.update({
          where: {
            stripeCustomerId,
          },
          data: {
            stripeSubscriptionId: newSubscriptionId,
          },
        });
      }
    } else {
      if (subscriptionPlan.role === 'TENANT') {
        let user = await prisma.tenantUser.findOne({
          where: {
            stripeCustomerId,
          },
        });
        if (!user) {
          throw new Error('User not found');
        }
        user = await prisma.tenantUser.update({
          where: {
            stripeCustomerId,
          },
          data: {
            tier: trialCheck(user.createdAt) ? 'PROFESSIONAL' : 'FREE',
            stripeSubscriptionId: null,
          },
        });
        await prisma.subscriptionTenantHistory.create({
          data: {
            subscriptionId,
            action: 'CANCEL',
            tenantUser: {
              connect: {
                id: user.id,
              },
            },
          },
        });
      } else {
        let user = await prisma.landlordUser.findOne({
          where: {
            stripeCustomerId,
          },
        });
        if (!user) {
          throw new Error('User not found');
        }
        try {
          await prisma.space.update({
            where: {
              stripeSubscriptionId: subscriptionId,
            },
            data: {
              tier: trialCheck(user.createdAt) ? 'PROFESSIONAL' : 'NO_TIER',
              stripeSubscriptionId: null,
            },
          });
          await prisma.subscriptionLandlordHistory.create({
            data: {
              subscriptionId,
              action: 'CANCEL',
              landlordUser: {
                connect: {
                  id: user.id,
                },
              },
            },
          });
        } catch {
          response.json({ received: true });
        }
      }
    }

    response.json({ received: true });
  }

  if (type === 'invoice.payment_succeeded') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let object: { [key: string]: any } = data.object;
    let { customer: stripeCustomerId, lines } = object;
    let productId = lines.data[0]?.plan?.product;
    if (lines.data.length > 1) {
      productId = lines.data[1]?.plan?.product;
    }
    let subscriptionPlan = subscriptionPlans.find(
      (plan) => plan.id === productId,
    );
    let subscriptionId = lines.data[0]?.subscription;
    if (!subscriptionId) {
      response.status(400).send(`This invoice doesn't contain a subscription`);
      return;
    }
    if (!subscriptionPlan) {
      response
        .status(400)
        .send(`This invoice doesn't contain a recognized subscription product`);
      return;
    }
    if (subscriptionPlan.role === 'TENANT') {
      await prisma.tenantUser.update({
        where: {
          stripeCustomerId,
        },
        data: {
          tier: subscriptionPlan.tier as TenantTier,
        },
      });
    } else {
      await prisma.space.update({
        where: {
          stripeSubscriptionId: subscriptionId,
        },
        data: {
          tier: subscriptionPlan.tier as LandlordTier,
        },
      });
    }
  }
  response.json({ received: true });
}
