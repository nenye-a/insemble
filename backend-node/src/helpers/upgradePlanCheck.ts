import { BillingPlanType } from 'dataTypes';

export function upgradePlanCheck(
  currentPlan: BillingPlanType,
  nextPlan: BillingPlanType,
): boolean {
  if (currentPlan.tier === 'PROFESSIONAL' && nextPlan.tier === 'BASIC') {
    return false;
  }
  if (currentPlan.cycle === 'ANNUALLY' && nextPlan.cycle === 'MONTHLY') {
    return false;
  }
  if (currentPlan.id === nextPlan.id) {
    return false;
  }
  return true;
}
