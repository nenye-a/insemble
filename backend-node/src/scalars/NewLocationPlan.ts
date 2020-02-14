import { enumType } from 'nexus';

export let NewLocationPlan = enumType({
  name: 'NewLocationPlan',
  members: ['YES', 'NOT_ACTIVE', 'NOT_PLANNING'],
});
