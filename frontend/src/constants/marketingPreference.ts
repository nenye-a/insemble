import { MarketingPreference } from '../generated/globalTypes';

export type MarketingPreferenceRadio = {
  label: string;
  value: MarketingPreference;
};

export const MARKETING_PREFERENCE_OPTIONS: Array<MarketingPreferenceRadio> = [
  {
    label: 'Public — I want to publicly advertise my property to matching tenants.',
    value: MarketingPreference.PUBLIC,
  },
  {
    label:
      'Private — I want to connect with matching tenants without publicly listing my property.',
    value: MarketingPreference.PRIVATE,
  },
];
