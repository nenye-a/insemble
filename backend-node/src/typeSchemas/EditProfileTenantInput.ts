import { inputObjectType } from 'nexus';

export let EditProfileTenantInput = inputObjectType({
  name: 'EditProfileTenantInput',
  definition(t) {
    t.string('email');
    t.string('firstName');
    t.string('lastName');
    t.string('company');
    t.string('title');
    t.string('phoneNumber');
    t.string('description');
    t.string('oldPassword');
    t.string('newPassword');
  },
});
