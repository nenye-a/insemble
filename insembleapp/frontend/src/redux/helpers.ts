import {
  useDispatch as useDispatchBase,
  useSelector as useSelectorBase,
  useStore as useStoreBase,
} from 'react-redux';

import { Action } from '../types/Action';
import { RootState } from '../types/RootState';

type DispatchFn = (action: Action) => void;

type Store = {
  dispatch: DispatchFn;
  getState: () => RootState;
};

export function useDispatch(): DispatchFn {
  return useDispatchBase();
}

export function useSelector<T>(selector: (state: RootState) => T): T {
  return useSelectorBase(selector);
}

export function useStore(): Store {
  return useStoreBase();
}
