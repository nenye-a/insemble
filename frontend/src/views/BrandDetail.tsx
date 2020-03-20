import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import { useForm, FieldValues, FieldError } from 'react-hook-form';

import {
  View,
  Card,
  Button,
  Text,
  TextInput,
  RadioGroup,
  MultiSelectLocation,
  Label,
  Form,
  Alert,
} from '../core-ui';
import { LocationInput as LocationsInput, Popup } from '../components';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../constants/theme';
import { THEME_COLOR } from '../constants/colors';
import { useGoogleMaps } from '../utils';
import { NEW_LOCATION_PLAN_OPTIONS } from '../constants/locationPlan';
import { NewLocationPlanObj } from '../reducers/tenantOnboardingReducer';
import { SelectedLocation } from '../components/LocationInput';
import SvgArrowBack from '../components/icons/arrow-back';
import { validateNumber } from '../utils/validation';
import omitTypename from '../utils/omitTypename';
import { EDIT_BRAND, GET_BRANDS, DELETE_BRAND } from '../graphql/queries/server/brand';
import { EditBrand, EditBrandVariables } from '../generated/EditBrand';
import { LocationInput } from '../generated/globalTypes';
import { GetBrands_brands as GetBrandsBrands } from '../generated/GetBrands';
import { DeleteBrand, DeleteBrandVariables } from '../generated/DeleteBrand';

export default function BrandDetail() {
  let { brandId = '' } = useParams();
  let history = useHistory<GetBrandsBrands>();
  let [
    editBrand,
    { data: editBrandData, loading: editBrandLoading, error: editBrandError },
  ] = useMutation<EditBrand, EditBrandVariables>(EDIT_BRAND);
  let [deleteBrand, { data: deleteBrandData, loading: deleteBrandLoading }] = useMutation<
    DeleteBrand,
    DeleteBrandVariables
  >(DELETE_BRAND);
  let { isLoading } = useGoogleMaps();
  let { register, errors, handleSubmit } = useForm();
  let [matchesEditable, setMatchesEditable] = useState(false);
  let [goalsEditable, setGoalsEditable] = useState(false);

  let [deleteConfirmationVisible, setDeleteConfirmationVisible] = useState(false);
  let [newLocationPlan, setNewLocationPlan] = useState<NewLocationPlanObj | undefined>();
  let [businessLocation, setBusinessLocation] = useState<LocationInput | undefined>();
  let [selectedLocations, setSelectedLocations] = useState<Array<LocationInput> | undefined>();
  let {
    name,
    nextLocations,
    newLocationPlan: newLocationPlanParam,
    locationCount,
    location,
  } = history.location.state;
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };

  let onSubmit = (formValues: FieldValues) => {
    let { businessName, locationCount } = formValues;

    if (Object.keys(errors).length === 0) {
      editBrand({
        variables: {
          business: {
            name: businessName,
            location: businessLocation,
            newLocationPlan: newLocationPlan && newLocationPlan.value,
            locationCount: isNaN(locationCount) ? null : Number(locationCount),
            nextLocations: selectedLocations,
          },
          brandId,
        },
        refetchQueries: [{ query: GET_BRANDS }],
      });
    }
  };

  let onRemovePress = () => {
    deleteBrand({
      variables: {
        brandId,
      },
      refetchQueries: [{ query: GET_BRANDS }],
    });
    closeDeleteConfirmation();
  };

  let closeDeleteConfirmation = () => {
    setDeleteConfirmationVisible(false);
  };

  useEffect(() => {
    let foundLocationPlan = NEW_LOCATION_PLAN_OPTIONS.find(
      (item) => item.value === newLocationPlanParam
    );
    if (foundLocationPlan) {
      setNewLocationPlan(foundLocationPlan);
    }
    if (location) {
      let { lat, lng, address } = location;
      setBusinessLocation({
        lat,
        lng,
        address,
      });
    }
  }, [location, newLocationPlanParam]);

  if (deleteBrandData?.deleteBrand) {
    return <Redirect to="/user/brands" />;
  }
  return (
    <Container flex>
      <Popup
        visible={deleteConfirmationVisible}
        title="Remove Brand"
        bodyText="Are you sure you want to remove this brand?"
        buttons={[
          { text: 'Yes', onPress: onRemovePress },
          { text: 'No', onPress: closeDeleteConfirmation },
        ]}
        onClose={closeDeleteConfirmation}
      />
      <View style={{ alignItems: 'flex-start' }}>
        <Button
          mode="transparent"
          text="Back to Your Brand"
          icon={<SvgArrowBack style={{ color: THEME_COLOR }} />}
          textProps={{ style: { marginLeft: 8 } }}
          onPress={() => history.goBack()}
        />
      </View>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* TODO: need to modify the BE so it returns statusMessage */}
        <Alert visible={!!editBrandData} text="Your brand has been updated" />
        <Alert
          visible={!!editBrandError}
          text={(editBrandError && editBrandError.message) || 'Something went wrong'}
        />

        <RowedView>
          <Title>Matches</Title>
          <Button
            mode="transparent"
            text="Edit Matches"
            onPress={() => {
              setMatchesEditable(true);
            }}
          />
        </RowedView>
        <TextInput
          label="Business Name"
          placeholder="Business Name"
          disabled={!matchesEditable}
          containerStyle={inputContainerStyle}
          defaultValue={name || ''}
          name="businessName"
          ref={register}
        />
        <Label id="representativeAddress" text="Representative Location Address" />
        <RepresentativeAddress
          id="representativeAddress"
          placeholder="Representative Location Address"
          defaultValue={location?.address || ''}
          disabled={!matchesEditable}
          style={{}}
          onPlaceSelected={({ lat, lng, address }: SelectedLocation) => {
            setBusinessLocation({
              lat,
              lng,
              address,
            });
          }}
          name="representativeAddress"
        />
        <RowedView>
          <Title>Goals</Title>
          <Button
            mode="transparent"
            text="Edit Goals"
            onPress={() => {
              setGoalsEditable(!goalsEditable);
            }}
          />
        </RowedView>
        <RadioGroupWrapper
          label="Are you actively looking for new locations?"
          options={NEW_LOCATION_PLAN_OPTIONS}
          selectedOption={newLocationPlan}
          onSelect={(item: NewLocationPlanObj) => {
            setNewLocationPlan(item);
          }}
          disabled={!goalsEditable}
          radioItemProps={{ style: { marginTop: 8 } }}
          titleExtractor={(item: NewLocationPlanObj) => item.label}
        />
        {!isLoading && (
          <MultiSelectLocation
            label="Where will you open your locations? (Cities, regions, or counties)"
            onSelected={(locations) => {
              setSelectedLocations(locations);
            }}
            defaultSelected={omitTypename(nextLocations || []) as Array<LocationInput>}
            containerStyle={inputContainerStyle}
          />
        )}

        <LocationsNumberInput
          label="How many locations do you expect to open in the next 2 years?"
          disabled={!goalsEditable}
          containerStyle={inputContainerStyle}
          defaultValue={locationCount || undefined}
          name="locationCount"
          ref={register({
            validate: (val) =>
              (val && validateNumber(val)) || 'Number of locations should be number',
          })}
          errorMessage={(errors?.locationCount as FieldError)?.message || ''}
        />
        <ButtonRow>
          <RemoveButton
            mode="secondary"
            text="Remove Brand"
            onPress={() => {
              setDeleteConfirmationVisible(true);
            }}
            loading={deleteBrandLoading}
          />
          <Button text="Save Changes" type="submit" loading={editBrandLoading} />
        </ButtonRow>
        {/*
            <RowedView>
              <Title>Locations & Performance</Title>
              <Button
                mode="transparent"
                text="Add, remove, or edit locations"
                onPress={() => {
                  setGoalsEditable(true);
                }}
              />
            </RowedView> */}
        {/* TODO: add Table here */}
      </Form>
    </Container>
  );
}

const Container = styled(Card)`
  padding: 12px 24px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  color: ${THEME_COLOR};
`;

const LocationsNumberInput = styled(TextInput)`
  width: 42px;
`;

const RadioGroupWrapper = styled(RadioGroup)`
  padding: 12px 0;
`;

const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 12px 0;
`;

const RemoveButton = styled(Button)`
  margin-right: 8px;
`;

const RepresentativeAddress = styled(LocationsInput)`
  margin-top: 12px;
  margin-bottom: 8px;
`;
