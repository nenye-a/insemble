import { TenantTier, LandlordTier } from '@prisma/client';

export const subscriptionPlans: Array<{
  role: 'LANDLORD' | 'TENANT';
  tier: TenantTier | LandlordTier;
  id: string;
}> = [
  { role: 'TENANT', tier: 'PROFESSIONAL', id: 'prod_GlgxaiFQlz2C0g' },
  { role: 'LANDLORD', tier: 'BASIC', id: 'prod_GlgyphMKy4y1RY' },
  { role: 'LANDLORD', tier: 'PROFESSIONAL', id: 'prod_Glh0kj8K2C44rw' },
];

export const subscriptionPlansCheck: Array<{
  role: 'LANDLORD' | 'TENANT';
  id: string;
  cycle: 'MONTHLY' | 'ANNUALLY';
  tier: 'BASIC' | 'PROFESSIONAL';
}> = [
  {
    role: 'TENANT',
    id: 'plan_GlgyE9w9q7ILhB',
    tier: 'PROFESSIONAL',
    cycle: 'ANNUALLY',
  },
  {
    role: 'TENANT',
    id: 'plan_GlgyRHQ6XPof6v',
    tier: 'PROFESSIONAL',
    cycle: 'MONTHLY',
  },
  {
    role: 'LANDLORD',
    id: 'plan_Glgzi3McWzuZ1v',
    tier: 'BASIC',
    cycle: 'ANNUALLY',
  },
  {
    role: 'LANDLORD',
    id: 'plan_GlgzmsDFYNivMf',
    tier: 'BASIC',
    cycle: 'MONTHLY',
  },
  {
    role: 'LANDLORD',
    id: 'plan_Glh0neF7FfBXcw',
    tier: 'PROFESSIONAL',
    cycle: 'ANNUALLY',
  },
  {
    role: 'LANDLORD',
    id: 'plan_Glh0alOVw1hDJh',
    tier: 'PROFESSIONAL',
    cycle: 'MONTHLY',
  },
];
