import { DEMOGRAPHICS_CATEGORIES, PROPERTIES_CATEGORIES } from '../SideBarFilters';
import { FilterObj } from '../../../reducers/sideBarFiltersReducer';
import { Commute_commute as CommuteCommute } from '../../../generated/Commute';
import { Education_education as EducationEducation } from '../../../generated/Education';
import { DemographicsFilter, PropertyFilter } from '../../MainMap';
import { Ethnicity_ethnicity as EthnicityEthnicity } from '../../../generated/Ethnicity';

export function DELETED_BASE64_STRING(
  demographics: Array<FilterObj>,
  demographicsFilterValues: DemographicsFilter, // unformatted filter values from BE
  filter: {
    personas: Array<string> | undefined;
    commute: Array<CommuteCommute> | undefined;
    education: Array<EducationEducation> | undefined;
    ethnicity: Array<EthnicityEthnicity> | undefined;
    // option list
  }
): Array<FilterObj> {
  let selectedValues: Array<string> = [];
  let allOptions: Array<string> = [];
  let {
    minIncome,
    maxIncome,
    minAge,
    maxAge,
    personas,
    commute,
    education,
    ethnicity,
  } = demographicsFilterValues;
  let {
    personas: personasOptions,
    commute: commuteOptions,
    education: educationOptions,
    ethnicity: ethnicityOptions,
  } = filter;

  return demographics.map((item) => {
    switch (item.name) {
      case DEMOGRAPHICS_CATEGORIES.income: {
        selectedValues =
          minIncome != null && maxIncome != null
            ? [minIncome.toString(), maxIncome.toString()]
            : [];
        break;
      }
      case DEMOGRAPHICS_CATEGORIES.age: {
        selectedValues =
          minAge != null && maxAge != null ? [minAge.toString(), maxAge.toString()] : [];
        break;
      }
      case DEMOGRAPHICS_CATEGORIES.personas: {
        selectedValues = personas || [];
        allOptions = personasOptions ? personasOptions : [];
        break;
      }
      case DEMOGRAPHICS_CATEGORIES.commute: {
        selectedValues = commute || [];
        allOptions = commuteOptions ? commuteOptions.map((item) => item.displayValue) : [];
        break;
      }
      case DEMOGRAPHICS_CATEGORIES.education: {
        selectedValues = education || [];
        allOptions = educationOptions ? educationOptions.map((item) => item.displayValue) : [];
        break;
      }
      case DEMOGRAPHICS_CATEGORIES.ethnicity: {
        selectedValues = ethnicity || [];
        allOptions = ethnicityOptions ? ethnicityOptions.map((item) => item.displayValue) : [];
        break;
      }
    }
    return { ...item, selectedValues, allOptions };
  });
}

export function getPropertyOptionsAndPrefilledValues(
  properties: Array<FilterObj>,
  propertiesFilterValues: PropertyFilter,
  filter: {
    spaceType: Array<string> | undefined;
    amenities: Array<string> | undefined;
  }
) {
  let { spaceType, minRent, maxRent, amenities, minSize, maxSize } = propertiesFilterValues;
  let { spaceType: spaceTypeOptions, amenities: amenitiesOptions } = filter;
  return properties.map((item) => {
    let allOptions;
    let selectedValues: Array<string> = [];
    switch (item.name) {
      case PROPERTIES_CATEGORIES.propertyType: {
        selectedValues = spaceType || [];
        allOptions = spaceTypeOptions ? spaceTypeOptions : [];
        break;
      }
      case PROPERTIES_CATEGORIES.amenities: {
        selectedValues = amenities;
        allOptions = amenitiesOptions ? amenitiesOptions : [];
        break;
      }
      case PROPERTIES_CATEGORIES.rent: {
        selectedValues =
          typeof minRent === 'number' && typeof maxRent === 'number'
            ? [minRent.toString(), maxRent.toString()]
            : [];
        break;
      }
      case PROPERTIES_CATEGORIES.sqft: {
        selectedValues =
          typeof minSize === 'number' && typeof maxSize === 'number'
            ? [minSize.toString(), maxSize.toString()]
            : [];
        break;
      }
    }
    return { ...item, selectedValues, allOptions };
  });
}
