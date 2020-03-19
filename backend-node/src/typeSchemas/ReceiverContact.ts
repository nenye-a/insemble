import { inputObjectType } from 'nexus';

export let ReceiverContact = inputObjectType({
  name: 'ReceiverContact',
  definition(t) {
    t.string('name', { required: true });
    t.string('email', { required: true });
    t.string('phone', { required: true });
    t.string('role', { required: true });
  },
});
