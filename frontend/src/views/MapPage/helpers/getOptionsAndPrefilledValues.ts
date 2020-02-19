import { DEMOGRAPHICS_CATEGORIES, PROPERTIES_CATEGORIES } from '../SideBarFilters';
import { FilterObj } from '../../../reducers/sideBarFiltersReducer';
import { Commute_commute as CommuteCommute } from '../../../generated/Commute';
import { Education_education as EducationEducation } from '../../../generated/Education';
import { DemographicsFilter, PropertyFilter } from '../../MainMap';

export function DELETED_BASE64_STRING(
  demographics: Array<FilterObj>,
  demographicsFilterValues: DemographicsFilter, // unformatted filter values from BE
  filter: {
    personas: Array<string> | undefined;
    commute: Array<CommuteCommute> | undefined;
    education: Array<EducationEducation> | undefined;
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
  } = demographicsFilterValues;
  let { personas: personasOptions, commute: commuteOptions, education: educationOptions } = filter;

  return demographics.map((item) => {
    switch (item.name) {
      case DEMOGRAPHICS_CATEGORIES.income: {
        selectedValues = minIncome && maxIncome ? [minIncome.toString(), maxIncome.toString()] : [];
        break;
      }
      case DEMOGRAPHICS_CATEGORIES.age: {
        selectedValues = minAge && maxAge ? [minAge.toString(), maxAge.toString()] : [];
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
    }
    return { ...item, selectedValues, allOptions };
  });
}

export function getPropertyOptionsAndPrefilledValues(
  properties: Array<FilterObj>,
  propertiesFilterValues: PropertyFilter,
  filter: {
    spaceType: Array<string> | undefined;
  }
) {
  let { spaceType, minRent, maxRent } = propertiesFilterValues;
  let { spaceType: spaceTypeOptions } = filter;
  return properties.map((item) => {
    let allOptions;
    let selectedValues: Array<string> = [];
    switch (item.name) {
      case PROPERTIES_CATEGORIES.propertyType: {
        selectedValues = spaceType || [];
        allOptions = spaceTypeOptions ? spaceTypeOptions : [];
        break;
      }
      case PROPERTIES_CATEGORIES.rent: {
        selectedValues = minRent && maxRent ? [minRent.toString(), maxRent.toString()] : [];
      }
    }
    return { ...item, selectedValues, allOptions };
  });
}
