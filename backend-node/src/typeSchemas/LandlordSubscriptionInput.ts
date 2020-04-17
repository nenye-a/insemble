import { inputObjectType } from 'nexus';

export let LandlordSubscriptionInput = inputObjectType({
  name: 'LandlordSubscriptionInput',
  definition(t) {
    t.string('planId', { required: true });
    t.string('spaceId', { required: true });
  },
});
