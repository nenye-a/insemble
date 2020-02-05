import { Root, Context } from 'serverTypes';
import axios from 'axios';

import { LEGACY_API_URI } from '../../constants/host';

type SearchInput = {
    categories: Array<string>,
    target_income: number,
    target_age?: {
        min: number,
        max: number,
    },
    target_psychographics?: Array<string>,
    // property_criteria: object, // TODO: type. gql needs it
}

async function search(_: Root, args : SearchInput, _ctx: Context) {
    // Convert target_age from object format to [min, max] array format the backend expects
    let data;
    if (args.target_age != null) {
        let tAge = args.target_age;
        data = { ...args, target_age: [tAge.min, tAge.max]};
    } else {
        data = args;
    }

    let response = (await axios.post(`${LEGACY_API_URI}/api/search/`, data));

    return {
        // eslint-disable-next-line no-underscore-dangle
        id: response.data._id,
    }
}

export { search };
