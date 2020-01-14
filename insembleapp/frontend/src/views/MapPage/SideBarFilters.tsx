import React from 'react';
import styled from 'styled-components';
import { View } from '../../core-ui';
import FilterCard from './FilterCard';
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

export default function SideBarFilters() {
  return (
    <Container>
      <FilterCard
        title="Demographics"
        options={DEMOGRAPHIC_OPTIONS}
        contentStyle={{ maxHeight: '40vh', overflowY: 'scroll' }}
        onOptionPress={() => {
          // open option pop up
        }}
      />
      <FilterCard
        title="Property"
        options={PROPERTIES_OPTIONS}
        contentStyle={{ maxHeight: '20vh', overflowY: 'scroll' }}
        style={{ marginTop: 20 }}
        onOptionPress={() => {
          // open option pop up
        }}
      />
    </Container>
  );
}

const Container = styled(View)`
  position: absolute;
  left: 20px;
  width: 160px;
  top: 20px;
`;

const DEMOGRAPHIC_OPTIONS = [
  {
    name: 'Income',
    icon: SvgIncome,
    selectedValues: '',
  },
  {
    name: 'Age',
    icon: SvgAge,
    selectedValues: '25-40',
  },
  {
    name: 'Gender',
    icon: SvgGender,
    selectedValues: 'Male',
  },
  {
    name: 'Psychographic',
    icon: SvgPsychographic,
    selectedValues: '',
  },
  {
    name: 'Ethnicity',
    icon: SvgEthnicity,
    selectedValues: '3 selected',
  },
  {
    name: 'Commute',
    icon: SvgCommute,
    selectedValues: '',
  },
  {
    name: 'Profession',
    icon: SvgProfession,
    selectedValues: '',
  },
  {
    name: 'Education',
    icon: SvgEducation,
    selectedValues: '',
  },
  {
    name: 'Marital Status',
    icon: SvgMaritalStatus,
    selectedValues: '',
  },
  {
    name: 'Crime',
    icon: SvgCrime,
    selectedValues: '',
  },
];

const PROPERTIES_OPTIONS = [
  {
    name: 'Rent',
    icon: SvgRent,
    selectedValues: '',
  },
  {
    name: 'Sqft',
    icon: SvgSqft,
    selectedValues: '',
  },
  { name: 'Type', icon: SvgPropertyType, selectedValues: '' },
];
