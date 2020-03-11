import { inputObjectType } from 'nexus';

export let MessageInput = inputObjectType({
  name: 'MessageInput',
  definition(t) {
    t.string('message', { required: true });
    t.field('senderRole', { type: 'SenderRole', required: true });
  },
});
