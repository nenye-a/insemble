import { queryField, FieldResolver, stringArg } from 'nexus';

import { Root, Context } from 'serverTypes';

let mockPropertyDetails = {
  keyFacts: {
    mile: 1,
    daytimePop: 320000,
    mediumHouseholdIncome: 42000,
    totalHousehold: 120000,
    householdGrowth2017to2022: 20.21,
    numMetro: 3,
    numUniversities: 5,
    numHospitals: 9,
    numApartements: 7,
  },
  commute: [
    {
      name: 'Worked at Home',
      value: 7663,
    },
    {
      name: 'Walked',
      value: 2125,
    },
    {
      name: 'Bicycle',
      value: 883,
    },
    {
      name: 'Carpooled',
      value: 7166,
    },
    {
      name: 'Drove Alone',
      value: 90882,
    },
    {
      name: 'Public Transport',
      value: 2046,
    },
  ],
  topPersonas: [
    {
      percentile: 75,
      name: 'Hiphop culture',
      description:
        'Droping the beat Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum risus varius magna dignissim, in placerat ante blandit. Aliquam eu diam at leo facilisis dictum mattis eget metus. Duis luctus, massa eget rhoncus lobortis, felis eros dictum leo, nec suscipit magna sapien at lorem.',
      tags: ['Beats', 'Spotifuy', 'Soundcloud'],
    },
    {
      percentile: 73,
      name: 'Hipster',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum risus varius magna dignissim, in placerat ante blandit. Aliquam eu diam at leo facilisis dictum mattis eget metus. Duis luctus, massa eget rhoncus lobortis, felis eros dictum leo, nec suscipit magna sapien at lorem.',
      tags: ['Vintage', 'Antiques', 'Pioneer'],
    },
    {
      percentile: 70,
      name: 'Activism',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum risus varius magna dignissim, in placerat ante blandit. Aliquam eu diam at leo facilisis dictum mattis eget metus. Duis luctus, massa eget rhoncus lobortis, felis eros dictum leo, nec suscipit magna sapien at lorem.',
      tags: ['Advocate', 'Feminism', 'Soundcloud'],
    },
    {
      percentile: 69,
      name: 'Japan Culture',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vestibulum risus varius magna dignissim, in placerat ante blandit. Aliquam eu diam at leo facilisis dictum mattis eget metus. Duis luctus, massa eget rhoncus lobortis, felis eros dictum leo, nec suscipit magna sapien at lorem.',
      tags: ['Nice', 'Nice', 'Nice'],
    },
  ],
  demographics1: {
    age: [
      {
        name: '<18',
        myLocation: 12044,
      },
      {
        name: '18-24',
        myLocation: 1914,
      },
      {
        name: '25-34',
        myLocation: 8232,
      },
      {
        name: '35-44',
        myLocation: 6676,
      },
      {
        name: '45-54',
        myLocation: 6026,
      },
      {
        name: '55-64',
        myLocation: 5639,
      },
      {
        name: '65+',
        myLocation: 5702,
      },
    ],
    income: [
      {
        name: '<50K',
        myLocation: 7435,
      },
      {
        name: '$50K-$74K',
        myLocation: 2192,
      },
      {
        name: '$75K-$124K',
        myLocation: 2473,
      },
      {
        name: '$125K-$199K',
        myLocation: 1065,
      },
      {
        name: '$200K+',
        myLocation: 375,
      },
    ],
    ethnicity: [
      { name: 'white', myLocation: 10439.0 },
      { name: 'black', myLocation: 14575.0 },
      { name: 'indian', myLocation: 407.0 },
      { name: 'asian', myLocation: 308.0 },
      { name: 'pacific_islander', myLocation: 36.0 },
      { name: 'other', myLocation: 20819.0 },
    ],
    education: [
      { name: 'some_highschool', myLocation: 4095.0 },
      { name: 'high_school', myLocation: 9346.0 },
      { name: 'some_college', myLocation: 6718.0 },
      { name: 'associate', myLocation: 1596.0 },
      { name: 'bachelor', myLocation: 2465.0 },
      { name: 'masters', myLocation: 689.0 },
      { name: 'professional', myLocation: 109.0 },
      { name: 'doctorate', myLocation: 84.0 },
    ],
    gender: [
      {
        name: 'female',
        myLocation: 25261.0,
      },
      {
        name: 'male',
        myLocation: 23675.0,
      },
    ],
  },
  demographics3: {
    age: [
      {
        name: '<18',
        myLocation: 12044,
      },
      {
        name: '18-24',
        myLocation: 1914,
      },
      {
        name: '25-34',
        myLocation: 8232,
      },
      {
        name: '35-44',
        myLocation: 6676,
      },
      {
        name: '45-54',
        myLocation: 6026,
      },
      {
        name: '55-64',
        myLocation: 5639,
      },
      {
        name: '65+',
        myLocation: 5702,
      },
    ],
    income: [
      {
        name: '<50K',
        myLocation: 7435,
      },
      {
        name: '$50K-$74K',
        myLocation: 2192,
      },
      {
        name: '$75K-$124K',
        myLocation: 2473,
      },
      {
        name: '$125K-$199K',
        myLocation: 1065,
      },
      {
        name: '$200K+',
        myLocation: 375,
      },
    ],
    ethnicity: [
      { name: 'white', myLocation: 10439.0 },
      { name: 'black', myLocation: 14575.0 },
      { name: 'indian', myLocation: 407.0 },
      { name: 'asian', myLocation: 308.0 },
      { name: 'pacific_islander', myLocation: 36.0 },
      { name: 'other', myLocation: 20819.0 },
    ],
    education: [
      { name: 'some_highschool', myLocation: 4095.0 },
      { name: 'high_school', myLocation: 9346.0 },
      { name: 'some_college', myLocation: 6718.0 },
      { name: 'associate', myLocation: 1596.0 },
      { name: 'bachelor', myLocation: 2465.0 },
      { name: 'masters', myLocation: 689.0 },
      { name: 'professional', myLocation: 109.0 },
      { name: 'doctorate', myLocation: 84.0 },
    ],
    gender: [
      {
        name: 'female',
        myLocation: 25261.0,
      },
      {
        name: 'male',
        myLocation: 23675.0,
      },
    ],
  },
  demographics5: {
    age: [
      {
        name: '<18',
        myLocation: 12044,
      },
      {
        name: '18-24',
        myLocation: 1914,
      },
      {
        name: '25-34',
        myLocation: 8232,
      },
      {
        name: '35-44',
        myLocation: 6676,
      },
      {
        name: '45-54',
        myLocation: 6026,
      },
      {
        name: '55-64',
        myLocation: 5639,
      },
      {
        name: '65+',
        myLocation: 5702,
      },
    ],
    income: [
      {
        name: '<50K',
        myLocation: 7435,
      },
      {
        name: '$50K-$74K',
        myLocation: 2192,
      },
      {
        name: '$75K-$124K',
        myLocation: 2473,
      },
      {
        name: '$125K-$199K',
        myLocation: 1065,
      },
      {
        name: '$200K+',
        myLocation: 375,
      },
    ],
    ethnicity: [
      { name: 'white', myLocation: 10439.0 },
      { name: 'black', myLocation: 14575.0 },
      { name: 'indian', myLocation: 407.0 },
      { name: 'asian', myLocation: 308.0 },
      { name: 'pacific_islander', myLocation: 36.0 },
      { name: 'other', myLocation: 20819.0 },
    ],
    education: [
      { name: 'some_highschool', myLocation: 4095.0 },
      { name: 'high_school', myLocation: 9346.0 },
      { name: 'some_college', myLocation: 6718.0 },
      { name: 'associate', myLocation: 1596.0 },
      { name: 'bachelor', myLocation: 2465.0 },
      { name: 'masters', myLocation: 689.0 },
      { name: 'professional', myLocation: 109.0 },
      { name: 'doctorate', myLocation: 84.0 },
    ],
    gender: [
      {
        name: 'female',
        myLocation: 25261.0,
      },
      {
        name: 'male',
        myLocation: 23675.0,
      },
    ],
  },
};

let propertyDetailsResolver: FieldResolver<'Query', 'propertyDetails'> = async (
  _: Root,
  _args,
  _context: Context,
) => {
  return mockPropertyDetails;
};

let propertyDetails = queryField('propertyDetails', {
  type: 'PropertyDetailsResult',
  args: {
    propertyId: stringArg({ required: true }),
  },
  resolve: propertyDetailsResolver,
});

export { propertyDetails };
