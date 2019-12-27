const MAPS_API_KEY = process.env.GOOG_KEY || 'AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U';

export const MAPS_URI = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places,visualization`;

export const MAPS_IFRAME_URL_SEARCH = `https://www.google.com/maps/embed/v1/search?key=${MAPS_API_KEY}`;

export const MAPS_IFRAME_URL_PLACE = `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}`;
