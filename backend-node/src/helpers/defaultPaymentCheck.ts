import stripe from '../config/stripe';
export async function defaultPaymentCheck(
  stripeCustomerId: string,
): Promise<boolean> {
  try {
    let stripeCust = await stripe.customers.retrieve(stripeCustomerId);
    if ('invoice_settings' in stripeCust) {
      if (stripeCust.invoice_settings.default_payment_method) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
}
