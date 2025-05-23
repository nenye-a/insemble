import { useState } from 'react';

import loadScript from './loadScript';
import { MAPS_URI } from '../constants/googleMaps';

type GoogleMaps = typeof globalThis.google.maps;

let googleMaps: null | GoogleMaps = null;
let loadingPromise: null | Promise<GoogleMaps> = null;

function useGoogleMaps() {
  let [isLoading, setLoading] = useState(googleMaps == null);
  if (!googleMaps) {
    if (!loadingPromise) {
      loadingPromise = loadScript(MAPS_URI).then(() => (googleMaps = window.google.maps));
    }
    loadingPromise.then(() => {
      setLoading(false);
    });
  }
  return { isLoading, maps: googleMaps };
}

export default useGoogleMaps;
