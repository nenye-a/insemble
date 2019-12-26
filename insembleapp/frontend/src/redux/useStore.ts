import { useStore as useStoreBase } from 'react-redux';
import { Action } from '../types/Action';
import { RootState } from '../types/RootState';

type DispatchFn = (action: Action) => void;
type Store = {
  dispatch: DispatchFn;
  getState: () => RootState;
};

function useStore(): Store {
  return useStoreBase();
}

export default useStore;
