import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField, arg } from 'nexus';
import { LocationDetailsType, DemographicStat } from 'dataTypes';

let locationDetails = queryField('locationDetails', {
  type: 'LocationDetailsResult',
  args: {
    brandId: arg({ type: 'String', required: true }),
    selectedLocation: arg({ type: 'LocationInput' }),
    selectedPropertyId: arg({ type: 'String' }),
  },
  resolve: async (
    _: Root,
    { brandId, selectedLocation, selectedPropertyId },
    context: Context,
  ) => {
    if (!selectedLocation && !selectedPropertyId) {
      throw new Error(
        'Please provide either selectedLocation or selectedPropertyId!',
      );
    }
    let selectedBrand = await context.prisma.brand.findOne({
      where: { id: brandId },
      include: {
        location: true,
      },
    });
    if (!selectedBrand) {
      throw new Error('Brand not found!');
    }
    let { categories, location, name, maxIncome, minIncome } = selectedBrand;

    if (
      !(name && location && categories.length > 0) &&
      !(categories.length > 0 && minIncome)
    ) {
      throw new Error(
        'Please update your brand and provide either (address, brand_name and categories) or (categories and income)',
      );
    }

    let {
      property_details: rawPropertyDetails,
      overview,
    }: LocationDetailsType = (
      await axios.get(`${LEGACY_API_URI}/api/locationDetails`, {
        params: {
          my_location: {
            address: location?.address,
            brand_name: name,
            categories:
              categories.length > 0 ? JSON.stringify(categories) : undefined,
            income: minIncome && {
              min: maxIncome,
              max: maxIncome,
            },
          },
          target_location: selectedLocation && {
            lat: selectedLocation.lat,
            lng: selectedLocation.lng,
          },
          property_id: selectedPropertyId,
        },
      })
    ).data;

    let {
      match_value: matchValue,
      affinities,
      key_facts: keyFacts,
      commute,
      top_personas: topPersonas,
      demographics1,
      demographics3,
      demographics5,
      nearby,
    } = overview;

    let {
      num_apartments: numApartements,
      num_hospitals: numHospitals,
      num_metro: numMetro,
      num_universities: numUniversities,
      'HouseholdGrowth2017-2022': householdGrowth2017to2022,
      DaytimePop: daytimePop,
      MediumHouseholdIncome: mediumHouseholdIncome,
      TotalHousholds: totalHousehold,
      mile,
    } = keyFacts;

    let {
      'Drove Alone': droveAlone,
      'Public Transport': publicTransport,
      'Worked at Home': workAtHome,
      Bicycle: bicycle,
      Carpooled: carpooled,
      Walked: walked,
    } = commute;

    let demographicsStatConvert = ({
      growth,
      target_location: targetLocation,
      my_location: myLocation,
    }: DemographicStat) => {
      return {
        growth,
        myLocation,
        targetLocation,
      };
    };
    let {
      age: {
        '<18': under18D1,
        '18-24': between18To24D1,
        '25-34': between25To34D1,
        '35-44': between35To44D1,
        '45-54': between45To54D1,
        '55-64': between55To64D1,
        '65+': above65D1,
      },
      income: {
        '<$50K': under50KUsdD1,
        '$50K-$74K': between50to74KUsdD1,
        '$75K-$124K': between75to124KUsdD1,
        '$125K-$199K': between125to199KUsdD1,
        $200K: above200KUsdD1,
      },
      ethnicity: {
        white: whiteD1,
        black: blackD1,
        indian: indianD1,
        asian: asianD1,
        pacific_islander: pacificIslanderD1,
        other: otherD1,
      },
      education: {
        some_highschool: someHighschoolD1,
        highschool: highschoolD1,
        some_college: someCollegeD1,
        associate: associateD1,
        bachelor: bachelorD1,
        doctorate: doctorateD1,
        masters: mastersD1,
        professional: professionalD1,
      },
      gender: { male: maleD1, female: femaleD1 },
    } = demographics1;

    let {
      age: {
        '<18': under18D3,
        '18-24': between18To24D3,
        '25-34': between25To34D3,
        '35-44': between35To44D3,
        '45-54': between45To54D3,
        '55-64': between55To64D3,
        '65+': above65D3,
      },
      income: {
        '<$50K': under50KUsdD3,
        '$50K-$74K': between50to74KUsdD3,
        '$75K-$124K': between75to124KUsdD3,
        '$125K-$199K': between125to199KUsdD3,
        $200K: above200KUsdD3,
      },
      ethnicity: {
        white: whiteD3,
        black: blackD3,
        indian: indianD3,
        asian: asianD3,
        pacific_islander: pacificIslanderD3,
        other: otherD3,
      },
      education: {
        some_highschool: someHighschoolD3,
        highschool: highschoolD3,
        some_college: someCollegeD3,
        associate: associateD3,
        bachelor: bachelorD3,
        doctorate: doctorateD3,
        masters: mastersD3,
        professional: professionalD3,
      },
      gender: { male: maleD3, female: femaleD3 },
    } = demographics3;

    let {
      age: {
        '<18': under18D5,
        '18-24': between18To24D5,
        '25-34': between25To34D5,
        '35-44': between35To44D5,
        '45-54': between45To54D5,
        '55-64': between55To64D5,
        '65+': above65D5,
      },
      income: {
        '<$50K': under50KUsdD5,
        '$50K-$74K': between50to74KUsdD5,
        '$75K-$124K': between75to124KUsdD5,
        '$125K-$199K': between125to199KUsdD5,
        $200K: above200KUsdD5,
      },
      ethnicity: {
        white: whiteD5,
        black: blackD5,
        indian: indianD5,
        asian: asianD5,
        pacific_islander: pacificIslanderD5,
        other: otherD5,
      },
      education: {
        some_highschool: someHighschoolD5,
        highschool: highschoolD5,
        some_college: someCollegeD5,
        associate: associateD5,
        bachelor: bachelorD5,
        doctorate: doctorateD5,
        masters: mastersD5,
        professional: professionalD5,
      },
      gender: { male: maleD5, female: femaleD5 },
    } = demographics5;

    let tsNearby = nearby.map(
      ({ number_rating: numberRating, ...theRestNearby }) => {
        return { numberRating, ...theRestNearby };
      },
    );

    let {
      '3D_tour': tour3D,
      main_photo: mainPhoto,
      sqft,
      photos,
      summary: { 'price/sqft': pricePerSqft, ...restSummary },
      description,
    } = rawPropertyDetails;

    return {
      overview: {
        matchValue,
        affinities,
        keyFacts: {
          mile,
          householdGrowth2017to2022,
          numApartements,
          numMetro,
          numHospitals,
          numUniversities,
          daytimePop,
          totalHousehold,
          mediumHouseholdIncome,
        },
        commute: {
          publicTransport,
          bicycle,
          carpooled,
          droveAlone,
          walked,
          workAtHome,
        },
        topPersonas,
        demographics1: {
          age: {
            under18: demographicsStatConvert(under18D1),
            between18To24: demographicsStatConvert(between18To24D1),
            between25To34: demographicsStatConvert(between25To34D1),
            between35To44: demographicsStatConvert(between35To44D1),
            between45To54: demographicsStatConvert(between45To54D1),
            between55To64: demographicsStatConvert(between55To64D1),
            above65: demographicsStatConvert(above65D1),
          },
          income: {
            under50KUsd: demographicsStatConvert(under50KUsdD1),
            between50to74KUsd: demographicsStatConvert(between50to74KUsdD1),
            between75to124KUsd: demographicsStatConvert(between75to124KUsdD1),
            between125to199KUsd: demographicsStatConvert(between125to199KUsdD1),
            above200KUsd: demographicsStatConvert(above200KUsdD1),
          },
          ethnicity: {
            white: demographicsStatConvert(whiteD1),
            black: demographicsStatConvert(blackD1),
            indian: demographicsStatConvert(indianD1),
            asian: demographicsStatConvert(asianD1),
            pacificIslander: demographicsStatConvert(pacificIslanderD1),
            other: demographicsStatConvert(otherD1),
          },
          education: {
            someHighschool: demographicsStatConvert(someHighschoolD1),
            highschool: demographicsStatConvert(highschoolD1),
            someCollege: demographicsStatConvert(someCollegeD1),
            associate: demographicsStatConvert(associateD1),
            bachelor: demographicsStatConvert(bachelorD1),
            masters: demographicsStatConvert(mastersD1),
            professional: demographicsStatConvert(professionalD1),
            doctorate: demographicsStatConvert(doctorateD1),
          },
          gender: {
            male: demographicsStatConvert(maleD1),
            female: demographicsStatConvert(femaleD1),
          },
        },
        demographics3: {
          age: {
            under18: demographicsStatConvert(under18D3),
            between18To24: demographicsStatConvert(between18To24D3),
            between25To34: demographicsStatConvert(between25To34D3),
            between35To44: demographicsStatConvert(between35To44D3),
            between45To54: demographicsStatConvert(between45To54D3),
            between55To64: demographicsStatConvert(between55To64D3),
            above65: demographicsStatConvert(above65D3),
          },
          income: {
            under50KUsd: demographicsStatConvert(under50KUsdD3),
            between50to74KUsd: demographicsStatConvert(between50to74KUsdD3),
            between75to124KUsd: demographicsStatConvert(between75to124KUsdD3),
            between125to199KUsd: demographicsStatConvert(between125to199KUsdD3),
            above200KUsd: demographicsStatConvert(above200KUsdD3),
          },
          ethnicity: {
            white: demographicsStatConvert(whiteD3),
            black: demographicsStatConvert(blackD3),
            indian: demographicsStatConvert(indianD3),
            asian: demographicsStatConvert(asianD3),
            pacificIslander: demographicsStatConvert(pacificIslanderD3),
            other: demographicsStatConvert(otherD3),
          },
          education: {
            someHighschool: demographicsStatConvert(someHighschoolD3),
            highschool: demographicsStatConvert(highschoolD3),
            someCollege: demographicsStatConvert(someCollegeD3),
            associate: demographicsStatConvert(associateD3),
            bachelor: demographicsStatConvert(bachelorD3),
            masters: demographicsStatConvert(mastersD3),
            professional: demographicsStatConvert(professionalD3),
            doctorate: demographicsStatConvert(doctorateD3),
          },
          gender: {
            male: demographicsStatConvert(maleD3),
            female: demographicsStatConvert(femaleD3),
          },
        },
        demographics5: {
          age: {
            under18: demographicsStatConvert(under18D5),
            between18To24: demographicsStatConvert(between18To24D5),
            between25To34: demographicsStatConvert(between25To34D5),
            between35To44: demographicsStatConvert(between35To44D5),
            between45To54: demographicsStatConvert(between45To54D5),
            between55To64: demographicsStatConvert(between55To64D5),
            above65: demographicsStatConvert(above65D5),
          },
          income: {
            under50KUsd: demographicsStatConvert(under50KUsdD5),
            between50to74KUsd: demographicsStatConvert(between50to74KUsdD5),
            between75to124KUsd: demographicsStatConvert(between75to124KUsdD5),
            between125to199KUsd: demographicsStatConvert(between125to199KUsdD5),
            above200KUsd: demographicsStatConvert(above200KUsdD5),
          },
          ethnicity: {
            white: demographicsStatConvert(whiteD5),
            black: demographicsStatConvert(blackD5),
            indian: demographicsStatConvert(indianD5),
            asian: demographicsStatConvert(asianD5),
            pacificIslander: demographicsStatConvert(pacificIslanderD5),
            other: demographicsStatConvert(otherD5),
          },
          education: {
            someHighschool: demographicsStatConvert(someHighschoolD5),
            highschool: demographicsStatConvert(highschoolD5),
            someCollege: demographicsStatConvert(someCollegeD5),
            associate: demographicsStatConvert(associateD5),
            bachelor: demographicsStatConvert(bachelorD5),
            masters: demographicsStatConvert(mastersD5),
            professional: demographicsStatConvert(professionalD5),
            doctorate: demographicsStatConvert(doctorateD5),
          },
          gender: {
            male: demographicsStatConvert(maleD5),
            female: demographicsStatConvert(femaleD5),
          },
        },
        nearby: tsNearby,
      },
      propertyDetails: {
        tour3D,
        mainPhoto,
        sqft,
        photos,
        summary: {
          pricePerSqft,
          ...restSummary,
        },
        description,
      },
    };
  },
});

export { locationDetails };
