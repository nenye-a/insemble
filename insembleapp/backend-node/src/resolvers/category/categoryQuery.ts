import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';

export interface CategoryWhereInput {
    category?: string | null;
    category_contains?: string | null;
}

type CategoryArgs = {
    where?: CategoryWhereInput,
    skip?: number,
    first?: number,
    last?: number,
}

// TODO: fetching categories can be cached
async function categories(
    _: Root,
    {where, skip, first, last} : CategoryArgs,
    _context: Context,
) {
    let categories: Array<string> = (await axios.get(`${LEGACY_API_URI}/api/category`)).data;

    if (first && last) {
        return { errors: ["Error"]}; // TODO: how to properly error?
    }

    // Process where input
    if (where) {
        let {category, category_contains: categoryContains} = where;

        if (typeof category === 'string') {
            categories = categories.filter((x) => x === category);
        }
        if (typeof categoryContains === 'string') {
            categories = categories.filter((x) => x.includes(categoryContains));
        }
    }

    // Process pagination
    if (skip) {
        categories = categories.slice(skip, categories.length);
    }
    if (first) {
        categories = categories.slice(0, first);
    }
    if (last) {
        categories = categories.slice(categories.length - last, categories.length);
    }

    return categories;
}

export { categories };
