import axios from 'axios';
import { queryField, arg } from 'nexus';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
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

    try {
      let {
        property_details: rawPropertyDetails,
        result,
      }: LocationDetailsType = (
        await axios.get(`${LEGACY_API_URI}/api/locationDetails/`, {
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

      if (!result) {
        throw new Error("Can't get the result!");
      }

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
      } = result;

      let {
        num_apartments: numApartements,
        num_hospitals: numHospitals,
        num_metro: numMetro,
        num_universities: numUniversities,
        'HouseholdGrowth2017-2022': householdGrowth2017to2022,
        DaytimePop: daytimePop,
        MedHouseholdIncome: mediumHouseholdIncome,
        TotalHousholds: totalHousehold,
        mile,
      } = keyFacts;

      let {
        'Public Transport': publicTransport,
        'Drove Alone': droveAlone,
        'Worked at Home': workAtHome,
        Bicycle: bicycle,
        Carpooled: carpooled,
        Walked: walked,
      } = commute;

      let objectToArrayKeyObject = (
        object: Record<string, DemographicStat>,
      ) => {
        let objectKeyValue = Object.keys(object).map((key) => {
          let {
            growth,
            my_location: myLocation,
            target_location: targetLocation,
          } = object[key];
          return {
            name: key,
            growth,
            myLocation,
            targetLocation,
          };
        });
        return objectKeyValue;
      };

      let tsNearby = nearby.map(
        ({ number_rating: numberRating, category, ...theRestNearby }) => {
          return {
            numberRating: numberRating ? numberRating : 0,
            category: category ? category : '',
            ...theRestNearby,
          };
        },
      );

      return {
        result: {
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
            age: objectToArrayKeyObject(demographics1.age),
            income: objectToArrayKeyObject(demographics1.income),
            ethnicity: objectToArrayKeyObject(demographics1.ethnicity),
            education: objectToArrayKeyObject(demographics1.education),
            gender: objectToArrayKeyObject(demographics1.gender),
          },
          demographics3: {
            age: objectToArrayKeyObject(demographics3.age),
            income: objectToArrayKeyObject(demographics3.income),
            ethnicity: objectToArrayKeyObject(demographics3.ethnicity),
            education: objectToArrayKeyObject(demographics3.education),
            gender: objectToArrayKeyObject(demographics3.gender),
          },
          demographics5: {
            age: objectToArrayKeyObject(demographics5.age),
            income: objectToArrayKeyObject(demographics5.income),
            ethnicity: objectToArrayKeyObject(demographics5.ethnicity),
            education: objectToArrayKeyObject(demographics5.education),
            gender: objectToArrayKeyObject(demographics5.gender),
          },
          nearby: tsNearby,
        },
        propertyDetails: rawPropertyDetails
          ? {
              tour3D: rawPropertyDetails['3D_tour'],
              mainPhoto: rawPropertyDetails.main_photo,
              sqft: rawPropertyDetails.sqft,
              photos: rawPropertyDetails.photos,
              summary: {
                pricePerSqft: rawPropertyDetails.summary['price/sqft'],
                type: rawPropertyDetails.summary.type,
                condition: rawPropertyDetails.summary.condition,
              },
              description: rawPropertyDetails.description,
            }
          : undefined,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
});

export { locationDetails };
