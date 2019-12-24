import { useSelector as useSelectorBase } from 'react-redux';
import { RootState } from '../types/RootState';

function useSelector<T>(selector: (state: RootState) => T): T {
  return useSelectorBase(selector);
}

export default useSelector;
