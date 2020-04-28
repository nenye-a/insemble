import React, { useState, Dispatch, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';
import { useForm, FieldValues } from 'react-hook-form';

import {
  View,
  Alert,
  Label,
  Checkbox,
  MultiSelectInput,
  Form as BaseForm,
  Button,
  Text,
} from '../../core-ui';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';
import { SPACES_TYPE } from '../../constants/spaces';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { validateNumber, useCredentials, getBusinessAndFilterParams } from '../../utils/';
import { CreateBrand, CreateBrandVariables } from '../../generated/CreateBrand';
import { CREATE_BRAND, GET_BRANDS } from '../../graphql/queries/server/brand';
import { FONT_SIZE_SMALL } from '../../constants/theme';
import { RED_TEXT } from '../../constants/colors';
import { RangeInput } from '../../components';

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function TenantPhysicalCriteria(props: Props) {
  let { dispatch, state } = props;
  let { tenantToken } = useCredentials();
  let { physicalSiteCriteria } = state;
  let signedIn = !!tenantToken;
  let history = useHistory();
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [createBrand, { loading, data }] = useMutation<CreateBrand, CreateBrandVariables>(
    CREATE_BRAND
  );
  let [selectedSpaceOptions, setSelectedSpaceOptions] = useState<Array<string>>(
    physicalSiteCriteria?.spaceType || []
  );
  let [selectedEquipmentOptions, setSelectedEquipmentOptions] = useState<Array<string>>([]);
  let [minSqft, setMinSqft] = useState(state.physicalSiteCriteria.minSize || '');
  let [maxSqft, setMaxSqft] = useState(state.physicalSiteCriteria.maxSize || '');
  let sqftError = useMemo(() => getRangeInputError(minSqft, maxSqft), [minSqft, maxSqft]);
  // let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  let { errors, handleSubmit, watch } = useForm();

  let saveFormState = (fieldValues?: FieldValues) => {
    let minFrontageWidth = fieldValues ? fieldValues.minFrontageWidth : watch('minFrontageWidth');
    dispatch({
      type: 'SAVE_CHANGES_PHYSICAL_SITE_CRITERIA',
      values: {
        physicalSiteCriteria: {
          minSize: minSqft,
          maxSize: maxSqft,
          minFrontageWidth,
          equipments: selectedEquipmentOptions,
          spaceType: selectedSpaceOptions,
        },
      },
    });
  };
  let onSubmit = (fieldValues: FieldValues) => {
    if (!sqftError) {
      if (Object.keys(errors).length === 0) {
        saveFormState(fieldValues);
        if (signedIn) {
          let { confirmBusinessDetail, tenantGoals, targetCustomers, physicalSiteCriteria } = state;
          createBrand({
            variables: {
              ...getBusinessAndFilterParams(
                confirmBusinessDetail,
                tenantGoals,
                targetCustomers,
                physicalSiteCriteria
              ),
            },
            refetchQueries: [{ query: GET_BRANDS }],
            awaitRefetchQueries: true,
          });
        } else {
          history.push('/verify/step-5');
        }
      }
    } else {
      dispatch({ type: 'DISABLE_NEXT_BUTTON' });
    }
  };

  if (data && data.createBrand) {
    let brandId = data.createBrand;
    return (
      <Redirect
        to={{
          pathname: `/map/${brandId}`,
          state: { newBrand: true },
        }}
      />
    );
  }

  return (
    <Form style={{ flex: 1 }} onSubmit={handleSubmit(onSubmit)}>
      <Content flex>
        <Description
          visible
          text="Customer criteria has been pre-populated based on your store's location."
        />
        <LabelText text="Sqft" />
        <RangeInputContainer
          lowValue={minSqft}
          onLowRangeInputChange={setMinSqft}
          highValue={maxSqft}
          onHighRangeInputChange={setMaxSqft}
        />
        {sqftError ? <ErrorMessage>{sqftError}</ErrorMessage> : null}
        {/* <NumberTextInput
          label="Minimum Frontage Width (ft)"
          name="minFrontageWidth"
          ref={register({
            validate: (val) => validateNumber(val) || 'Input should be number',
          })}
          containerStyle={inputContainerStyle}
          errorMessage={(errors?.minFrontageWidth as FieldError)?.message || ''}
        /> */}
        <LabelText text="Features & Amenities" />
        {!equipmentLoading && equipmentData && (
          <MultiSelectInput
            placeholder="Features & Amenities"
            options={equipmentData.equipments}
            onChange={setSelectedEquipmentOptions}
            containerStyle={{ marginBottom: 12 }}
            inputContainerStyle={{ flex: 1 }}
            defaultSelected={state.physicalSiteCriteria.equipments}
          />
        )}
        <LabelText text="Space type" />
        {SPACES_TYPE.map((option, index) => {
          let isChecked = selectedSpaceOptions.includes(option);
          return (
            <Checkbox
              key={index}
              size="18px"
              title={option}
              isChecked={isChecked}
              onPress={() => {
                if (isChecked) {
                  let newSelectedSpaceOptions = selectedSpaceOptions.filter(
                    (item: string) => item !== option
                  );
                  setSelectedSpaceOptions(newSelectedSpaceOptions);
                } else {
                  setSelectedSpaceOptions([...selectedSpaceOptions, option]);
                }
              }}
              style={{ lineHeight: 2 }}
            />
          );
        })}
      </Content>
      <OnboardingFooter>
        <TransparentButton
          text="Back"
          mode="transparent"
          onPress={() => {
            saveFormState();
            history.goBack();
          }}
        />
        <Button text={signedIn ? 'Submit' : 'Next'} type="submit" loading={loading} />
      </OnboardingFooter>
    </Form>
  );
}

function getRangeInputError(minValue: string | number, maxValue: string | number) {
  let minValueString = minValue.toString();
  let maxValueString = maxValue.toString();

  if (minValueString && maxValueString) {
    if (!validateNumber(minValueString) || !validateNumber(maxValueString)) {
      return 'Input should number';
    } else if (Number(minValueString) >= Number(maxValueString)) {
      return 'Minimum value should be lower than maximum value';
    }
    return '';
  }
  return '';
}

const Form = styled(BaseForm)`
  flex: 1;
`;

const Content = styled(View)`
  padding: 24px 48px;
`;

// const NumberTextInput = styled(TextInput)`
//   width: 80px;
// `;

const LabelText = styled(Label)`
  padding-top: 12px;
  padding-bottom: 8px;
`;

const Description = styled(Alert)`
  margin-bottom: 9px;
`;

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;

const ErrorMessage = styled(Text)`
  color: ${RED_TEXT};
  font-size: ${FONT_SIZE_SMALL};
  padding-bottom: 12px;
`;

const RangeInputContainer = styled(RangeInput)`
  width: 216px;
  margin: 0 0 6px 0;
`;
