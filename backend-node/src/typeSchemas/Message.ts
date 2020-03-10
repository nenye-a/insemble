import { objectType } from 'nexus';

export let Message = objectType({
  name: 'Message',
  definition(t) {
    t.model.id();
    t.model.message();
    t.field('sender', { type: 'SenderRole' });
    t.model.createdAt();
  },
});
