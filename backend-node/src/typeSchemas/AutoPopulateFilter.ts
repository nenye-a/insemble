import { objectType } from 'nexus';

export let AutoPopulate = objectType({
  name: 'AutoPopulate',
  definition(t) {
    t.string('categories', { list: true });
    t.string('personas', { list: true });
    t.field('income', {
      type: 'Income',
    });
    t.field('age', {
      type: 'Age',
    });
  },
});

export let Income = objectType({
  name: 'Income',
  definition(t) {
    t.int('min');
    t.int('max');
  },
});

export let Age = objectType({
  name: 'Age',
  definition(t) {
    t.int('min');
    t.int('max');
  },
});
