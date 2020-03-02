import React, { useState, ChangeEvent, Dispatch, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useForm, FieldError } from 'react-hook-form';
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
} from '../../core-ui';
import PhotosPicker from './PhotosPicker';
import { FileWithPreview } from '../../core-ui/Dropzone';
import { THEME_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD, FONT_SIZE_SMALL } from '../../constants/theme';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';
import { validateNumber } from '../../utils/validation';
import OnboardingFooter from '../../components/layout/OnboardingFooter';

type Props = {
  state: LandlordOnboardingState;
  dispatch: Dispatch<Action>;
};

export default function LandlordListing(props: Props) {
  let history = useHistory();
  let { state, dispatch } = props;
  let { confirmLocation, spaceListing } = state;
  let { register, errors, handleSubmit, watch } = useForm();
  let sqft = watch('sqft', spaceListing.sqft);
  let price = watch('price', spaceListing.pricePerSqft);
  let date = watch('date', spaceListing.availability);
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [mainPhoto, setMainPhoto] = useState<FileWithPreview | null>(spaceListing?.mainPhoto || null);
  let [additionalPhotos, setAdditionalPhotos] = useState<Array<FileWithPreview | null>>(
    spaceListing?.propertyPhotos || [null, null, null, null]
  );
  let [description, setDescription] = useState<string>(spaceListing?.description || '');
  let [selectedCondition, setSelectedCondition] = useState(spaceListing?.condition || 'Whitebox');
  let [selectedEquipments, setSelectedEquipment] = useState<Array<string>>(
    spaceListing?.equipments || []
  );
  let today = new Date().toISOString().slice(0, 10);

  let allValid = mainPhoto && selectedCondition && Object.keys(errors).length === 0;

  let saveFormState = useCallback(() => {
    if (allValid && mainPhoto) {
      dispatch({
        type: 'SAVE_CHANGES_NEW_LISTING',
        values: {
          spaceListing: {
            mainPhoto,
            propertyPhotos: additionalPhotos,
            description,
            condition: selectedCondition,
            sqft,
            pricePerSqft: price,
            equipments: selectedEquipments,
            availability: date,
          },
        },
      });
    }
  }, [
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
  ]);

  let onSubmit = async () => {
    if (allValid) {
      saveFormState();
      history.push('/landlord/new-property/step-5');
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
  ]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <TitleContainer>
          {/* Check number of space when connecting to BE */}
          <Title>Space 1</Title>
          <Address>{confirmLocation?.physicalAddress?.address || ''}</Address>
        </TitleContainer>
        <Alert
          visible
          text="We provide complementary virtual tours & comprehensive photos to every listing."
        />
        <PhotosPicker
          mainPhoto={mainPhoto}
          onMainPhotoChange={(file: FileWithPreview | null) => {
            setMainPhoto(file);
          }}
          additionalPhotos={additionalPhotos}
          onAdditionalPhotoChange={(files: Array<FileWithPreview | null>) => {
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
        <ShortTextInput
          label="Sqft"
          name="sqft"
          placeholder="0"
          ref={register({
            required: 'Sqft should not be empty',
            validate: (val) => validateNumber(val) || 'Input should be number',
          })}
          defaultValue={spaceListing.sqft}
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
          defaultValue={spaceListing.pricePerSqft}
          containerStyle={{ marginTop: 12, marginBottom: 12 }}
          errorMessage={(errors?.price as FieldError)?.message || ''}
        />
        <View style={{ paddingTop: 12, paddingBottom: 12, zIndex: 2 }}>
          <LabelText text="Features & Amenities" />
          {!equipmentLoading && equipmentData && (
            <MultiSelectInput
              placeholder="Set Equipment Preference"
              options={equipmentData.equipments}
              onChange={setSelectedEquipment}
              inputContainerStyle={{ flex: 1 }}
            />
          )}
        </View>
        <DatePickerContainer>
          <TextInput
            type="date"
            name="date"
            label="Availability"
            min={today}
            defaultValue={today}
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
            saveFormState();
            history.goBack();
          }}
          disabled={!allValid}
        />
        <Button text="Next" disabled={!allValid} type="submit" />
      </OnboardingFooter>
    </Form>
  );
}

function getBase64(file: File): Promise<string | null | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.onerror = (error) => reject(error);
  });
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
