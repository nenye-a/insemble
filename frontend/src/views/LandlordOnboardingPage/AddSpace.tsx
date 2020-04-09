import React, { useState, ChangeEvent, Dispatch, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useForm, FieldError, FieldValues } from 'react-hook-form';
import { useHistory } from 'react-router-dom';

import {
  View,
  RadioGroup,
  TextInput,
  TextArea,
  Label,
  MultiSelectInput,
  Alert,
  Text,
  Form,
  Button,
  Checkbox,
} from '../../core-ui';
import PhotosPicker from './PhotosPicker';
import { FileWithPreview } from '../../core-ui/Dropzone';
import { THEME_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import {
  FONT_SIZE_MEDIUM,
  FONT_WEIGHT_BOLD,
  FONT_SIZE_SMALL,
  FONT_SIZE_NORMAL,
} from '../../constants/theme';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';
import { validateNumber } from '../../utils/validation';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { Action, State as LandlordAddSpaceState } from '../../reducers/landlordAddSpaceReducer';
import { MarketingPreference } from '../../generated/globalTypes';
import { SPACES_TYPE } from '../../constants/spaces';

type Props = {
  state: LandlordAddSpaceState;
  dispatch: Dispatch<Action>;
};

type MarketingPreferenceRadio = {
  label: string;
  value: MarketingPreference;
};

const MARKETING_PREFERENCE_OPTIONS: Array<MarketingPreferenceRadio> = [
  {
    label: 'Public — I want to publicly advertise my property to matching tenants.',
    value: MarketingPreference.PUBLIC,
  },
  {
    label:
      'Private — I want to connect with matching tenants without publicly listing my property.',
    value: MarketingPreference.PRIVATE,
  },
];

export default function AddSpace(props: Props) {
  let history = useHistory();
  let { state, dispatch } = props;
  let { addSpace } = state;
  let { register, errors, handleSubmit, watch } = useForm();
  let sqft = addSpace.sqft || watch('sqft');
  let price = addSpace.pricePerSqft || watch('price');
  let date = addSpace.availability || watch('date');
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [mainPhoto, setMainPhoto] = useState<string | FileWithPreview | null>(addSpace.mainPhoto);
  let [additionalPhotos, setAdditionalPhotos] = useState<Array<string | FileWithPreview | null>>(
    addSpace.propertyPhotos
  );
  let [selectedType, setSelectedType] = useState<Array<string>>(addSpace.propertyType || []);
  let [selectedMarketingPreference, setSelectedMarketingPreference] = useState<
    MarketingPreferenceRadio
  >(MARKETING_PREFERENCE_OPTIONS[0]);
  let [description, setDescription] = useState<string>(addSpace.description);
  let [selectedCondition, setSelectedCondition] = useState(addSpace.condition || 'Whitebox');
  let [selectedEquipments, setSelectedEquipment] = useState<Array<string>>(addSpace.equipments);
  let today = new Date().toISOString().slice(0, 10);
  let allValid = mainPhoto && selectedCondition && Object.keys(errors).length === 0;
  let { propertyId, address } = history.location.state;

  let saveFormState = useCallback(
    (fieldValues?: FieldValues) => {
      if (allValid && mainPhoto) {
        dispatch({
          type: 'SAVE_CHANGES_ADD_SPACE',
          values: {
            addSpace: {
              mainPhoto,
              propertyPhotos: additionalPhotos,
              description,
              condition: selectedCondition,
              sqft: fieldValues ? fieldValues.sqft : sqft,
              pricePerSqft: fieldValues ? fieldValues.price : price,
              equipments: selectedEquipments,
              availability: fieldValues ? fieldValues.date : date,
              marketingPreference: selectedMarketingPreference.value,
              propertyType: selectedType,
            },
          },
        });
      }
    },
    [
      dispatch,
      allValid,
      mainPhoto,
      additionalPhotos,
      description,
      selectedCondition,
      sqft,
      price,
      selectedEquipments,
      date,
      selectedMarketingPreference,
      selectedType,
    ]
  );

  let onSubmit = async (fieldValues: FieldValues) => {
    saveFormState(fieldValues);
    if (propertyId) {
      history.push('/landlord/add-space/step-2', { propertyId: propertyId, address: address });
    }
  };
  useEffect(() => {
    saveFormState();
  }, [
    saveFormState,
    mainPhoto,
    additionalPhotos,
    description,
    selectedCondition,
    sqft,
    price,
    selectedEquipments,
    date,
    selectedMarketingPreference,
    selectedType,
  ]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <TitleContainer>
          {/* Check number of space when connecting to BE */}
          <Title>Space 1</Title>
          {/* TODO: fetch dari properties */}
          <Address>{address}</Address>
        </TitleContainer>
        <Alert
          visible
          text="We provide complementary virtual tours & comprehensive photos to every listing."
        />
        <RadioGroup<MarketingPreferenceRadio>
          name="Marketing Preference"
          options={MARKETING_PREFERENCE_OPTIONS}
          selectedOption={selectedMarketingPreference}
          onSelect={(item) => {
            setSelectedMarketingPreference(item);
          }}
          radioItemProps={{ style: { marginTop: 9 } }}
          titleExtractor={(item: MarketingPreferenceRadio) => item.label}
        />
        <PhotosPicker
          mainPhoto={mainPhoto}
          onMainPhotoChange={(file: FileWithPreview | null | string) => {
            setMainPhoto(file);
          }}
          additionalPhotos={additionalPhotos}
          onAdditionalPhotoChange={(files: Array<FileWithPreview | null | string>) => {
            setAdditionalPhotos(files);
          }}
        />
        <TextArea
          label="Description"
          placeholder="Enter Description"
          values={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setDescription(e.target.value);
          }}
          showCharacterLimit
          containerStyle={{ marginTop: 12, marginBottom: 12 }}
        />
        <RadioGroupContainer
          label="Condition"
          options={['Whitebox', 'Second Generation Restaurant']}
          selectedOption={selectedCondition}
          onSelect={(value: string) => {
            setSelectedCondition(value);
          }}
          radioItemProps={{ style: { marginTop: 8 } }}
        />
        <FieldInput>
          <LabelText text="What type of space is this?" />
          {SPACES_TYPE.map((option, index) => {
            let isChecked = selectedType.includes(option);
            return (
              <Checkbox
                key={index}
                size="18px"
                title={option}
                titleProps={{ style: { fontSize: FONT_SIZE_NORMAL } }}
                isChecked={isChecked}
                onPress={() => {
                  if (isChecked) {
                    let newSelectedType = selectedType.filter((item: string) => item !== option);
                    setSelectedType(newSelectedType);
                  } else {
                    setSelectedType([...selectedType, option]);
                  }
                }}
                style={{ lineHeight: 2 }}
              />
            );
          })}
        </FieldInput>
        <ShortTextInput
          label="Sqft"
          name="sqft"
          placeholder="0"
          ref={register({
            required: 'Sqft should not be empty',
            validate: (val) => validateNumber(val) || 'Input should be number',
          })}
          defaultValue={sqft}
          containerStyle={{ marginTop: 12, marginBottom: 12 }}
          errorMessage={(errors?.sqft as FieldError)?.message || ''}
        />
        <ShortTextInput
          label="Price/Sqft"
          name="price"
          placeholder="$0"
          ref={register({
            required: 'Price/Sqft should not be empty',
            validate: (val) => validateNumber(val) || 'Input should be number',
          })}
          defaultValue={price}
          containerStyle={{ marginTop: 12, marginBottom: 12 }}
          errorMessage={(errors?.price as FieldError)?.message || ''}
        />
        <View style={{ paddingTop: 12, paddingBottom: 12, zIndex: 2 }}>
          <LabelText text="Features & Amenities" />
          {!equipmentLoading && equipmentData && (
            <MultiSelectInput
              placeholder="Set Features & Amenities"
              options={equipmentData.equipments}
              onChange={setSelectedEquipment}
              inputContainerStyle={{ flex: 1 }}
              defaultSelected={selectedEquipments}
            />
          )}
        </View>
        <DatePickerContainer>
          <TextInput
            type="date"
            name="date"
            label="Availability"
            min={today}
            defaultValue={date || today}
            ref={register({
              required: 'Date should not be empty',
            })}
            errorMessage={(errors?.date as FieldError)?.message || ''}
          />
          <SpaceAlert
            style={{ alignSelf: 'flex-end' }}
            visible
            text="You will be able to add more spaces later"
          />
        </DatePickerContainer>
      </Container>
      <OnboardingFooter>
        <TransparentButton
          mode="transparent"
          text="Back"
          onPress={() => {
            history.goBack();
          }}
        />
        <Button text="Submit" disabled={!allValid} type="submit" />
      </OnboardingFooter>
    </Form>
  );
}

const Container = styled(View)`
  padding: 12px 48px;
  z-index: 2;
`;

const RowView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const LabelText = styled(Label)`
  margin-bottom: 8px;
`;

const RadioGroupContainer = styled(RadioGroup)`
  margin: 12px 0;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
  color: ${THEME_COLOR};
  margin: 0 14px 0 0;
`;
const Address = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  color: ${DARK_TEXT_COLOR};
`;

const SpaceAlert = styled(Alert)`
  margin: 0 0 0 38px;
`;

const ShortTextInput = styled(TextInput)`
  width: 100px;
`;

const TitleContainer = styled(RowView)`
  padding: 12px 0;
`;

const DatePickerContainer = styled(RowView)`
  padding: 12px 0;
`;

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;

const FieldInput = styled(View)`
  padding: 12px 0;
`;
