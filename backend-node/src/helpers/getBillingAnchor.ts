export function getBillingAnchor(cycle: 'ANNUALLY' | 'MONTHLY'): number {
  let today = new Date();
  today.setUTCHours(7); // NOTE: LA Timezone UTC -7
  let month = today.getUTCMonth();
  let year = today.getUTCFullYear();
  let anchorDateTimeStamp;
  if (cycle === 'MONTHLY') {
    anchorDateTimeStamp = new Date(Date.UTC(year, month + 1, 1, 7)).getTime();
  } else {
    anchorDateTimeStamp = new Date(Date.UTC(year + 1, month, 1, 7)).getTime();
  }
  let stripeAnchor = Math.round(anchorDateTimeStamp / 1000);
  return stripeAnchor;
}
