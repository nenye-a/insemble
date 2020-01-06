type LatLngLiteral = google.maps.LatLngLiteral;

type StringLatLng = {
  lat: string;
  lng: string;
};

function encodeFloat(value: number): string {
  return value.toFixed(6).replace('.', '');
}

export default function urlSafeLatLng(latLng: LatLngLiteral): StringLatLng {
  let { lat, lng } = latLng;
  return {
    lat: encodeFloat(lat),
    lng: encodeFloat(lng),
  };
}
