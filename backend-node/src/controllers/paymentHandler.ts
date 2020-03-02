import { Request, Response } from 'express';
import Stripe from 'stripe';
import { prisma } from '../prisma';
import stripe from '../config/stripe';
import { subscriptionPlans } from '../constants/subscriptions';

const signingSecret = process.env.STRIPE_WH_SECRET || '';

export async function paymentHandler(request: Request, response: Response) {
  // TODO: Create handler for landlord
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
  if (type === 'invoice.payment_succeeded') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let object: { [key: string]: any } = data.object;
    let { customer: stripeCustomerId, lines } = object;
    let productId = lines.data[0]?.plan?.product;
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

    await prisma.tenantUser.update({
      where: {
        stripeCustomerId,
      },
      data: {
        tier: subscriptionPlan.tier,
        stripeSubscriptionId: subscriptionId,
      },
    });
  }
  response.json({ received: true });
}
