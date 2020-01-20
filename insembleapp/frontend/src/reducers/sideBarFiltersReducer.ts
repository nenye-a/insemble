import { ComponentType } from 'react';
import { IconProps } from '../types/types';

export type FilterObj =
  | {
      name: string;
      icon: ComponentType<IconProps>;
      selectedValues: Array<string>;
      allOptions?: Array<string>;
    }
  | {
      name: string;
      icon: ComponentType<IconProps>;
      selectedValues: Array<number>;
      allOptions?: Array<string>;
    };

type State = {
  demographics: Array<FilterObj>;
  properties: Array<FilterObj>;
  openFilterName: string | null;
};

type Action =
  | {
      type: 'ON_PILL_SELECT';
      name: string | null;
      selectedItem: string;
    }
  | {
      type: 'ON_PILL_UNSELECT';
      name: string | null;
      selectedItem: string;
    }
  | {
      type: 'ON_SLIDE_CHANGE';
      name: string | null;
      selectedValues: Array<number>;
    }
  | {
      type: 'ON_CLEAR_PRESS';
      name: string | null;
    }
  | {
      type: 'ON_OPTION_PRESS';
      name: string | null;
    }
  | {
      type: 'ON_DONE_PRESS';
    }
  | {
      type: 'ON_OPTIONS_FETCH_SUCCESS';
      demographics: Array<FilterObj>;
      properties: Array<FilterObj>;
    }
  | {
      type: 'ON_LOW_RANGE_CHANGE';
      name: string | null;
      value: string;
    }
  | {
      type: 'ON_HIGH_RANGE_CHANGE';
      name: string | null;
      value: string;
    };

export default function sideBarFiltersReducer(state: State, action: Action): State {
  let { demographics, properties } = state;
  switch (action.type) {
    case 'ON_PILL_SELECT': {
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
    case 'ON_PILL_UNSELECT': {
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
    case 'ON_SLIDE_CHANGE': {
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
    case 'ON_CLEAR_PRESS': {
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
    case 'ON_OPTION_PRESS': {
      return { ...state, openFilterName: action.name };
    }
    case 'ON_DONE_PRESS': {
      return { ...state, openFilterName: null };
    }
    case 'ON_OPTIONS_FETCH_SUCCESS': {
      return { ...state, demographics: action.demographics, properties: action.properties };
    }
    case 'ON_LOW_RANGE_CHANGE': {
      let newProperties = [...properties].map((item) => {
        if (item.name === action.name) {
          let selectedValues = [action.value, item.selectedValues[1]];
          return { ...item, selectedValues };
        }
        return item;
      });
      return { ...state, properties: newProperties as Array<FilterObj> };
    }
    case 'ON_HIGH_RANGE_CHANGE': {
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
