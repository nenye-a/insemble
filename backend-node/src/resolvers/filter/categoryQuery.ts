import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField } from 'nexus';
import { FilterOptions } from 'dataTypes';

export interface CategoryWhereInput {
  category?: string | null;
  category_contains?: string | null;
}

type CategoryArgs = {
  where?: CategoryWhereInput;
  skip?: number;
  first?: number;
  last?: number;
};

// TODO: add categoryArgs
let categories = queryField('categories', {
  type: 'String',
  list: true,
  resolve: categoriesResolver,
});

// TODO: fetching categories can be cached
async function categoriesResolver(
  _: Root,
  { where, skip, first, last }: CategoryArgs,
  _context: Context,
) {
  if (first && last) {
    throw new Error(
      'Including a value for both first and last is not supported.',
    );
  }

  let { brand_categories: categories }: FilterOptions = (
    await axios.get(`${LEGACY_API_URI}/api/filter/`)
  ).data;

  // Process where input
  if (where) {
    let { category, category_contains: categoryContains } = where;

    if (typeof category === 'string') {
      categories = categories.filter((x) => x === category);
    }
    if (typeof categoryContains === 'string') {
      categories = categories.filter((x) =>
        x.includes(categoryContains ? categoryContains : ''),
      );
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
