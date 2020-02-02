const JSON_PREFIX = '$#';
const SEPARATOR = ':';

type State = {
  place: google.maps.places.PlaceResult;
  sessionStoreName: string;
  sessionIncome: number;
  sessionTags: Array<string>;
  sessionAddress: string;
  mapLoaded: boolean;
  locationLoaded: boolean;
  hasLocation: boolean;
  location: unknown;
  heatMap: unknown;
  temp_location: unknown;
};

/**
 * This can be called with an optional second parameter, a string identifier
 * such as the id of the entity we're getting. For example:
 * get('user', userID);
 * This way we can still be type-safe since the first param must be a key of State.
 */
function get<K extends keyof State>(key: K, id?: string): State[K] | undefined {
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

function remove<K extends keyof State>(key: K, id?: string): void {
  let storageKey = id ? key + SEPARATOR + id : key;
  sessionStorage.removeItem(storageKey);
}

export const session = { get, set, remove };
