import { NewLocationPlan } from '../reducers/tenantOnboardingReducer';

export const NEW_LOCATION_PLAN_OPTIONS = [
  {
    label: 'Yes',
    value: NewLocationPlan.YES,
  },
  {
    label: 'Not actively, but willing to open new locations',
    value: NewLocationPlan.NOT_ACTIVE,
  },
  {
    label: 'Not planning to open any new locations within the year',

    value: NewLocationPlan.NOT_PLANNING,
  },
];
