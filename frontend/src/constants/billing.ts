import createContext from '../utils/createContext';

type BillingCtx = {
  refetchPaymentList: () => Promise<unknown>;
};

export let [useBillingContext, BillingContextProvider] = createContext<BillingCtx>();
