import { TenantTier, LandlordTier } from '../generated/globalTypes';

export const LandlordTiers = {
  [LandlordTier.BASIC]: {
    id: 'prod_HDc3uHkkDD4ntV',
    name: 'Basic',
    monthly: { id: 'plan_HDc33fDsBvmagA', price: 30 },
    yearly: { id: 'plan_HDc3AjhLp9vT8c', price: 300 },
    title: '',
    benefits: [
      'Access thousands of pre-qualified tenants',
      'Complementary virtual tours & photos',
      'In depth marketing analytics',
    ],
    type: LandlordTier.BASIC,
  },
  [LandlordTier.PROFESSIONAL]: {
    id: 'prod_HDc1BYnsaxpMvI',
    name: 'Professional',
    monthly: { id: 'plan_HDcAikW8sAsb27', price: 450 },
    yearly: { id: 'plan_HDc9bJ50fc4vrp', price: 4020 },
    title: 'Popular',
    benefits: [
      'See expanding tenants that fit property',
      'Advertise both on-market & off-market',
      'Full “Smart” access with no monthly fee',
      '24/7 support & premium services',
    ],
    type: LandlordTier.PROFESSIONAL,
  },
};

export const TenantTiers = {
  [TenantTier.FREE]: {
    id: 'free',
    name: 'Explore',
    monthly: { id: '', price: 0 },
    yearly: { id: '', price: 0 },
    title: '',
    benefits: [
      'Access matching locations and properties',
      'Connect with property managers & reps',
      'Compare prospective sites to existing stores',
      'See high level location match details',
    ],
    type: TenantTier.FREE,
  },
  [TenantTier.PROFESSIONAL]: {
    id: 'prod_HDc5ojbg2wWAyX',
    name: 'Professional',
    monthly: { id: 'plan_HDc5c9lhrISfr6', price: 30 },
    yearly: { id: 'plan_HDc552tQmFb09D', price: 300 },
    title: 'Popular with Experts',
    benefits: [
      'All “Explore” features',
      'See in-depth location match details',
      'See brand co-tenancies within each region',
      'See consumer personas that match your brand',
      '24hr support & premium services',
    ],
    type: TenantTier.PROFESSIONAL,
  },
};
