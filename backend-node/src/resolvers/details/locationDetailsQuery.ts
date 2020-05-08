import axios from 'axios';
import { queryField, arg } from 'nexus';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { LocationDetailsType } from 'dataTypes';
import { objectToArrayKeyObjectDemographics } from '../..DELETED_BASE64_STRING';
import { trialCheck } from '../../helpers/trialCheck';

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
        tenantUser: { include: { savedProperties: true } },
      },
    });
    if (!selectedBrand) {
      throw new Error('Brand not found!');
    }
    if (!selectedBrand.tenantUser) {
      throw new Error('Tenant in this brand is not found!');
    }
    if (selectedBrand.tenantUser.id !== context.tenantUserId) {
      throw new Error('This not your brand. Not authorized!');
    }
    let tenantUser = selectedBrand.tenantUser;
    let isTrial = trialCheck(tenantUser.createdAt);
    if (!isTrial) {
      if (tenantUser.tier !== 'FREE' && !tenantUser.stripeSubscriptionId) {
        tenantUser = await context.prisma.tenantUser.update({
          where: { id: tenantUser.id },
          data: { tier: 'FREE' },
          include: { savedProperties: true },
        });
      }
    }

    const minLat = 33.7036519;
    const maxLat = 34.3373061;
    const minLng = -118.6681759;
    const maxLng = -118.1552891;
    if (selectedLocation) {
      let selectedLat = parseFloat(selectedLocation.lat);
      let selectedLng = parseFloat(selectedLocation.lng);
      if (
        selectedLat < minLat ||
        selectedLng < minLng ||
        selectedLat > maxLat ||
        selectedLng > maxLng
      ) {
        throw new Error(
          'Unsupported location. Please select a location within the LA or OC area.',
        );
      }
    }

    try {
      let { result }: LocationDetailsType = (
        await axios.get(`${LEGACY_API_URI}/api/fastLocationDetails/`, {
          params: {
            match_id: selectedBrand.matchId,
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
        nearby_apartments: numApartements,
        num_hospitals: numHospitals,
        num_metro: numMetro,
        num_universities: numUniversities,
        'HouseholdGrowth2017-2022': householdGrowth2017to2022,
        DaytimePop: daytimePop,
        MedHouseholdIncome: mediumHouseholdIncome,
        TotalHouseholds: totalHousehold,
        mile,
      } = keyFacts;

      let objectToArrayKeyObjectCommute = (object: Record<string, number>) => {
        let objectKeyValue = Object.keys(object).map((key) => {
          return {
            name: key,
            value: object[key],
          };
        });
        return objectKeyValue;
      };

      let tsNearby = nearby.map(
        ({
          number_rating: numberRating,
          category,
          apartment,
          hospital,
          retail,
          restaurant,
          metro,
          name = 'Unknown place',
          similar = false,
          ...theRestNearby
        }) => {
          let placeType = [];
          apartment && placeType.push('Apartment');
          hospital && placeType.push('Hospital');
          retail && placeType.push('Retail');
          restaurant && placeType.push('Restaurant');
          metro && placeType.push('Metro');
          return {
            numberRating: numberRating ? numberRating : 0,
            category: category ? category : '',
            placeType,
            name,
            similar,
            ...theRestNearby,
          };
        },
      );

      let property = selectedPropertyId
        ? await context.prisma.property.findOne({
            where: { propertyId: selectedPropertyId },
            include: { space: true },
          })
        : undefined;

      let savedPropertySpaceIds = tenantUser.savedProperties.map(
        ({ spaceId }) => {
          return spaceId;
        },
      );

      let propertySpacesDetails = property
        ? property.space.map(
            ({
              spaceId,
              mainPhoto,
              sqft,
              photos,
              pricePerSqft,
              condition,
              description,
            }) => {
              return {
                spaceId: spaceId ? spaceId : '',
                tour3D: '', // TODO: add real tour3D
                mainPhoto,
                sqft,
                photos,
                summary: {
                  pricePerSqft,
                  type: property ? property.propertyType : [],
                  condition,
                },
                description,
                liked: spaceId
                  ? savedPropertySpaceIds.includes(spaceId)
                  : false,
              };
            },
          )
        : [];
      let isFreeTier = selectedBrand.tenantUser.tier === 'FREE';

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
          commute: isFreeTier ? null : objectToArrayKeyObjectCommute(commute),
          topPersonas: isFreeTier ? null : topPersonas,
          demographics1: isFreeTier
            ? null
            : {
                age: objectToArrayKeyObjectDemographics(demographics1.age),
                income: objectToArrayKeyObjectDemographics(
                  demographics1.income,
                ),
                ethnicity: objectToArrayKeyObjectDemographics(
                  demographics1.ethnicity,
                ),
                education: objectToArrayKeyObjectDemographics(
                  demographics1.education,
                ),
                gender: objectToArrayKeyObjectDemographics(
                  demographics1.gender,
                ),
              },
          demographics3: isFreeTier
            ? null
            : {
                age: objectToArrayKeyObjectDemographics(demographics3.age),
                income: objectToArrayKeyObjectDemographics(
                  demographics3.income,
                ),
                ethnicity: objectToArrayKeyObjectDemographics(
                  demographics3.ethnicity,
                ),
                education: objectToArrayKeyObjectDemographics(
                  demographics3.education,
                ),
                gender: objectToArrayKeyObjectDemographics(
                  demographics3.gender,
                ),
              },
          demographics5: isFreeTier
            ? null
            : {
                age: objectToArrayKeyObjectDemographics(demographics5.age),
                income: objectToArrayKeyObjectDemographics(
                  demographics5.income,
                ),
                ethnicity: objectToArrayKeyObjectDemographics(
                  demographics5.ethnicity,
                ),
                education: objectToArrayKeyObjectDemographics(
                  demographics5.education,
                ),
                gender: objectToArrayKeyObjectDemographics(
                  demographics5.gender,
                ),
              },
          nearby: isFreeTier ? null : tsNearby,
        },
        spaceDetails: propertySpacesDetails,
      };
    } catch (e) {
      throw new Error(e);
    }
  },
});

export { locationDetails };
