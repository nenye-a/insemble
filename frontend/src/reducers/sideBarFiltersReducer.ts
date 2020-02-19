import { ComponentType } from 'react';
import { IconProps } from '../types/types';
import { TenantMatchesContextType } from '../views/MainMap';

export enum FilterType {
  RANGE_SLIDER,
  RANGE_INPUT,
  SELECTION,
  SEARCH_SELECTION,
}

export type FilterObj = {
  name: string;
  icon: ComponentType<IconProps>;
  selectedValues: Array<string>;
  type: FilterType;
  allOptions?: Array<string>;
};

export type State = {
  demographics: Array<FilterObj>;
  properties: Array<FilterObj>;
  openFilterName: string | null;
};

export type Action =
  | {
      type: 'PILL_SELECT';
      name: string | null;
      selectedItem: string;
    }
  | {
      type: 'PILL_UNSELECT';
      name: string | null;
      selectedItem: string;
    }
  | {
      type: 'SLIDE_CHANGE';
      name: string | null;
      selectedValues: Array<number>;
    }
  | {
      type: 'CLEAR_PRESS';
      name: string | null;
    }
  | {
      type: 'OPTION_PRESS';
      name: string | null;
    }
  | {
      type: 'DONE_PRESS';
    }
  | {
      type: 'OPTIONS_FETCH_SUCCESS';
      demographics: Array<FilterObj>;
      properties: Array<FilterObj>;
    }
  | {
      type: 'LOW_RANGE_CHANGE';
      name: string | null;
      value: string;
    }
  | {
      type: 'HIGH_RANGE_CHANGE';
      name: string | null;
      value: string;
    };

export default function sideBarFiltersReducer(
  state: State,
  action: Action,
  context: TenantMatchesContextType
): State {
  let { demographics, properties } = state;
  switch (action.type) {
    case 'PILL_SELECT': {
      let foundFilterObject = [...demographics, ...properties].find(
        (filter) => filter.name === action.name
      );
      if (foundFilterObject) {
        let { selectedValues } = foundFilterObject;

        let newDemographics = [...demographics].map((item) => {
          if (item.name === action.name) {
            return { ...item, selectedValues: [...selectedValues, action.selectedItem] };
          }
          return item;
        });
        let newProperties = [...properties].map((item) => {
          if (item.name === action.name) {
            return { ...item, selectedValues: [...selectedValues, action.selectedItem] };
          }
          return item;
        });
        return {
          ...state,
          demographics: newDemographics as Array<FilterObj>,
          properties: newProperties as Array<FilterObj>,
        };
      }
      return state;
    }
    case 'PILL_UNSELECT': {
      let foundFilterObject = [...demographics, ...properties].find(
        (filter) => filter.name === action.name
      );
      if (foundFilterObject) {
        let { selectedValues } = foundFilterObject;
        let newDemographics = [...demographics].map((item) => {
          if (item.name === action.name) {
            let castedSelectedValues = selectedValues as Array<string>;
            let newSelectedValue = castedSelectedValues.filter(
              (el: string) => !el.includes(action.selectedItem)
            );
            return { ...item, selectedValues: newSelectedValue };
          }
          return item;
        });
        let newProperties = [...properties].map((item) => {
          if (item.name === action.name) {
            let castedSelectedValues = selectedValues as Array<string>;
            let newSelectedValue = castedSelectedValues.filter(
              (el: string) => !el.includes(action.selectedItem)
            );
            return { ...item, selectedValues: newSelectedValue };
          }
          return item;
        });
        return { ...state, demographics: newDemographics, properties: newProperties };
      }
      return state;
    }
    case 'SLIDE_CHANGE': {
      let foundFilterObject = [...demographics, ...properties].find(
        (filter) => filter.name === action.name
      );
      if (foundFilterObject) {
        let newDemographics = demographics.map((item) => {
          if (item.name === action.name) {
            return { ...item, selectedValues: (action.selectedValues as unknown) as Array<string> };
          }
          return item;
        });
        return { ...state, demographics: newDemographics };
      }
      return state;
    }
    case 'CLEAR_PRESS': {
      let foundFilterObject = [...demographics, ...properties].find(
        (filter) => filter.name === action.name
      );
      if (foundFilterObject) {
        let newDemographics = [...demographics].map((item) => {
          if (item.name === action.name) {
            return { ...item, selectedValues: [] };
          }
          return item;
        });
        let newProperties = [...properties].map((item) => {
          if (item.name === action.name) {
            return { ...item, selectedValues: [] };
          }
          return item;
        });
        return { ...state, demographics: newDemographics, properties: newProperties };
      }

      return state;
    }
    case 'OPTION_PRESS': {
      return { ...state, openFilterName: action.name };
    }
    case 'DONE_PRESS': {
      context && context.onFilterChange && context.onFilterChange(state);
      return { ...state, openFilterName: null };
    }
    case 'OPTIONS_FETCH_SUCCESS': {
      return { ...state, demographics: action.demographics, properties: action.properties };
    }
    case 'LOW_RANGE_CHANGE': {
      let newProperties = [...properties].map((item) => {
        if (item.name === action.name) {
          let selectedValues = [action.value, item.selectedValues[1]];
          return { ...item, selectedValues };
        }
        return item;
      });
      return { ...state, properties: newProperties as Array<FilterObj> };
    }
    case 'HIGH_RANGE_CHANGE': {
      let newProperties = [...properties].map((item) => {
        if (item.name === action.name) {
          let selectedValues = [item.selectedValues[0], action.value];
          return { ...item, selectedValues };
        }
        return item;
      });
      return { ...state, properties: newProperties as Array<FilterObj> };
    }
    default:
      return state;
  }
}
