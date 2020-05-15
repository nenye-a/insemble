import { TenantTier, LandlordTier } from '@prisma/client';
import { BillingPlanType } from 'dataTypes';

export const subscriptionPlans: Array<{
  role: 'LANDLORD' | 'TENANT';
  tier: TenantTier | LandlordTier;
  id: string;
}> = [
  { role: 'TENANT', tier: 'PROFESSIONAL', id: 'prod_HDc5ojbg2wWAyX' },
  { role: 'LANDLORD', tier: 'BASIC', id: 'prod_HDc3uHkkDD4ntV' },
  { role: 'LANDLORD', tier: 'PROFESSIONAL', id: 'prod_HDc1BYnsaxpMvI' },
];

export const subscriptionPlansCheck: Array<BillingPlanType> = [
  {
    role: 'TENANT',
    id: 'plan_HDc552tQmFb09D',
    tier: 'PROFESSIONAL',
    cycle: 'ANNUALLY',
  },
  {
    role: 'TENANT',
    id: 'plan_HDc5c9lhrISfr6',
    tier: 'PROFESSIONAL',
    cycle: 'MONTHLY',
  },
  {
    role: 'LANDLORD',
    id: 'plan_HDc3AjhLp9vT8c',
    tier: 'BASIC',
    cycle: 'ANNUALLY',
  },
  {
    role: 'LANDLORD',
    id: 'plan_HDc33fDsBvmagA',
    tier: 'BASIC',
    cycle: 'MONTHLY',
  },
  {
    role: 'LANDLORD',
    id: 'plan_HDc9bJ50fc4vrp',
    tier: 'PROFESSIONAL',
    cycle: 'ANNUALLY',
  },
  {
    role: 'LANDLORD',
    id: 'plan_HDcAikW8sAsb27',
    tier: 'PROFESSIONAL',
    cycle: 'MONTHLY',
  },
];
