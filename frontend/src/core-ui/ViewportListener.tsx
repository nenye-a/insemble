import React, { ReactElement, useState, useEffect, useMemo, createContext } from 'react';
import { VIEWPORT_TYPE } from '../constants/viewports';
import getViewportType from '../utils/getViewportType';

type Props = {
  children: ReactElement;
};

type ViewportListenerContext = {
  viewportType: VIEWPORT_TYPE;
};

let defaultContextValue = {
  viewportType: VIEWPORT_TYPE.DESKTOP,
};

export let ViewportListenerContext = createContext<ViewportListenerContext>(defaultContextValue);

export default function ViewportListener({ children }: Props) {
  let [viewportType, setViewportType] = useState(getViewportType(window.innerWidth));

  useEffect(() => {
    let onResize = () => {
      let type = getViewportType(window.innerWidth);
      setViewportType(type);
    };

    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  let value = useMemo(() => ({ viewportType }), [viewportType]);
  return (
    <ViewportListenerContext.Provider value={value}>{children}</ViewportListenerContext.Provider>
  );
}
