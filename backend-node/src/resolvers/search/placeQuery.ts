import { queryField, FieldResolver, stringArg } from 'nexus';
import axios from 'axios';

import { Root } from 'serverTypes';
import { GOOGLE_API, GOOGLE_API_KEY } from '../../constants/constants';
import { GooglePlace } from 'dataTypes';

let placeResolver: FieldResolver<'Query', 'place'> = async (
  _: Root,
  { address },
) => {
  // eslint-disable-next-line @typescript-eslint/camelcase
  let { place_id }: { place_id: string } = (
    await axios.get(`${GOOGLE_API}/maps/api/place/autocomplete/json`, {
      params: {
        input: address,
        key: GOOGLE_API_KEY,
      },
    })
  ).data.predictions[0] || { place_id: undefined };
  // eslint-disable-next-line @typescript-eslint/camelcase
  if (!place_id) {
    throw new Error('No suggestion');
  }
  let {
    // eslint-disable-next-line @typescript-eslint/camelcase
    formatted_address,
    id,
    geometry: {
      location,
      viewport: { northeast, southwest },
    },
    name,
  }: GooglePlace = (
    await axios.get(`${GOOGLE_API}/maps/api/place/details/json`, {
      params: {
        placeid: place_id,
        key: GOOGLE_API_KEY,
      },
    })
  ).data.result;

  return {
    id,
    name,
    formattedAddress: formatted_address,
    location: { lat: location.lat.toString(), lng: location.lng.toString() },
    viewport: {
      southwest: {
        lat: southwest.lat.toString(),
        lng: southwest.lng.toString(),
      },
      northeast: {
        lat: northeast.lat.toString(),
        lng: northeast.lng.toString(),
      },
    },
  };
};

let place = queryField('place', {
  type: 'GooglePlace',
  args: {
    address: stringArg({ required: true }),
  },
  resolve: placeResolver,
});

export { place };
