import { queryField, FieldResolver, stringArg } from 'nexus';
import axios from 'axios';

import { Root } from 'serverTypes';
import { GOOGLE_API, GOOGLE_API_KEY } from '../../constants/constants';
import { GooglePlace } from 'dataTypes';

let placeResolver: FieldResolver<'Query', 'place'> = async (
  _: Root,
  { address },
) => {
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
    await axios.get(`${GOOGLE_API}/maps/api/place/textsearch/json`, {
      params: {
        query: address,
        key: GOOGLE_API_KEY,
      },
    })
  ).data.results[0];
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
