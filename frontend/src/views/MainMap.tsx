import React, { useState, createContext, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import { View, Text, LoadingIndicator, Button } from '../core-ui';
import SideBarFilters, {
  DEMOGRAPHICS_CATEGORIES,
  PROPERTIES_CATEGORIES,
} from './MapPage/SideBarFilters';
import HeaderFilterBar from './MapPage/HeaderFilterBar';
import MapContainer from './MapContainer';
import DeepDiveModal from './DeepDivePage/DeepDiveModal';
import AvailableProperties from './MapPage/AvailableProperties';
import MapAlert from './MapPage/MapAlert';
import { SelectedLocation } from '../components/LocationInput';
import { GET_TENANT_MATCHES_DATA } from '../graphql/queries/server/matches';
import { EDIT_BRAND } from '../graphql/queries/server/brand';
import { WHITE, HEADER_BORDER_COLOR, THEME_COLOR } from '../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_MEDIUM } from '../constants/theme';
import { TenantMatches, TenantMatchesVariables } from '../generated/TenantMatches';

import { useGoogleMaps, isEqual, useViewport, omitTypename } from '../utils';
import { State as SideBarFiltersState } from '../reducers/sideBarFiltersReducer';
import { EditBrand, EditBrandVariables } from '../generated/EditBrand';
import { LocationInput } from '../generated/globalTypes';
import SvgPropertyLocation from '../components/icons/property-location';

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
  amenities: Array<string>;
};

type ShowPropertyButtonProps = {
  visible: boolean;
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

export type SelectedLatLng = {
  lat: string;
  lng: string;
  address: string;
  targetNeighborhood: string;
  propertyId?: string;
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
      amenities: [],
    },
  },
};

export const TenantMatchesContext = createContext<TenantMatchesContextType>(tenantMatchesInit);

export default function MainMap() {
  let [filters, setFilters] = useState<TenantMatchesContextFilter>(tenantMatchesInit.filters);
  let [propertyRecommendationVisible, togglePropertyRecommendation] = useState(false);
  let [deepDiveModalVisible, toggleDeepDiveModal] = useState(false);
  let [mapErrorMessage, setMapErrorMessage] = useState('');
  let [addressSearchLocation, setAddressSearchLocation] = useState<SelectedLocation | null>(null);
  let [alertUpdateMapVisible, setAlertUpdateMapVisible] = useState(false);
  let { isLoading } = useGoogleMaps();
  let { isDesktop } = useViewport();
  let params = useParams<BrandId>();
  let { brandId } = params;
  let { data: tenantMatchesData, loading, refetch: tenantMatchesRefetch } = useQuery<
    TenantMatches,
    TenantMatchesVariables
  >(GET_TENANT_MATCHES_DATA, {
    variables: {
      brandId,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onError: () => {
      setMapErrorMessage('Failed to load heatmap, please adjust filters and try again.');
      tenantMatchesRefetch();
    },
  });

  let [editBrand, { loading: editBrandLoading }] = useMutation<EditBrand, EditBrandVariables>(
    EDIT_BRAND,
    {
      onError: (err) => {
        setMapErrorMessage(err.message);
      },
    }
  );

  let [selectedLatLng, setSelectedLatLng] = useState<SelectedLatLng | null>(null);

  let visibleMatchingProperties = tenantMatchesData?.tenantMatches.matchingProperties
    ? tenantMatchesData.tenantMatches.matchingProperties.filter((property) => property.visible)
    : [];
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
            maxIncome: !isNaN(Number(selectedValues[1])) ? Number(selectedValues[1]) : null,
          };
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.age: {
          affectedDemographicsState = {
            minAge: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[0]) : null,
            maxAge: !isNaN(Number(selectedValues[1])) ? Number(selectedValues[1]) : null,
          };
          break;
        }
        case PROPERTIES_CATEGORIES.rent: {
          affectedPropertyState = {
            minRent: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[0]) : null,
            maxRent: !isNaN(Number(selectedValues[1])) ? Number(selectedValues[1]) : null,
          };
          break;
        }
        case PROPERTIES_CATEGORIES.sqft: {
          affectedPropertyState = {
            minSize: !isNaN(Number(selectedValues[0])) ? Number(selectedValues[0]) : null,
            maxSize: !isNaN(Number(selectedValues[1])) ? Number(selectedValues[1]) : null,
          };
          break;
        }
        case PROPERTIES_CATEGORIES.propertyType: {
          affectedPropertyState = {
            spaceType: selectedValues,
          };
          break;
        }
        case PROPERTIES_CATEGORIES.amenities: {
          affectedPropertyState = {
            amenities: selectedValues,
          };
          break;
        }
      }

      let newFilters = {
        ...filters,
        demographics: {
          ...filters.demographics,
          ...affectedDemographicsState,
        },
        property: {
          ...filters.property,
          ...affectedPropertyState,
        },
      };
      setFilters(newFilters);
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
    if (tenantMatchesData) {
      let { demographics, categories, property } = filters;
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
      let { minSize, maxSize, minRent, maxRent, spaceType, amenities } = property;
      let {
        name,
        location,
        userRelation,
        locationCount,
        newLocationPlan,
        nextLocations,
      } = tenantMatchesData.tenantMatches;

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
            equipment: amenities,
          },
          business: {
            name,
            location: location ? (omitTypename(location) as LocationInput) : null,
            userRelation,
            locationCount,
            newLocationPlan,
            nextLocations,
          },
          brandId,
        },
      });
      if (result.data?.editBrand) {
        tenantMatchesRefetch({ brandId });
      }
    }
  };

  let filtersFromMatches = {
    categories: tenantMatchesData?.tenantMatches.categories,
    demographics: {
      minIncome:
        typeof tenantMatchesData?.tenantMatches.minIncome === 'number'
          ? tenantMatchesData?.tenantMatches.minIncome / 1000
          : null,
      maxIncome:
        typeof tenantMatchesData?.tenantMatches.maxIncome === 'number'
          ? tenantMatchesData?.tenantMatches.maxIncome / 1000
          : null,
      minAge: tenantMatchesData?.tenantMatches.minAge,
      maxAge: tenantMatchesData?.tenantMatches.maxAge,
      personas: tenantMatchesData?.tenantMatches.personas,

      commute:
        (tenantMatchesData?.tenantMatches?.commute &&
          tenantMatchesData.tenantMatches.commute.map(({ displayValue }) => displayValue)) ||
        [],
      education:
        (tenantMatchesData?.tenantMatches?.education &&
          tenantMatchesData.tenantMatches.education.map(({ displayValue }) => displayValue)) ||
        [],
      ethnicity:
        (tenantMatchesData?.tenantMatches?.ethnicity &&
          tenantMatchesData.tenantMatches.ethnicity.map(({ displayValue }) => displayValue)) ||
        [],
    },
    property: {
      minRent: tenantMatchesData?.tenantMatches.minRent,
      maxRent: tenantMatchesData?.tenantMatches.maxRent,
      minSize: tenantMatchesData?.tenantMatches.minSize,
      maxSize: tenantMatchesData?.tenantMatches.maxSize,
      spaceType: tenantMatchesData?.tenantMatches.spaceType,
      amenities: tenantMatchesData?.tenantMatches.equipment,
    },
  };

  let filtersAreEqual = isEqual(filtersFromMatches, filters);

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
        equipment,
      } = tenantMatchesData.tenantMatches;
      setFilters({
        demographics: {
          minIncome: typeof minIncome === 'number' ? minIncome / 1000 : null,
          maxIncome: typeof maxIncome === 'number' ? maxIncome / 1000 : null,
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
          amenities: equipment,
        },
        categories,
      });
    }
  }, [loading, tenantMatchesData]);

  useEffect(() => {
    setAlertUpdateMapVisible(!filtersAreEqual);
  }, [filtersAreEqual]);

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
            categories={tenantMatchesData?.tenantMatches.categories}
            targetNeighborhood={selectedLatLng.targetNeighborhood}
            propertyId={selectedLatLng.propertyId || undefined}
            visible={deepDiveModalVisible}
            onClose={() => toggleDeepDiveModal(!deepDiveModalVisible)}
          />
        )}
        <HeaderFilterBar
          address={tenantMatchesData?.tenantMatches.location?.address || ''}
          categories={tenantMatchesData?.tenantMatches.categories || []}
          onPublishChangesPress={onPublishChangesPress}
          publishButtonDisabled={filtersAreEqual}
          onAddressSearch={setAddressSearchLocation}
          brandName={tenantMatchesData?.tenantMatches.name}
        />
        {(loading || editBrandLoading) && (
          <LoadingOverlay>
            <LoadingIndicator visible={true} color="white" size="large" />
            <Text fontSize={FONT_SIZE_LARGE} color={WHITE}>
              Finding your matching locations. May take a few minutes.
            </Text>
          </LoadingOverlay>
        )}
        <Container flex>
          <SideBarFilters />
          {/* TODO: Responsive alert */}
          <MapAlert
            visible={!!mapErrorMessage}
            text={mapErrorMessage}
            onClose={() => setMapErrorMessage('')}
          />
          <MapAlert
            visible={alertUpdateMapVisible}
            text="Please press the Update button below to update the maps with your desired filters."
            onClose={() => setAlertUpdateMapVisible(false)}
          />

          {!isLoading && (
            <MapContainer
              onMapError={(val) => setMapErrorMessage(val)}
              onMarkerClick={(
                latLng: google.maps.LatLng,
                address: string,
                targetNeighborhood: string,
                propertyId?: string
              ) => {
                let { lat, lng } = latLng;
                setSelectedLatLng({
                  lat: lat().toString(),
                  lng: lng().toString(),
                  address,
                  targetNeighborhood,
                  propertyId,
                });
                toggleDeepDiveModal(true);
              }}
              matchingLocations={tenantMatchesData?.tenantMatches.matchingLocations}
              matchingProperties={visibleMatchingProperties}
              currentLocation={tenantMatchesData?.tenantMatches.location}
              addressSearchLocation={addressSearchLocation}
            />
          )}
          {isDesktop && (
            <ShowPropertyButton
              visible={!propertyRecommendationVisible}
              mode="secondary"
              onPress={() => togglePropertyRecommendation(true)}
              text="Show Property List"
              icon={<SvgPropertyLocation />}
            />
          )}
          <AvailableProperties
            visible={propertyRecommendationVisible}
            onShowOrHide={(visible) => {
              if (visible !== undefined) {
                togglePropertyRecommendation(visible);
              } else {
                togglePropertyRecommendation(!propertyRecommendationVisible);
              }
            }}
            matchingProperties={visibleMatchingProperties}
            onPropertyPress={({ lat, lng, address, targetNeighborhood, propertyId }) => {
              setSelectedLatLng({
                lat,
                lng,
                address,
                targetNeighborhood,
                propertyId,
              });
              toggleDeepDiveModal(true);
            }}
          />
        </Container>
      </View>
    </TenantMatchesContext.Provider>
  );
}

const Container = styled(View)`
  overflow: hidden;
  z-index: 1;
`;

const ShowPropertyButton = styled(Button)<ShowPropertyButtonProps>`
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 5;
  background-color: ${WHITE};
  border-radius: 18px;
  border: none;
  box-shadow: 0px 0px 6px 0px ${HEADER_BORDER_COLOR};
  transition: opacity 200ms linear;
  opacity: ${(props) => (props.visible ? 1 : 0)};
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
