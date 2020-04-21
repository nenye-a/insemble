import { mutationField, stringArg, FieldResolver } from 'nexus';
import { Root, Context } from 'serverTypes';

import stripe from '../../config/stripe';
import getUserDetails from '../../helpers/getUserDetails';
import { defaultPaymentCheck } from '../../helpers/defaultPaymentCheck';

export let changeDefaultPaymentMethodResolver: FieldResolver<
  'Mutation',
  'changeDefaultPaymentMethod'
> = async (_: Root, { paymentMethodId }, context: Context) => {
  let user = await getUserDetails(context);
  if (!user) {
    throw new Error('User not found');
  }

  if (user.stripeCustomerId) {
    await stripe.customers.update(user.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    return true;
  }
  return false;
};

let changeDefaultPaymentMethod = mutationField('changeDefaultPaymentMethod', {
  type: 'Boolean',
  nullable: true,
  args: {
    paymentMethodId: stringArg({ required: true }),
  },
  resolve: changeDefaultPaymentMethodResolver,
});

let registerPaymentMethod = mutationField('registerPaymentMethod', {
  type: 'PaymentMethod',
  nullable: true,
  args: {
    paymentMethodId: stringArg({ required: true }),
  },
  resolve: async (_, { paymentMethodId }, context: Context, info) => {
    let { prisma, tenantUserId, landlordUserId } = context;
    let user = await getUserDetails(context);
    if (!user) {
      throw new Error('User not found');
    }

    // TODO: Handle invalid stripeCustomerId
    if (user.stripeCustomerId) {
      let { id, card } = await stripe.paymentMethods.attach(paymentMethodId, {
        customer: user.stripeCustomerId,
      });
      if (card) {
        let thereIsDefaultPayment = await defaultPaymentCheck(
          user.stripeCustomerId,
        );
        if (!thereIsDefaultPayment) {
          await changeDefaultPaymentMethodResolver(
            _,
            { paymentMethodId: id },
            context,
            info,
          );
        }
        let { exp_month: expMonth, exp_year: expYear, last4 } = card;
        return { id, expMonth, expYear, lastFourDigits: last4 };
      }
    } else {
      let stripeCustomer = await stripe.customers.create({
        email: user.email,
        payment_method: paymentMethodId,
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      if (tenantUserId) {
        await prisma.tenantUser.update({
          where: {
            id: tenantUserId,
          },
          data: {
            stripeCustomerId: stripeCustomer.id,
          },
        });
      }
      if (landlordUserId) {
        await prisma.landlordUser.update({
          where: {
            id: landlordUserId,
          },
          data: {
            stripeCustomerId: stripeCustomer.id,
          },
        });
      }

      let { id, card } = await stripe.paymentMethods.retrieve(paymentMethodId);

      if (card) {
        let { exp_month: expMonth, exp_year: expYear, last4 } = card;
        return { id, expMonth, expYear, lastFourDigits: last4 };
      }
    }
    return null;
  },
});

let removePaymentMethod = mutationField('removePaymentMethod', {
  type: 'PaymentMethod',
  nullable: true,
  args: {
    paymentMethodId: stringArg({ required: true }),
  },
  resolve: async (_, { paymentMethodId }, context: Context, info) => {
    let user = await getUserDetails(context);
    if (!user) {
      throw new Error('User not found');
    }
    let { id, card } = await stripe.paymentMethods.detach(paymentMethodId);
    if (!card) {
      return null;
    }
    try {
      let stripeCust = await stripe.customers.retrieve(user.stripeCustomerId);
      if ('invoice_settings' in stripeCust) {
        if (!stripeCust.invoice_settings.default_payment_method) {
          let { data } = await stripe.paymentMethods.list({
            customer: stripeCust.id,
            type: 'card',
          });
          if (data.length) {
            let newDefaultPaymentId = data[0].id;
            await changeDefaultPaymentMethodResolver(
              _,
              { paymentMethodId: newDefaultPaymentId },
              context,
              info,
            );
          } else {
            if (stripeCust.subscriptions) {
              for (let subs of stripeCust.subscriptions.data) {
                await stripe.subscriptions.update(subs.id, {
                  cancel_at_period_end: true,
                });
              }
            }
          }
        }
      } else {
        throw new Error('Stripe user has been deleted or not exist!');
      }
    } catch {
      throw new Error('Stripe user id not found!');
    }
    let { exp_month: expMonth, exp_year: expYear, last4 } = card;
    return {
      id,
      expMonth,
      expYear,
      lastFourDigits: last4,
    };
  },
});

export {
  changeDefaultPaymentMethod,
  registerPaymentMethod,
  removePaymentMethod,
};
