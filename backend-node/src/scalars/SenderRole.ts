import { enumType } from 'nexus';

export let SenderRole = enumType({
  name: 'SenderRole',
  members: ['TENANT', 'LANDLORD'],
});
