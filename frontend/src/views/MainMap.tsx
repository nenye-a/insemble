import React, { useState, createContext, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import { View, Button, Text, LoadingIndicator, Alert } from '../core-ui';
import AvailableProperties from './MapPage/AvailableProperties';
import SideBarFilters, {
  DEMOGRAPHICS_CATEGORIES,
  PROPERTIES_CATEGORIES,
} from './MapPage/SideBarFilters';
import HeaderFilterBar from './MapPage/HeaderFilterBar';
import MapContainer from './MapContainer';
import DeepDiveModal from './DeepDivePage/DeepDiveModal';
import { GET_TENANT_MATCHES_DATA } from '../graphql/queries/server/matches';
import { EDIT_BRAND } from '../graphql/queries/server/brand';
import { WHITE, THEME_COLOR, HEADER_BORDER_COLOR } from '../constants/colors';
import { FONT_WEIGHT_MEDIUM, FONT_SIZE_LARGE } from '../constants/theme';
import { TenantMatches, TenantMatchesVariables } from '../generated/TenantMatches';

import SvgPropertyLocation from '../components/icons/property-location';
import { useGoogleMaps } from '../utils';
import { State as SideBarFiltersState } from '../reducers/sideBarFiltersReducer';
import { EditBrand, EditBrandVariables } from '../generated/EditBrand';
import { isEqual } from '../utils/isEqual';
import { LocationInput } from '../generated/globalTypes';

type BrandId = {
  brandId: string;
};

export type DemographicsFilter = {
  minIncome: number | null;
  maxIncome: number | null;
  minAge: number | null;
  maxAge: number | null;
  personas: Array<string>;
  commute: Array<string> | null;
  education: Array<string> | null;
  ethnicity: Array<string> | null;
};

export type PropertyFilter = {
  minRent: number | null;
  maxRent: number | null;
  minSize: number | null;
  maxSize: number | null;
  spaceType: Array<string>;
};

type TenantMatchesContextFilter = {
  demographics: DemographicsFilter;
  property: PropertyFilter;
  categories?: Array<string>;
  business?: {
    location: LocationInput | null;
    name: string | null;
  };
};

type PlaceResult = google.maps.places.PlaceResult;

type SelectedLatLng = {
  lat: string;
  lng: string;
  address: string;
  targetNeighborhood: string;
};

export type TenantMatchesContextType = {
  filters: TenantMatchesContextFilter;
  onFilterChange?: (state: SideBarFiltersState) => void;
  onCategoryChange?: (state: Array<string>) => void;
  onAddressChange?: (place: PlaceResult) => void;
};

let tenantMatchesInit = {
  filters: {
    demographics: {
      minIncome: null,
      maxIncome: null,
      minAge: null,
      maxAge: null,
      personas: [],
      commute: [],
      education: [],
      ethnicity: [],
    },
    property: {
      minRent: null,
      maxRent: null,
      minSize: null,
      maxSize: null,
      spaceType: [],
    },
  },
};

export const TenantMatchesContext = createContext<TenantMatchesContextType>(tenantMatchesInit);

export default function MainMap() {
  let [filters, setFilters] = useState<TenantMatchesContextFilter>(tenantMatchesInit.filters);
  let [propertyRecommendationVisible, togglePropertyRecommendation] = useState(false);
  let [deepDiveModalVisible, toggleDeepDiveModal] = useState(false);
  let { isLoading } = useGoogleMaps();
  let params = useParams<BrandId>();
  let { brandId } = params;
  let {
    data: tenantMatchesData,
    loading,
    error: tenantMatchesError,
    refetch: tenantMatchesRefetch,
  } = useQuery<TenantMatches, TenantMatchesVariables>(GET_TENANT_MATCHES_DATA, {
    variables: {
      brandId,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  let [editBrand, { loading: editBrandLoading, error: editBrandError }] = useMutation<
    EditBrand,
    EditBrandVariables
  >(EDIT_BRAND);

  let [selectedLatLng, setSelectedLatLng] = useState<SelectedLatLng | null>(null);
  let onFilterChange = (state: SideBarFiltersState) => {
    let { demographics, properties, openFilterName } = state;
    let foundObj = [...demographics, ...properties].find((item) => item.name === openFilterName);

    if (foundObj) {
      let { name, selectedValues } = foundObj;
      let affectedDemographicsState = {};
      let affectedPropertyState = {};
      switch (name) {
        case DEMOGRAPHICS_CATEGORIES.personas: {
          affectedDemographicsState = { personas: selectedValues };
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.commute: {
          affectedDemographicsState = { commute: selectedValues };
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.education: {
          affectedDemographicsState = { education: selectedValues };
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.ethnicity: {
          affectedDemographicsState = { ethnicity: selectedValues };
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.income: {
          affectedDemographicsState = {
            minIncome: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[0]) : null,
            maxIncome: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[1]) : null,
          };
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.age: {
          affectedDemographicsState = {
            minAge: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[0]) : null,
            maxAge: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[1]) : null,
          };
          break;
        }
        case PROPERTIES_CATEGORIES.rent: {
          affectedPropertyState = {
            minRent: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[0]) : null,
            maxRent: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[1]) : null,
          };

          break;
        }
        case PROPERTIES_CATEGORIES.sqft: {
          // TODO: edit state when property filter is unhide
          break;
        }
        case PROPERTIES_CATEGORIES.propertyType: {
          affectedPropertyState = {
            spaceType: selectedValues,
          };

          break;
        }
      }
      setFilters({
        ...filters,
        demographics: {
          ...filters.demographics,
          ...affectedDemographicsState,
        },
        property: {
          ...filters.property,
          ...affectedPropertyState,
        },
      });
    }
  };

  let onCategoryChange = (categories: Array<string>) => {
    setFilters({
      ...filters,
      categories,
    });
  };

  let onAddressChange = (place: PlaceResult) => {
    let { geometry, formatted_address: formattedAddress, name } = place;
    if (geometry) {
      let { location } = geometry;
      if (location) {
        let { lat, lng } = location;
        let latitude = lat();
        let longitude = lng();
        setFilters({
          ...filters,
          business: {
            location: {
              lat: latitude.toString(),
              lng: longitude.toString(),
              address: formattedAddress || '',
            },
            name,
          },
        });
      }
    }
  };

  let onPublishChangesPress = async () => {
    let { demographics, categories, property, business } = filters;
    let {
      minIncome,
      maxIncome,
      minAge,
      maxAge,
      personas,
      commute,
      education,
      ethnicity,
    } = demographics;
    let { minSize, maxSize, minRent, maxRent, spaceType } = property;
    let result = await editBrand({
      variables: {
        filter: {
          categories,
          personas,
          minAge: Number(minAge),
          maxAge: Number(maxAge),
          minIncome: Number(minIncome) * 1000,
          maxIncome: Number(maxIncome) * 1000,
          minSize,
          maxSize,
          minRent,
          maxRent,
          spaceType,
          commute,
          education,
          ethnicity,
        },
        ...(business &&
          business.name && { business: { name: business.name, location: business.location } }),
        brandId,
      },
    });
    if (result.data?.editBrand) {
      tenantMatchesRefetch({ brandId });
    }
  };

  let filtersAreEqual = isEqual(
    {
      categories: tenantMatchesData?.tenantMatches.categories,
      demographics: {
        minIncome: tenantMatchesData?.tenantMatches.minIncome,
        maxIncome: tenantMatchesData?.tenantMatches.maxIncome,
        minAge: tenantMatchesData?.tenantMatches.minAge,
        maxAge: tenantMatchesData?.tenantMatches.maxAge,
        personas: tenantMatchesData?.tenantMatches.personas,
        commute: tenantMatchesData?.tenantMatches.commute,
        education: tenantMatchesData?.tenantMatches.education,
        ethnicity: tenantMatchesData?.tenantMatches.ethnicity,
      },
      property: {
        minRent: tenantMatchesData?.tenantMatches.minRent,
        maxRent: tenantMatchesData?.tenantMatches.maxRent,
        minSize: tenantMatchesData?.tenantMatches.minSize,
        maxSize: tenantMatchesData?.tenantMatches.maxSize,
        spaceType: tenantMatchesData?.tenantMatches.spaceType,
      },
      business: {
        location: tenantMatchesData?.tenantMatches.location,
        name: tenantMatchesData?.tenantMatches.name,
      },
    },
    filters
  );

  useEffect(() => {
    if (tenantMatchesData) {
      let {
        minIncome,
        maxIncome,
        minAge,
        maxAge,
        personas,
        commute,
        education,
        minRent,
        maxRent,
        minSize,
        maxSize,
        spaceType,
        categories,
        ethnicity,
      } = tenantMatchesData.tenantMatches;
      setFilters({
        demographics: {
          minIncome: minIncome ? minIncome / 1000 : null,
          maxIncome: maxIncome ? maxIncome / 1000 : null,
          maxAge,
          minAge,
          personas,
          commute: (commute && commute.map(({ displayValue }) => displayValue)) || [],
          education: (education && education.map(({ displayValue }) => displayValue)) || [],
          ethnicity: (ethnicity && ethnicity.map(({ displayValue }) => displayValue)) || [],
        },
        property: {
          minRent,
          maxRent,
          minSize,
          maxSize,
          spaceType,
        },
        categories,
      });
    }
  }, [loading, tenantMatchesData]);

  return (
    <TenantMatchesContext.Provider
      value={{
        filters,
        onFilterChange,
        onCategoryChange,
        onAddressChange,
      }}
    >
      <View flex>
        {selectedLatLng && (
          <DeepDiveModal
            lat={selectedLatLng.lat || ''}
            lng={selectedLatLng.lng || ''}
            address={selectedLatLng.address}
            targetNeighborhood={selectedLatLng.targetNeighborhood}
            visible={deepDiveModalVisible}
            onClose={() => toggleDeepDiveModal(!deepDiveModalVisible)}
          />
        )}
        {!isLoading && tenantMatchesData && (
          <HeaderFilterBar
            categories={tenantMatchesData.tenantMatches.categories}
            onPublishChangesPress={onPublishChangesPress}
            publishButtonDisabled={filtersAreEqual}
          />
        )}
        {(loading || editBrandLoading) && (
          <LoadingOverlay>
            <LoadingIndicator visible={true} color="white" size="large" />
            <Text fontSize={FONT_SIZE_LARGE} color={WHITE}>
              Evaluating thousands of locations to find your matches. May take a couple minutes...
            </Text>
          </LoadingOverlay>
        )}
        <Alert visible={!!tenantMatchesError} text={tenantMatchesError?.message || ''} />
        <Alert visible={!!editBrandError} text={editBrandError?.message || ''} />
        <Container flex>
          {/* hiding this until data is ready */}
          {/* <ShowPropertyButton
            mode="secondary"
            onPress={() => togglePropertyRecommendation(true)}
            text="Show Property List"
            icon={<SvgPropertyLocation />}
          /> */}
          <SideBarFilters />
          {!isLoading && (
            <MapContainer
              onMarkerClick={(
                latLng: google.maps.LatLng,
                address: string,
                targetNeighborhood: string
              ) => {
                let { lat, lng } = latLng;
                setSelectedLatLng({
                  lat: lat().toString(),
                  lng: lng().toString(),
                  address,
                  targetNeighborhood,
                });
                toggleDeepDiveModal(true);
              }}
              matchingLocations={tenantMatchesData?.tenantMatches.matchingLocations}
              matchingProperties={tenantMatchesData?.tenantMatches.matchingProperties}
            />
          )}
          {/* hiding this until data is ready */}
          {/* <AvailableProperties
            visible={propertyRecommendationVisible}
            onHideClick={() => togglePropertyRecommendation(false)}
          /> */}
        </Container>
      </View>
    </TenantMatchesContext.Provider>
  );
}

const Container = styled(View)`
  flex-direction: row;
  overflow: hidden;
`;

const ShowPropertyButton = styled(Button)`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 5;
  background-color: ${WHITE};
  border-radius: 18px;
  border: none;
  box-shadow: 0px 0px 6px 0px ${HEADER_BORDER_COLOR};
  ${Text} {
    color: ${THEME_COLOR};
    font-weight: ${FONT_WEIGHT_MEDIUM};
  }
`;

const LoadingOverlay = styled(View)`
  position: absolute;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: center;
  align-items: center;
  z-index: 99;
`;
