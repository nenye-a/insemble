import { objectType } from 'nexus';

export let Conversation = objectType({
  name: 'Conversation',
  definition(t) {
    t.model.id();
    t.model.brand();
    t.model.landlord();
    t.model.space();
    t.model.header();
    t.model.tenant();
    t.model.messages();
    t.model.matchScore();
    t.model.property();
    t.model.createdAt();
    t.model.matchScore();
  },
});
