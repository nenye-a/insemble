import { queryField, stringArg, intArg } from 'nexus';
import { Root, Context } from 'serverTypes';
import { NexusGenRootTypes } from 'nexus-typegen/index';
import { Stripe } from 'stripe';

import stripeInstance from '../../config/stripe';

type PaymentMethodList = Array<NexusGenRootTypes['CustomerPaymentMethod']>;
let paymentMethodList = queryField('paymentMethodList', {
  type: 'CustomerPaymentMethod',
  list: true,
  args: {
    startingAfter: stringArg({ nullable: true }),
    endingBefore: stringArg({ nullable: true }),
    limit: intArg({ nullable: true }),
  },
  resolve: async (
    _: Root,
    { startingAfter, endingBefore, limit },
    { prisma, tenantUserId, landlordUserId }: Context,
  ) => {
    let user = tenantUserId
      ? await prisma.tenantUser.findOne({
          where: {
            id: tenantUserId,
          },
        })
      : await prisma.landlordUser.findOne({
          where: {
            id: landlordUserId,
          },
        });
    let paymentMethodList: PaymentMethodList = [];
    if (user?.stripeCustomerId) {
      let customerPaymentMethod = await stripeInstance.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
        starting_after: startingAfter,
        ending_before: endingBefore,
        limit,
        expand: ['data.customer.invoice_settings'],
      });
      let customerPaymentMethodList: Array<Stripe.PaymentMethod> =
        customerPaymentMethod.data;
      customerPaymentMethodList.forEach(({ id, card, customer }) => {
        // NOTE: Card will always exist but TS doesn't think so
        if (card && customer && typeof customer !== 'string') {
          paymentMethodList.push({
            id,
            expMonth: card.exp_month,
            expYear: card.exp_year,
            lastFourDigits: card.last4,
            isDefault: customer.invoice_settings.default_payment_method === id,
          });
        }
      });
    }
    return paymentMethodList;
  },
});

export default paymentMethodList;
