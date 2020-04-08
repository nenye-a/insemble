import { TenantTier } from '@prisma/client';

export const subscriptionPlans: Array<{
  tier: TenantTier;
  id: string;
}> = [
  { tier: 'EXPLORE', id: 'prod_GlgwI5jKh46guy' },
  { tier: 'PROFESSIONAL', id: 'prod_GlgxaiFQlz2C0g' },
  { tier: 'SMART', id: 'prod_GnCLMYRH8GHqzM' },
];
