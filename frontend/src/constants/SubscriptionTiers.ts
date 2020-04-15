import { TenantTier } from '../generated/globalTypes';

export const LandlordTiers = {
  BASIC: {
    id: 'prod_GlgyphMKy4y1RY',
    name: 'Explore',
    monthly: { id: 'plan_GlgzmsDFYNivMf', price: 30 },
    yearly: { id: 'plan_Glgzi3McWzuZ1v', price: 300 },
  },
  PRO: {
    id: 'prod_Glh0kj8K2C44rw',
    name: 'Professional',
    monthly: { id: 'plan_Glh0alOVw1hDJh', price: 800 },
    yearly: { id: 'plan_Glh0neF7FfBXcw', price: 4000 },
  },
};

export type LandlordTier = keyof typeof LandlordTiers;

type Plan = {
  id: string;
  price: number;
};

export const TenantTiers: {
  [key in TenantTier]: {
    id: string;
    name: string;
    monthly: Plan;
    yearly: Plan;
    title: string;
    type: TenantTier;
  };
} = {
  [TenantTier.FREE]: {
    id: 'free',
    name: 'Free',
    monthly: { id: '', price: 0 },
    yearly: { id: '', price: 0 },
    title: 'Popular with Explorers',
    type: TenantTier.FREE,
  },
  [TenantTier.PROFESSIONAL]: {
    id: 'prod_GlgxaiFQlz2C0g',
    name: 'Professional',
    monthly: { id: 'plan_GlgyRHQ6XPof6v', price: 1500 },
    yearly: { id: 'plan_GlgyE9w9q7ILhB', price: 5000 },
    title: 'Popular with Experts',
    type: TenantTier.PROFESSIONAL,
  },
};
