import { inputObjectType, objectType } from 'nexus';

export let ReceiverContactInput = inputObjectType({
  name: 'ReceiverContactInput',
  definition(t) {
    t.string('name', { required: true });
    t.string('email', { required: true });
    t.string('phone', { required: true });
    t.string('role', { required: true });
  },
});

export let ReceiverContact = objectType({
  name: 'ReceiverContact',
  definition(t) {
    t.string('name');
    t.string('email');
    t.string('phone');
    t.string('role');
  },
});
