import { FieldResolver, queryField, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

let tenantDetailResolver: FieldResolver<'Query', 'tenantDetail'> = async (
  _: Root,
  __,
  ___: Context,
) => {
  return {
    name: 'California Cheeseburgers',
    category: 'Hamburger Restaurant',
    keyFacts: {
      tenantPerformance: {
        storeCount: 1,
        averageReviews: 254,
        operationYears: 7,
        rating: 4.1,
      },
    },
    tenantView: {
      overview:
        'Actively looking for retail and restaurant space in Greater Los Angeles, San Francisco, and Waco, TX.',
      description:
        'Spitz Diner is a fast casual Turkish diner with 2 existing locations (one in Los Angeles’s very own Little Tokyo), looking to expand by 10 locations in the upcoming year. We look for spaces about 3200 - 4000 square foot, and are happy exploring white box and second generation locations.',
      minSqft: 4000,
      maxSqft: 5200,
      ceilingHeight: 40,
      condition: 'White Box',
    },
    insightView: {
      topPersonas: [
        {
          photo: '',
          percentile: 0.6,
          name: 'Trendy Eats',
          description:
            'Meals are a social experience, and these foodies take it to the next level. This segment can’t wait to snap a pic of their plate and share it before chowing down.',
          tags: [
            'Yum',
            'Lunchtime',
            '#goodeats',
            'Tuna',
            'Sushi',
            'Burritos',
            'Kale',
            'Brisket',
            '#getinmybelly',
            'Steak',
            'Feasts',
            'Sausage',
            'Tofu',
            'Ribs',
          ],
        },
      ],
      demographics1: {
        age: [
          {
            name: '<18',
            myLocation: 12044.0,
            targetLocation: 5424.0,
          },
          {
            name: '18-24',
            myLocation: 1914.0,
            targetLocation: 965.0,
          },
          {
            name: '25-34',
            myLocation: 8232.0,
            targetLocation: 4065.0,
          },
          {
            name: '35-44',
            myLocation: 6676.0,
            targetLocation: 3885.0,
          },
          {
            name: '45-54',
            myLocation: 6026.0,
            targetLocation: 4397.0,
          },
          {
            name: '55-64',
            myLocation: 5639.0,
            targetLocation: 4546.0,
          },
          {
            name: '65+',
            myLocation: 5702.0,
            targetLocation: 5048.0,
          },
        ],
        income: [
          {
            name: '<50K',
            myLocation: 7435.0,
            targetLocation: 2825.0,
          },
          {
            name: '$50K-$74K',
            myLocation: 2192.0,
            targetLocation: 1621.0,
          },
          {
            name: '$75K-$124K',
            myLocation: 2473.0,
            targetLocation: 2622.0,
          },
          {
            name: '$125K-$199K',
            myLocation: 1065.0,
            targetLocation: 2240.0,
          },
          {
            name: '$200K+',
            myLocation: 375.0,
            targetLocation: 2063.0,
          },
        ],
        ethnicity: [
          {
            name: 'white',
            myLocation: 10439.0,
            targetLocation: 14432.0,
          },
          {
            name: 'black',
            myLocation: 14575.0,
            targetLocation: 1074.0,
          },
          {
            name: 'indian',
            myLocation: 407.0,
            targetLocation: 148.0,
          },
          {
            name: 'asian',
            myLocation: 308.0,
            targetLocation: 10776.0,
          },
          {
            name: 'pacific_islander',
            myLocation: 36.0,
            targetLocation: 67.0,
          },
          {
            name: 'other',
            myLocation: 20819.0,
            targetLocation: 1372.0,
          },
        ],
        education: [
          {
            name: 'some_highschool',
            myLocation: 4095.0,
            targetLocation: 865.0,
          },
          {
            name: 'high_school',
            myLocation: 9346.0,
            targetLocation: 3174.0,
          },
          {
            name: 'some_college',
            myLocation: 6718.0,
            targetLocation: 4019.0,
          },
          {
            name: 'associate',
            myLocation: 1596.0,
            targetLocation: 1619.0,
          },
          {
            name: 'bachelor',
            myLocation: 2465.0,
            targetLocation: 7937.0,
          },
          {
            name: 'masters',
            myLocation: 689.0,
            targetLocation: 2937.0,
          },
          {
            name: 'professional',
            myLocation: 109.0,
            targetLocation: 598.0,
          },
          {
            name: 'doctorate',
            myLocation: 84.0,
            targetLocation: 287.0,
          },
        ],
        gender: [
          {
            name: 'female',
            myLocation: 25261.0,
            targetLocation: 15121.0,
          },
          {
            name: 'male',
            myLocation: 23675.0,
            targetLocation: 14630.0,
          },
        ],
      },
      demographics3: {
        age: [
          {
            name: '<18',
            myLocation: 12044.0,
            targetLocation: 5424.0,
          },
          {
            name: '18-24',
            myLocation: 1914.0,
            targetLocation: 965.0,
          },
          {
            name: '25-34',
            myLocation: 8232.0,
            targetLocation: 4065.0,
          },
          {
            name: '35-44',
            myLocation: 6676.0,
            targetLocation: 3885.0,
          },
          {
            name: '45-54',
            myLocation: 6026.0,
            targetLocation: 4397.0,
          },
          {
            name: '55-64',
            myLocation: 5639.0,
            targetLocation: 4546.0,
          },
          {
            name: '65+',
            myLocation: 5702.0,
            targetLocation: 5048.0,
          },
        ],
        income: [
          {
            name: '<50K',
            myLocation: 7435.0,
            targetLocation: 2825.0,
          },
          {
            name: '$50K-$74K',
            myLocation: 2192.0,
            targetLocation: 1621.0,
          },
          {
            name: '$75K-$124K',
            myLocation: 2473.0,
            targetLocation: 2622.0,
          },
          {
            name: '$125K-$199K',
            myLocation: 1065.0,
            targetLocation: 2240.0,
          },
          {
            name: '$200K+',
            myLocation: 375.0,
            targetLocation: 2063.0,
          },
        ],
        ethnicity: [
          {
            name: 'white',
            myLocation: 10439.0,
            targetLocation: 14432.0,
          },
          {
            name: 'black',
            myLocation: 14575.0,
            targetLocation: 1074.0,
          },
          {
            name: 'indian',
            myLocation: 407.0,
            targetLocation: 148.0,
          },
          {
            name: 'asian',
            myLocation: 308.0,
            targetLocation: 10776.0,
          },
          {
            name: 'pacific_islander',
            myLocation: 36.0,
            targetLocation: 67.0,
          },
          {
            name: 'other',
            myLocation: 20819.0,
            targetLocation: 1372.0,
          },
        ],
        education: [
          {
            name: 'some_highschool',
            myLocation: 4095.0,
            targetLocation: 865.0,
          },
          {
            name: 'high_school',
            myLocation: 9346.0,
            targetLocation: 3174.0,
          },
          {
            name: 'some_college',
            myLocation: 6718.0,
            targetLocation: 4019.0,
          },
          {
            name: 'associate',
            myLocation: 1596.0,
            targetLocation: 1619.0,
          },
          {
            name: 'bachelor',
            myLocation: 2465.0,
            targetLocation: 7937.0,
          },
          {
            name: 'masters',
            myLocation: 689.0,
            targetLocation: 2937.0,
          },
          {
            name: 'professional',
            myLocation: 109.0,
            targetLocation: 598.0,
          },
          {
            name: 'doctorate',
            myLocation: 84.0,
            targetLocation: 287.0,
          },
        ],
        gender: [
          {
            name: 'female',
            myLocation: 25261.0,
            targetLocation: 15121.0,
          },
          {
            name: 'male',
            myLocation: 23675.0,
            targetLocation: 14630.0,
          },
        ],
      },
      demographics5: {
        age: [
          {
            name: '<18',
            myLocation: 12044.0,
            targetLocation: 5424.0,
          },
          {
            name: '18-24',
            myLocation: 1914.0,
            targetLocation: 965.0,
          },
          {
            name: '25-34',
            myLocation: 8232.0,
            targetLocation: 4065.0,
          },
          {
            name: '35-44',
            myLocation: 6676.0,
            targetLocation: 3885.0,
          },
          {
            name: '45-54',
            myLocation: 6026.0,
            targetLocation: 4397.0,
          },
          {
            name: '55-64',
            myLocation: 5639.0,
            targetLocation: 4546.0,
          },
          {
            name: '65+',
            myLocation: 5702.0,
            targetLocation: 5048.0,
          },
        ],
        income: [
          {
            name: '<50K',
            myLocation: 7435.0,
            targetLocation: 2825.0,
          },
          {
            name: '$50K-$74K',
            myLocation: 2192.0,
            targetLocation: 1621.0,
          },
          {
            name: '$75K-$124K',
            myLocation: 2473.0,
            targetLocation: 2622.0,
          },
          {
            name: '$125K-$199K',
            myLocation: 1065.0,
            targetLocation: 2240.0,
          },
          {
            name: '$200K+',
            myLocation: 375.0,
            targetLocation: 2063.0,
          },
        ],
        ethnicity: [
          {
            name: 'white',
            myLocation: 10439.0,
            targetLocation: 14432.0,
          },
          {
            name: 'black',
            myLocation: 14575.0,
            targetLocation: 1074.0,
          },
          {
            name: 'indian',
            myLocation: 407.0,
            targetLocation: 148.0,
          },
          {
            name: 'asian',
            myLocation: 308.0,
            targetLocation: 10776.0,
          },
          {
            name: 'pacific_islander',
            myLocation: 36.0,
            targetLocation: 67.0,
          },
          {
            name: 'other',
            myLocation: 20819.0,
            targetLocation: 1372.0,
          },
        ],
        education: [
          {
            name: 'some_highschool',
            myLocation: 4095.0,
            targetLocation: 865.0,
          },
          {
            name: 'high_school',
            myLocation: 9346.0,
            targetLocation: 3174.0,
          },
          {
            name: 'some_college',
            myLocation: 6718.0,
            targetLocation: 4019.0,
          },
          {
            name: 'associate',
            myLocation: 1596.0,
            targetLocation: 1619.0,
          },
          {
            name: 'bachelor',
            myLocation: 2465.0,
            targetLocation: 7937.0,
          },
          {
            name: 'masters',
            myLocation: 689.0,
            targetLocation: 2937.0,
          },
          {
            name: 'professional',
            myLocation: 109.0,
            targetLocation: 598.0,
          },
          {
            name: 'doctorate',
            myLocation: 84.0,
            targetLocation: 287.0,
          },
        ],
        gender: [
          {
            name: 'female',
            myLocation: 25261.0,
            targetLocation: 15121.0,
          },
          {
            name: 'male',
            myLocation: 23675.0,
            targetLocation: 14630.0,
          },
        ],
      },
    },
  };
};

let tenantDetailQuery = queryField('tenantDetail', {
  type: 'TenantDetailsResult',
  args: { brandId: stringArg({ required: true }) },
  resolve: tenantDetailResolver,
});

export { tenantDetailQuery };
