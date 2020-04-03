import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useHistory, Redirect } from 'react-router-dom';
import { useForm, FieldError, FieldValues } from 'react-hook-form';

import {
  View,
  Alert,
  Label,
  Checkbox,
  MultiSelectInput,
  Form as BaseForm,
  Button,
  TextInput,
  Text,
  LoadingIndicator,
} from '../../core-ui';
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
import { TenantOnboardingState } from '../../graphql/localState';
import {
  GET_TENANT_ONBOARDING_STATE,
  UPDATE_TENANT_ONBOARDING,
} from '../../graphql/queries/client/tenantOnboarding';

export default function TenantPhysicalCriteria() {
  let { tenantToken } = useCredentials();
  let signedIn = !!tenantToken;
  let history = useHistory();
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let { data: onboardingStateData, loading: onboardingStateLoading } = useQuery<
    TenantOnboardingState
  >(GET_TENANT_ONBOARDING_STATE);
  let [updateTenantOnboarding] = useMutation(UPDATE_TENANT_ONBOARDING);

  let [createBrand, { loading, data }] = useMutation<CreateBrand, CreateBrandVariables>(
    CREATE_BRAND
  );
  let [selectedSpaceOptions, setSelectedSpaceOptions] = useState<Array<string>>([]);
  let [selectedEquipmentOptions, setSelectedEquipmentOptions] = useState<Array<string>>([]);
  let [minSqft, setMinSqft] = useState('');
  let [maxSqft, setMaxSqft] = useState('');
  let sqftError = useMemo(() => getRangeInputError(minSqft, maxSqft), [minSqft, maxSqft]);
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  let { register, errors, handleSubmit } = useForm();

  useEffect(() => {
    if (onboardingStateData) {
      let {
        minSize,
        maxSize,
        equipments,
        spaceType,
      } = onboardingStateData.tenantOnboardingState.physicalSiteCriteria;
      setMinSqft(minSize);
      setMaxSqft(maxSize);
      setSelectedSpaceOptions(spaceType);
      setSelectedEquipmentOptions(equipments);
    }
  }, [onboardingStateData]);
  let onSubmit = async (fieldValues: FieldValues) => {
    if (!sqftError && onboardingStateData) {
      if (Object.keys(errors).length === 0) {
        await updateTenantOnboarding({
          variables: {
            physicalSiteCriteria: {
              minSize: minSqft,
              maxSize: maxSqft,
              minFrontageWidth: fieldValues.minFrontageWidth,
              equipments: selectedEquipmentOptions,
              spaceType: selectedSpaceOptions,
            },
          },
        });

        if (signedIn) {
          let {
            confirmBusinessDetail,
            tenantGoals,
            targetCustomers,
            physicalSiteCriteria,
          } = onboardingStateData.tenantOnboardingState;
          console.log(onboardingStateData, 'SEBELUM SIGN UP');
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
  } else if (onboardingStateData) {
    let { minFrontageWidth } = onboardingStateData.tenantOnboardingState.physicalSiteCriteria;
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
          <NumberTextInput
            label="Minimum Frontage Width (ft)"
            name="minFrontageWidth"
            defaultValue={minFrontageWidth}
            ref={register({
              validate: (val) => validateNumber(val) || 'Input should be number',
            })}
            containerStyle={inputContainerStyle}
            errorMessage={(errors?.minFrontageWidth as FieldError)?.message || ''}
          />
          <LabelText text="Buildout Preference" />
          {!equipmentLoading && equipmentData && (
            <MultiSelectInput
              placeholder="Buildout preference"
              options={equipmentData.equipments}
              onChange={setSelectedEquipmentOptions}
              containerStyle={{ marginBottom: 12 }}
              inputContainerStyle={{ flex: 1 }}
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
            type="submit"
            onPress={() => history.goBack()}
          />
          <Button text={signedIn ? 'Submit' : 'Next'} type="submit" loading={loading} />
        </OnboardingFooter>
      </Form>
    );
  } else if (onboardingStateLoading) {
    return <LoadingIndicator />;
  }
  return null;
}

function getRangeInputError(minValue: string, maxValue: string) {
  if (minValue && maxValue) {
    if (!validateNumber(minValue) || !validateNumber(maxValue)) {
      return 'Input should number';
    } else if (Number(minValue) >= Number(maxValue)) {
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

const NumberTextInput = styled(TextInput)`
  width: 80px;
`;

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
