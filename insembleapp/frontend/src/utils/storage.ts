const JSON_PREFIX = '$#';
const SEPARATOR = ':';

type State = {
  place: undefined | google.maps.places.PlaceResult;
  sessionStoreName: undefined | string;
  sessionIncome: undefined | number;
  sessionTags: undefined | Array<string>;
  sessionAddress: undefined | string;
  mapLoaded: undefined | boolean;
  locationLoaded: undefined | boolean;
  hasLocation: undefined | boolean;
  location: undefined | { [key: string]: unknown };
  heatMap: undefined | { [key: string]: unknown };
  temp_location: undefined | { [key: string]: unknown };
};

/**
 * This can be called with an optional second parameter, a string identifier
 * such as the id of the entity we're getting. For example:
 * get('user', userID);
 * This way we can still be type-safe since the first param must be a key of State.
 */
function get<K extends keyof State>(key: K, id?: string): State[K] {
  let storageKey = id ? key + SEPARATOR + id : key;
  let value = sessionStorage.getItem(storageKey);
  if (typeof value === 'string' && value.startsWith(JSON_PREFIX)) {
    let jsonStr = value.slice(JSON_PREFIX.length);
    try {
      return JSON.parse(jsonStr);
    } catch (e) {
      return undefined;
    }
  }
  return value as any;
}

/**
 * This can be called in two ways:
 * set('myKey', {my: 'value});
 * set(['user', userID], userData);
 * In the second case, we can attach an identifier (userID) to the key.
 */
function set<K extends keyof State>(keyInput: K | [K, string], value: State[K]): void {
  let key: K;
  let id: string | null = null;
  if (Array.isArray(keyInput)) {
    key = keyInput[0];
    id = keyInput[1];
  } else {
    key = keyInput;
  }
  let storageKey = id ? key + SEPARATOR + id : key;
  let stringValue: string;
  if (typeof value === 'string') {
    stringValue = value;
  } else {
    stringValue = JSON_PREFIX + JSON.stringify(value);
  }
  sessionStorage.setItem(storageKey, stringValue);
}

export const session = { get, set };
