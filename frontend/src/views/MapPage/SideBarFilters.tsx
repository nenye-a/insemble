import React, { useEffect, useReducer, useContext } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import { View, ClickAway } from '../../core-ui';
import { Filter } from '../../components';
import FilterCard from './FilterCard';
import sideBarFiltersReducer, {
  Action,
  State,
  FilterObj,
  FilterType,
} from '../../reducers/sideBarFiltersReducer';
import {
  GET_PERSONA_LIST,
  GET_COMMUTE_LIST,
  GET_EDUCATION_LIST,
  GET_PROPERTY_TYPE_LIST,
} from '../../graphql/queries/server/filters';
import { Personas } from '../../generated/Personas';
import {
  DELETED_BASE64_STRING,
  getPropertyOptionsAndPrefilledValues,
} from './helpers/getOptionsAndPrefilledValues';
import { Commute } from '../../generated/Commute';
import { Education } from '../../generated/Education';
import { TenantMatchesContext } from '../MainMap';

import SvgIncome from '../../components/icons/income';
import SvgAge from '../../components/icons/age';
import SvgPsychographic from '../../components/icons/psychographic';
import SvgCommute from '../../components/icons/commute';
import SvgEducation from '../../components/icons/education';
import SvgRent from '../../components/icons/rent';
import SvgSqft from '../../components/icons/sqft';
import SvgPropertyType from '../../components/icons/property-type';
import { NAVBAR_HEIGHT } from '../../constants/theme';

export default function SideBarFilters() {
  let { filters, onFilterChange } = useContext(TenantMatchesContext);
  let { demographics: demographicsInitialFilter, property: propertyInitialFilter } = filters;
  let { data: personasData, loading: personasLoading } = useQuery<Personas>(GET_PERSONA_LIST);
  let { data: commuteData, loading: commuteLoading } = useQuery<Commute>(GET_COMMUTE_LIST);
  let { data: educationData, loading: educationLoading } = useQuery<Education>(GET_EDUCATION_LIST);
  let { data: spaceTypeData, loading: spaceTypeLoading } = useQuery(GET_PROPERTY_TYPE_LIST);

  let getInitialState = () => ({
    openFilterName: null,
    demographics: DEMOGRAPHIC_OPTIONS.map((item) => {
      return { ...item, allOptions: [] };
    }),
    properties: PROPERTIES_OPTIONS.map((item) => ({ ...item, allOptions: [] })),
  });

  let [state, dispatch] = useReducer(
    (state: State, action: Action) =>
      sideBarFiltersReducer(state, action, { filters, onFilterChange }),
    getInitialState()
  );
  let { demographics, properties, openFilterName } = state;

  useEffect(() => {
    // Get options and prefilled value;
    let demographicsWithOptions = DELETED_BASE64_STRING(
      demographics,
      demographicsInitialFilter,
      {
        personas: personasData?.personas,
        commute: commuteData?.commute,
        education: educationData?.education,
      }
    );
    let propertiesWithOptions = getPropertyOptionsAndPrefilledValues(
      properties,
      propertyInitialFilter,
      {
        spaceType: spaceTypeData?.spaceType,
      }
    );

    dispatch({
      type: 'OPTIONS_FETCH_SUCCESS',
      demographics: demographicsWithOptions,
      properties: propertiesWithOptions,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    commuteData,
    spaceTypeData,
    educationData,
    personasData,
    demographicsInitialFilter,
    propertyInitialFilter,
  ]);

  let getFilterProps = (name: string | null) => {
    let found = [...demographics, ...properties].find((item) => item.name === name);
    if (found) {
      let selectedValues = found.selectedValues;
      if (found.type === FilterType.RANGE_SLIDER) {
        if (openFilterName === DEMOGRAPHICS_CATEGORIES.income) {
          return {
            income: true,
            rangeSlide: true,
            minimum: 0,
            maximum: 200,
            values: selectedValues.length > 1 ? selectedValues : [0, 200],
            onSliderChange: (values: Array<number>) => {
              dispatch({
                type: 'SLIDE_CHANGE',
                name: DEMOGRAPHICS_CATEGORIES.income,
                selectedValues: values,
              });
            },
          };
        } else if (openFilterName === DEMOGRAPHICS_CATEGORIES.age) {
          return {
            rangeSlide: true,
            minimum: 0,
            maximum: 65,
            values: selectedValues.length > 1 ? selectedValues : [1, 65],
            onSliderChange: (values: Array<number>) => {
              dispatch({
                type: 'SLIDE_CHANGE',
                name: DEMOGRAPHICS_CATEGORIES.age,
                selectedValues: values,
              });
            },
          };
        }
      } else if (found.type === FilterType.SELECTION) {
        return {
          selection: true,
          selectedOptions: selectedValues,
          allOptions: found.allOptions || [],
          onSelect: (item: string) => {
            dispatch({ type: 'PILL_SELECT', name: openFilterName, selectedItem: item });
          },
          onUnSelect: (item: string) => {
            dispatch({
              type: 'PILL_UNSELECT',
              name: openFilterName,
              selectedItem: item,
            });
          },
        };
      } else if (found.type === FilterType.SEARCH_SELECTION) {
        return {
          search: true,
          selectedOptions: selectedValues,
          allOptions: found.allOptions || [],
          onSelect: (item: string) => {
            dispatch({ type: 'PILL_SELECT', name: openFilterName, selectedItem: item });
          },
          onUnSelect: (item: string) => {
            dispatch({
              type: 'PILL_UNSELECT',
              name: openFilterName,
              selectedItem: item,
            });
          },
        };
      } else if (found.type === FilterType.RANGE_INPUT) {
        return {
          rangeInput: true,
          onLowRangeInputChange: (value: string) => {
            dispatch({
              type: 'LOW_RANGE_CHANGE',
              name: openFilterName,
              value,
            });
          },
          onHighRangeInputChange: (value: string) => {
            dispatch({
              type: 'HIGH_RANGE_CHANGE',
              name: openFilterName,
              value,
            });
          },
          lowValue: selectedValues[0],
          highValue: selectedValues[1],
        };
      }
    }
  };

  let filterProps = getFilterProps(openFilterName);
  return (
    <RowedView>
      <Container>
        <FilterCard
          title="Demographics"
          options={demographics}
          style={{ maxHeight: '70%' }}
          contentStyle={{ overflowY: 'scroll', flex: 1 }}
          onOptionPress={(item) => {
            dispatch({
              type: 'OPTION_PRESS',
              name: item.name,
            });
          }}
          openFilterName={openFilterName}
        />
        {/* Hiding this for now */}
        {/* <FilterCard
          title="Property"
          options={properties}
          style={{ maxHeight: '30%', marginTop: 10, marginBottom: 10 }}
          contentStyle={{ overflowY: 'scroll', flex: 1 }}
          onOptionPress={(item) => {
            dispatch({
              type: 'OPTION_PRESS',
              name: item.name,
            });
          }}
          openFilterName={openFilterName}
        /> */}
      </Container>
      <ClickAway
        onClickAway={() =>
          dispatch({
            type: 'DONE_PRESS',
          })
        }
      >
        <FilterContainer
          visible={!!openFilterName}
          title={openFilterName}
          onDone={() => {
            dispatch({
              type: 'DONE_PRESS',
            });
          }}
          onClear={() => {
            dispatch({
              type: 'CLEAR_PRESS',
              name: openFilterName,
            });
          }}
          loading={personasLoading || commuteLoading || educationLoading || spaceTypeLoading}
          {...filterProps}
        />
      </ClickAway>
    </RowedView>
  );
}

const RowedView = styled(View)`
  flex-direction: row;
  z-index: 5;
`;
const Container = styled(View)`
  position: absolute;
  left: 32px;
  width: 160px;
  margin-top: 10px;
  margin-bottom: 10px;
  height: calc(100% - ${NAVBAR_HEIGHT});
`;

const FilterContainer = styled(Filter)`
  position: absolute;
  left: 200px;
  top: 50px;
  min-width: 240px;
`;

export const DEMOGRAPHICS_CATEGORIES = {
  income: 'Income',
  age: 'Age',
  personas: 'Personas',
  commute: 'Commute',
  education: 'Education',
};

export const PROPERTIES_CATEGORIES = {
  rent: 'Rent',
  sqft: 'Sqft',
  propertyType: 'Type',
};

const DEMOGRAPHIC_OPTIONS: Array<FilterObj> = [
  {
    name: DEMOGRAPHICS_CATEGORIES.income,
    icon: SvgIncome,
    selectedValues: [],
    type: FilterType.RANGE_SLIDER,
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.age,
    icon: SvgAge,
    selectedValues: [],
    type: FilterType.RANGE_SLIDER,
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.personas,
    icon: SvgPsychographic,
    selectedValues: [],
    type: FilterType.SELECTION,
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.commute,
    icon: SvgCommute,
    selectedValues: [],
    type: FilterType.SELECTION,
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.education,
    icon: SvgEducation,
    selectedValues: [],
    type: FilterType.SEARCH_SELECTION,
  },
];

const PROPERTIES_OPTIONS: Array<FilterObj> = [
  {
    name: 'Rent',
    icon: SvgRent,
    selectedValues: [],
    type: FilterType.RANGE_INPUT,
  },
  {
    name: 'Sqft',
    icon: SvgSqft,
    selectedValues: [],
    type: FilterType.RANGE_INPUT,
  },
  { name: 'Type', icon: SvgPropertyType, selectedValues: [], type: FilterType.SELECTION },
];
