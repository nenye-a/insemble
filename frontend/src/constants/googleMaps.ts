const MAPS_API_KEY = process.env.GOOG_KEY || 'AIzaSyCJjsXi3DbmlB1soI9kHzANRqVkiWj3P2U';

export const MAPS_URI = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&v=3.exp&libraries=geometry,drawing,places,visualization`;

export const MAPS_IFRAME_URL_SEARCH = `https://www.google.com/maps/embed/v1/search?key=${MAPS_API_KEY}`;

export const MAPS_IFRAME_URL_PLACE = `https://www.google.com/maps/embed/v1/place?key=${MAPS_API_KEY}`;

export const MAP_DEFAULT_CENTER = { lat: 34.0522, lng: -118.2437 }; // LA lat lng

type MapStyle = Array<google.maps.MapTypeStyle>;
export const GOOGLE_MAPS_STYLE: any = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    elementType: 'labels',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    stylers: [
      {
        color: '#a19174',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.business',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'poi.business',
    elementType: 'labels.text',
    stylers: [
      {
        color: '#a9a9a9',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#9da481',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on',
      },
      {
        weight: 1.5,
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#000000',
      },
      {
        lightness: 80,
      },
      {
        weight: 1,
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0dee1',
      },
      {
        visibility: 'off',
      },
      {
        weight: 1,
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'labels',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'transit.station.airport',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station.bus',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station.bus',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'transit.station.rail',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9d5f1',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];
