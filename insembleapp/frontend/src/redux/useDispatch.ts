import { useDispatch as useDispatchBase } from 'react-redux';
import { Action } from '../types/Action';

type DispatchFn = (action: Action) => void;

function useDispatch(): DispatchFn {
  return useDispatchBase();
}

export default useDispatch;
