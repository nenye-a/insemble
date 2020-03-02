import { objectType, interfaceType } from 'nexus';

export let PaymentMethodInterface = interfaceType({
  name: 'PaymentMethodInterface',
  definition(t) {
    t.string('id');
    t.int('expMonth');
    t.int('expYear');
    t.string('lastFourDigits');
    // NOTE: Adding this because nexus requires us to do so, or else it'll
    // show a warning in the console.
    t.resolveType(() => null);
  },
});

export let PaymentMethod = objectType({
  name: 'PaymentMethod',
  definition(t) {
    t.implements('PaymentMethodInterface');
  },
});

export let CustomerPaymentMethod = objectType({
  name: 'CustomerPaymentMethod',
  definition(t) {
    t.implements('PaymentMethodInterface');
    t.boolean('isDefault');
  },
});
