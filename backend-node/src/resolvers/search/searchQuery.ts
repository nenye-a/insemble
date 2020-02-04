import { Root, Context } from 'serverTypes';
import axios from 'axios';

import { LEGACY_API_URI } from '../../constants/host';

type SearchInput = {
    categories: Array<string>,
    target_income: number,
    target_age?: [number, number],
    target_psychographics?: Array<string>,
    // property_criteria: object, // TODO: type. gql needs it
}

async function search(_: Root, args : SearchInput, _ctx: Context) {
    let response = (await axios.post(`${LEGACY_API_URI}/api/search/`, args));

    return {
        // eslint-disable-next-line no-underscore-dangle
        id: response.data._id,
    }
}

export { search };
