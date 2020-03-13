import { useContext } from 'react';
import { ViewportListenerContext } from '../core-ui/ViewportListener';

export default function useViewport() {
  return useContext(ViewportListenerContext);
}
