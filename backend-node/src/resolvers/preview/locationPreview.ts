import axios from 'axios';
import { Root, Context } from 'serverTypes';
import { LEGACY_API_URI } from '../../constants/host';
import { queryField, arg } from 'nexus';
import { LocationPreviewType } from 'dataTypes';

let locationPreview = queryField('locationPreview', {
  type: 'LocationPreviewResult',
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

    let response: LocationPreviewType = (
      await axios.get(`${LEGACY_API_URI}/api/locationPreview/`, {
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

    if (!response) {
      throw new Error("Can't get the result!");
    }
    let {
      target_address: targetAddress,
      target_neighborhood: targetNeighborhood,
      DaytimePop_3mile: daytimePop3Mile,
      median_income: medianIncome,
      'median_age ': medianAge,
    } = response;
    return {
      targetAddress,
      targetNeighborhood,
      daytimePop3Mile,
      medianIncome,
      medianAge,
    };
  },
});

export { locationPreview };
