require('dotenv').config();
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_KEY || '', {
  // NOTE: Using @ts-ignore here because it's recommended by the Stripe themselves in their ts definition
  // eslint-disable-next-line
  // @ts-ignore
  apiVersion: '2019-08-14',
});

export default stripe;
