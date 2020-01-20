import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { View, Button } from '../../core-ui';
import { Filter } from '../../components';
import FilterCard from './FilterCard';
import sideBarFiltersReducer from '../../reducers/sideBarFiltersReducer';
import SvgIncome from '../../components/icons/income';
import SvgAge from '../../components/icons/age';
import SvgGender from '../../components/icons/gender';
import SvgPsychographic from '../../components/icons/psychographic';
import SvgEthnicity from '../../components/icons/ethnicity';
import SvgCommute from '../../components/icons/commute';
import SvgProfession from '../../components/icons/profession';
import SvgEducation from '../../components/icons/education';
import SvgMaritalStatus from '../../components/icons/marital-status';
import SvgCrime from '../../components/icons/crime';
import SvgRent from '../../components/icons/rent';
import SvgSqft from '../../components/icons/sqft';
import SvgPropertyType from '../../components/icons/property-type';
import { NAVBAR_HEIGHT } from '../../constants/theme';

export default function SideBarFilters() {
  let getInitialState = () => ({
    openFilterName: null,
    demographics: DEMOGRAPHIC_OPTIONS.map((item) => ({ ...item, allOptions: [] })),
    properties: PROPERTIES_OPTIONS.map((item) => ({ ...item, allOptions: [] })),
  });

  let [state, dispatch] = useReducer(sideBarFiltersReducer, getInitialState());
  let { demographics, properties, openFilterName } = state;

  useEffect(() => {
    // TODO: fetch backend to get option values
    let demographicsWithOptions = [...demographics].map((item) => {
      let allOptions;
      switch (item.name) {
        case DEMOGRAPHICS_CATEGORIES.gender: {
          allOptions = ['Female', 'Male', 'Others'];
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.psychographic: {
          allOptions = ['Sporty', 'Love Nature', 'Others'];
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.ethnicity: {
          allOptions = ['White', 'Hispanic', 'Black', 'Asian', 'Indian', 'Other'];
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.commute: {
          allOptions = ['Car pool', 'Drive Alone', 'Public Transit', 'Bike', 'Walk', 'At Home'];
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.profession: {
          allOptions = [
            'Manager',
            'Software Engineer',
            'Human Resources',
            'Designer',
            'Marketing',
            'Doctor',
          ];
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.maritalStatus: {
          allOptions = ['Single', 'Married'];
          break;
        }
        case DEMOGRAPHICS_CATEGORIES.education: {
          allOptions = ['Doctorate', 'Masters', 'Bachelors', 'High School', 'No High School'];
          break;
        }
      }
      return { ...item, allOptions };
    });
    let propertiesWithOptions = [...properties].map((item) => {
      let allOptions;
      switch (item.name) {
        case PROPERTIES_CATEGORIES.propertyType: {
          allOptions = ['Retail', 'Restaurant'];
        }
      }
      return { ...item, allOptions };
    });
    dispatch({
      type: 'ON_OPTIONS_FETCH_SUCCESS',
      demographics: demographicsWithOptions,
      properties: propertiesWithOptions,
    });
  }, []);

  let getFilterProps = (name: string | null) => {
    let found = [...demographics, ...properties].find((item) => item.name === name);
    if (found) {
      let selectedValues = found.selectedValues;

      if (openFilterName === DEMOGRAPHICS_CATEGORIES.income) {
        return {
          income: true,
          rangeSlide: true,
          minimum: 0,
          maximum: 800,
          values: selectedValues.length > 1 ? selectedValues : [0, 800],
          onSliderChange: (values: Array<number>) => {
            dispatch({
              type: 'ON_SLIDE_CHANGE',
              name: DEMOGRAPHICS_CATEGORIES.income,
              selectedValues: values,
            });
          },
        };
      } else if (openFilterName === DEMOGRAPHICS_CATEGORIES.age) {
        return {
          rangeSlide: true,
          minimum: 0,
          maximum: 100,
          values: selectedValues.length > 1 ? selectedValues : [1, 100],
          onSliderChange: (values: Array<number>) => {
            dispatch({
              type: 'ON_SLIDE_CHANGE',
              name: DEMOGRAPHICS_CATEGORIES.age,
              selectedValues: values,
            });
          },
        };
      } else if (
        openFilterName === DEMOGRAPHICS_CATEGORIES.gender ||
        openFilterName === DEMOGRAPHICS_CATEGORIES.psychographic ||
        openFilterName === DEMOGRAPHICS_CATEGORIES.ethnicity ||
        openFilterName === DEMOGRAPHICS_CATEGORIES.commute ||
        openFilterName === DEMOGRAPHICS_CATEGORIES.maritalStatus ||
        openFilterName === PROPERTIES_CATEGORIES.propertyType
      ) {
        return {
          selection: true,
          selectedOptions: selectedValues,
          allOptions: found.allOptions || [],
          onSelect: (item: string) => {
            dispatch({ type: 'ON_PILL_SELECT', name: openFilterName, selectedItem: item });
          },
          onUnSelect: (item: string) => {
            dispatch({
              type: 'ON_PILL_UNSELECT',
              name: openFilterName,
              selectedItem: item,
            });
          },
        };
      } else if (
        openFilterName === DEMOGRAPHICS_CATEGORIES.profession ||
        openFilterName === DEMOGRAPHICS_CATEGORIES.education
      ) {
        return {
          search: true,
          selectedOptions: selectedValues,
          allOptions: found.allOptions || [],
          onSelect: (item: string) => {
            dispatch({ type: 'ON_PILL_SELECT', name: openFilterName, selectedItem: item });
          },
          onUnSelect: (item: string) => {
            dispatch({
              type: 'ON_PILL_UNSELECT',
              name: openFilterName,
              selectedItem: item,
            });
          },
        };
      } else if (
        openFilterName === PROPERTIES_CATEGORIES.sqft ||
        openFilterName === PROPERTIES_CATEGORIES.rent
      ) {
        return {
          rangeInput: true,
          onLowRangeInputChange: (value: string) => {
            dispatch({
              type: 'ON_LOW_RANGE_CHANGE',
              name: openFilterName,
              value,
            });
          },
          onHighRangeInputChange: (value: string) => {
            dispatch({
              type: 'ON_HIGH_RANGE_CHANGE',
              name: openFilterName,
              value,
            });
          },
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
              type: 'ON_OPTION_PRESS',
              name: item.name,
            });
          }}
        />
        <FilterCard
          title="Property"
          options={properties}
          style={{ maxHeight: '30%', marginTop: 10, marginBottom: 10 }}
          contentStyle={{ overflowY: 'scroll', flex: 1 }}
          onOptionPress={(item) => {
            dispatch({
              type: 'ON_OPTION_PRESS',
              name: item.name,
            });
          }}
        />
        <Button text="New Search" />
      </Container>
      <FilterContainer
        visible={!!openFilterName}
        title={openFilterName}
        onDone={() => {
          dispatch({
            type: 'ON_DONE_PRESS',
          });
        }}
        onClear={() => {
          dispatch({
            type: 'ON_CLEAR_PRESS',
            name: openFilterName,
          });
        }}
        {...filterProps}
      />
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
  justify-content: space-between;
  height: calc(100% - ${NAVBAR_HEIGHT});
`;

const FilterContainer = styled(Filter)`
  position: absolute;
  left: 200px;
  top: 50px;
  min-width: 240px;
`;

const DEMOGRAPHICS_CATEGORIES = {
  income: 'Income',
  age: 'Age',
  gender: 'Gender',
  psychographic: 'Psychographic',
  ethnicity: 'Ethnicity',
  commute: 'Commute',
  profession: 'Profession',
  education: 'Education',
  maritalStatus: 'Marital Status',
  crime: 'Crime',
};

const PROPERTIES_CATEGORIES = {
  rent: 'Rent',
  sqft: 'Sqft',
  propertyType: 'Type',
};

const DEMOGRAPHIC_OPTIONS = [
  {
    name: DEMOGRAPHICS_CATEGORIES.income,
    icon: SvgIncome,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.age,
    icon: SvgAge,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.gender,
    icon: SvgGender,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.psychographic,
    icon: SvgPsychographic,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.ethnicity,
    icon: SvgEthnicity,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.commute,
    icon: SvgCommute,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.profession,
    icon: SvgProfession,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.education,
    icon: SvgEducation,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.maritalStatus,
    icon: SvgMaritalStatus,
    selectedValues: [],
  },
  {
    name: DEMOGRAPHICS_CATEGORIES.crime,
    icon: SvgCrime,
    selectedValues: [],
  },
];

const PROPERTIES_OPTIONS = [
  {
    name: 'Rent',
    icon: SvgRent,
    selectedValues: [],
  },
  {
    name: 'Sqft',
    icon: SvgSqft,
    selectedValues: [],
  },
  { name: 'Type', icon: SvgPropertyType, selectedValues: [] },
];
