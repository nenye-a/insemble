import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useForm } from 'react-hook-form';

import {
  View,
  Card,
  Button,
  Text,
  TextInput,
  RadioGroup,
  MultiSelectLocation,
  LoadingIndicator,
  Label,
  Form,
} from '../core-ui';
import {
  FONT_SIZE_LARGE,
  FONT_WEIGHT_BOLD,
  DEFAULT_BORDER_RADIUS,
  FONT_FAMILY_NORMAL,
  FONT_SIZE_NORMAL,
} from '../constants/theme';
import {
  THEME_COLOR,
  TEXT_INPUT_BORDER_COLOR,
  TEXT_COLOR,
  WHITE,
  DISABLED_TEXT_INPUT_BACKGROUND,
} from '../constants/colors';
import { useGoogleMaps } from '../utils';
import { LocationInput } from '../generated/globalTypes';
import SvgArrowBack from '../components/icons/arrow-back';
import { GET_TENANT_MATCHES_DATA } from '../graphql/queries/server/matches';
import { TenantMatches, TenantMatchesVariables } from '../generated/TenantMatches';
import { NEW_LOCATION_PLAN_OPTIONS } from '../constants/locationPlan';
import { NewLocationPlanObj } from '../reducers/tenantOnboardingReducer';
import LocationsInput from './LandingPage/LocationsInput';

export default function BrandDetail() {
  let { brandId = '' } = useParams();
  let { loading, data } = useQuery<TenantMatches, TenantMatchesVariables>(GET_TENANT_MATCHES_DATA, {
    variables: {
      brandId,
    },
  });
  let history = useHistory();
  let { isLoading } = useGoogleMaps();
  let { register, errors, handleSubmit } = useForm();
  let [matchesEditable, setMatchesEditable] = useState(false);
  let [goalsEditable, setGoalsEditable] = useState(false);
  let [selectedIsLookingLocation, setSelectedIsLookingLocation] = useState<
    NewLocationPlanObj | undefined
  >();
  let [, setSelectedLocations] = useState<Array<LocationInput>>([]);
  let inputContainerStyle = { paddingTop: 12, paddingBottom: 12 };

  let onSubmit = () => {};
  useEffect(() => {
    if (data) {
      let foundLocationPlan = NEW_LOCATION_PLAN_OPTIONS.find(
        (item) => item.value === data?.tenantMatches.newLocationPlan
      );
      if (foundLocationPlan) {
        setSelectedIsLookingLocation(foundLocationPlan);
      }
    }
  }, [loading]);

  return (
    <Container flex>
      <View style={{ alignItems: 'flex-start' }}>
        <Button
          mode="transparent"
          text="Back to Your Brand"
          icon={<SvgArrowBack style={{ color: THEME_COLOR }} />}
          textProps={{ style: { marginLeft: 8 } }}
          onPress={() => history.goBack()}
        />
      </View>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <Form onSubmit={handleSubmit(onSubmit)}>
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
            defaultValue={data?.tenantMatches.name || ''}
          />
          <Label id="representativeAddress" text="Representative Location Address" />
          <LocationsInput
            id="representativeAddress"
            placeholder="Representative Location Address"
            defaultValue={data?.tenantMatches.location?.address}
            disabled={!matchesEditable}
            style={{
              borderRadius: DEFAULT_BORDER_RADIUS,
              borderColor: TEXT_INPUT_BORDER_COLOR,
              borderStyle: 'solid',
              borderWidth: 1,
              paddingLeft: 12,
              paddingRight: 12,
              height: 36,
              color: TEXT_COLOR,
              fontFamily: FONT_FAMILY_NORMAL,
              fontSize: FONT_SIZE_NORMAL,
              backgroundColor: !matchesEditable ? DISABLED_TEXT_INPUT_BACKGROUND : WHITE,
              marginTop: 12,
              marginBottom: 8,
            }}
            onSubmit={(place: google.maps.places.PlaceResult) => {
              let {
                geometry,
                formatted_address: formattedAddress,
                name,
                place_id: placeID,
              } = place;
              if (geometry) {
                let { location } = geometry;
                if (location) {
                  let { lat, lng } = location;
                  let latitude = lat();
                  let longitude = lng();
                  history.push(`/verify/${placeID}`, {
                    placeID,
                    name,
                    formattedAddress,
                    lat: latitude.toString(),
                    lng: longitude.toString(),
                  });
                }
              }
            }}
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
            selectedOption={selectedIsLookingLocation}
            onSelect={(item: NewLocationPlanObj) => {
              setSelectedIsLookingLocation(item);
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
              defaultSelected={data?.tenantMatches?.nextLocations || undefined}
              containerStyle={inputContainerStyle}
            />
          )}

          <LocationsNumberInput
            label="How many locations do you expect to open in the next 2 years?"
            placeholder="1"
            disabled={!goalsEditable}
            containerStyle={inputContainerStyle}
            defaultValue={data?.tenantMatches.locationCount || ''}
          />
          <SaveButton text="Save Changes" type="submit" loading={false} />
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
        </Form>
      )}

      {/* TODO: add Table here */}
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

const SaveButton = styled(Button)`
  align-self: flex-end;
  margin: 12px 0;
`;
