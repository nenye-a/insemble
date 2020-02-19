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
};

export type TenantMatchesContextType = {
  filters: TenantMatchesContextFilter;
  onFilterChange?: (state: SideBarFiltersState) => void;
  onCategoryChange?: (state: Array<string>) => void;
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
  });

  let [editBrand, { loading: editBrandLoading, error: editBrandError }] = useMutation<
    EditBrand,
    EditBrandVariables
  >(EDIT_BRAND);
  let onFilterChange = (state: SideBarFiltersState) => {
    let { demographics, properties, openFilterName } = state;
    let foundObj = [...demographics, ...properties].find((item) => item.name === openFilterName);

    if (foundObj) {
      switch (foundObj.name) {
        case DEMOGRAPHICS_CATEGORIES.personas: {
          setFilters({
            ...filters,
            demographics: {
              ...filters.demographics,
              personas: foundObj.selectedValues,
            },
          });
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.commute: {
          setFilters({
            ...filters,
            demographics: {
              ...filters.demographics,
              commute: foundObj.selectedValues,
            },
          });
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.education: {
          setFilters({
            ...filters,
            demographics: {
              ...filters.demographics,
              education: foundObj.selectedValues,
            },
          });
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.income: {
          setFilters({
            ...filters,
            demographics: {
              ...filters.demographics,
              minIncome: Number(foundObj.selectedValues[0]),
              maxIncome: Number(foundObj.selectedValues[1]),
            },
          });
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.age: {
          setFilters({
            ...filters,
            demographics: {
              ...filters.demographics,
              minAge: Number(foundObj.selectedValues[0]),
              maxAge: Number(foundObj.selectedValues[1]),
            },
          });
          break;
        }
        case PROPERTIES_CATEGORIES.rent: {
          setFilters({
            ...filters,
            property: {
              ...filters.property,
              minRent: Number(foundObj.selectedValues[0]),
              maxRent: Number(foundObj.selectedValues[1]),
            },
          });
          break;
        }
        case PROPERTIES_CATEGORIES.sqft: {
          break;
        }
        case PROPERTIES_CATEGORIES.propertyType: {
          setFilters({
            ...filters,
            property: {
              ...filters.property,
              spaceType: foundObj.selectedValues,
            },
          });
          break;
        }
      }
    }
  };

  let onCategoryChange = (categories: Array<string>) => {
    setFilters({
      ...filters,
      categories,
    });
  };

  let onPublishChangesPress = async () => {
    let { demographics, categories, property } = filters;
    let { minIncome, maxIncome, minAge, maxAge, personas, commute, education } = demographics;
    let { minSize, maxSize, minRent, maxRent, spaceType } = property;
    let result = await editBrand({
      variables: {
        filter: {
          categories,
          personas,
          minAge: Number(minAge),
          maxAge: Number(maxAge),
          minIncome: Number(minIncome),
          maxIncome: Number(maxIncome),
          minSize,
          maxSize,
          minRent,
          maxRent,
          spaceType,
          commute,
          education,
        },
        brandId,
      },
    });
    if (result.data?.editBrand) {
      tenantMatchesRefetch({ brandId });
    }
  };

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
      } = tenantMatchesData.tenantMatches;
      setFilters({
        demographics: {
          minIncome,
          maxIncome,
          maxAge,
          minAge,
          personas,
          commute: (commute && commute.map(({ displayValue }) => displayValue)) || [],
          education: (education && education.map(({ displayValue }) => displayValue)) || [],
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
      }}
    >
      <View flex>
        <DeepDiveModal
          visible={deepDiveModalVisible}
          onClose={() => toggleDeepDiveModal(!deepDiveModalVisible)}
        />
        {!isLoading && tenantMatchesData && (
          <HeaderFilterBar
            categories={tenantMatchesData.tenantMatches.categories}
            onPublishChangesPress={onPublishChangesPress}
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
        <Container flex>
          <Alert visible={!!tenantMatchesError} text={tenantMatchesError?.message || ''} />
          <Alert visible={!!editBrandError} text={editBrandError?.message || ''} />
          <ShowPropertyButton
            mode="secondary"
            onPress={() => togglePropertyRecommendation(true)}
            text="Show Property List"
            icon={<SvgPropertyLocation />}
          />
          <SideBarFilters />
          {!isLoading && (
            <MapContainer
              onMarkerClick={() => toggleDeepDiveModal(true)}
              matchingLocations={tenantMatchesData?.tenantMatches.matchingLocations}
              matchingProperties={tenantMatchesData?.tenantMatches.matchingProperties}
            />
          )}
          <AvailableProperties
            visible={propertyRecommendationVisible}
            onHideClick={() => togglePropertyRecommendation(false)}
          />
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
