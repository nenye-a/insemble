import { objectType } from 'nexus';

export let PropertyThumbnail = objectType({
  name: 'PropertyThumbnail',
  definition(t) {
    t.model('Property').id();
    t.model('Property').propertyId();
    t.model('Property').name();
    t.model('Property').categories();
    t.model('Property').location();
    t.field('space', { type: 'Space', list: true });
  },
});
