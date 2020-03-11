import React, { useState, Dispatch } from 'react';
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
} from '../../core-ui';
import { Action, State as OnboardingState } from '../../reducers/tenantOnboardingReducer';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';
import { SPACES_TYPE } from '../../constants/spaces';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { validateNumber, useCredentials, getBusinessAndFilterParams } from '../../utils/';
import { CreateBrand, CreateBrandVariables } from '../../generated/CreateBrand';
import { CREATE_BRAND, GET_BRANDS } from '../../graphql/queries/server/brand';

type Props = {
  dispatch: Dispatch<Action>;
  state: OnboardingState;
};

export default function TenantPhysicalCriteria(props: Props) {
  let { dispatch, state } = props;
  let { tenantToken } = useCredentials();
  let signedIn = !!tenantToken;
  let history = useHistory();
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [createBrand, { loading, data }] = useMutation<CreateBrand, CreateBrandVariables>(
    CREATE_BRAND
  );
  let [selectedSpaceOptions, setSelectedSpaceOptions] = useState<Array<string>>([]);
  let [selectedEquipmentOptions, setSelectedEquipmentOptions] = useState<Array<string>>([]);
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };
  let { register, errors, handleSubmit } = useForm();

  let onSubmit = (fieldValues: FieldValues) => {
    if (Object.keys(errors).length === 0) {
      dispatch({
        type: 'SAVE_CHANGES_PHYSICAL_SITE_CRITERIA',
        values: {
          physicalSiteCriteria: {
            minSize: fieldValues.minSqft,
            minFrontageWidth: fieldValues.minFrontageWidth,
            equipments: selectedEquipmentOptions,
            spaceType: selectedSpaceOptions,
          },
        },
      });
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
  };

  if (data && data.createBrand) {
    let brandId = data.createBrand;
    return <Redirect to={`/map/${brandId}`} />;
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Content flex>
        <Description
          visible
          text="Customer criteria has been pre-populated based on your store's location."
        />
        <NumberTextInput
          label="Minimum Sqft"
          name="minSqft"
          ref={register({
            validate: (val) => validateNumber(val) || 'Input should be number',
          })}
          containerStyle={inputContainerStyle}
          errorMessage={(errors?.minSqft as FieldError)?.message || ''}
        />
        <NumberTextInput
          label="Minimum Frontage Width (ft)"
          name="minFrontageWidth"
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
