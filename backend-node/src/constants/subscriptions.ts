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
