import React, { useState, ChangeEvent, Dispatch, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useForm, FieldError } from 'react-hook-form';

import {
  View,
  RadioGroup,
  TextInput,
  TextArea,
  Label,
  MultiSelectInput,
  Alert,
  Text,
} from '../../core-ui';
import PhotosPicker from './PhotosPicker';
import { FileWithPreview } from '../../core-ui/Dropzone';
import { THEME_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD, FONT_SIZE_SMALL } from '../../constants/theme';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';
import { validateNumber } from '../../utils/validation';

type Props = {
  state: LandlordOnboardingState;
  dispatch: Dispatch<Action>;
};

export default function LandlordListing(props: Props) {
  let { state, dispatch } = props;
  let { confirmLocation } = state;
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [mainPhoto, setMainPhoto] = useState<FileWithPreview | null>(null);
  let [additionalPhotos, setAdditionalPhotos] = useState<Array<FileWithPreview | null>>([
    null,
    null,
    null,
    null,
  ]);
  let [description, setDescription] = useState<string>('');
  let [selectedCondition, setSelectedCondition] = useState('Whitebox');
  let [, setSelectedEquipment] = useState<Array<string>>([]);
  let { register, errors, triggerValidation } = useForm();

  let today = new Date().toISOString().slice(0, 10);

  let allValid = mainPhoto && selectedCondition;

  useEffect(() => {
    if (allValid) {
      dispatch({ type: 'ENABLE_NEXT_BUTTON' });
      // TODO: save listing state
    } else {
      dispatch({ type: 'DISABLE_NEXT_BUTTON' });
    }
  }, [dispatch, allValid, triggerValidation]);

  return (
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
        containerStyle={{ marginTop: 12, marginBottom: 12 }}
        errorMessage={(errors?.price as FieldError)?.message || ''}
      />
      <View style={{ paddingTop: 12, paddingBottom: 12 }}>
        <LabelText text="Features & Amenities" />
        {!equipmentLoading && equipmentData && (
          <MultiSelectInput
            placeholder="Set Equipment Preference"
            options={equipmentData.equipments}
            onChange={setSelectedEquipment}
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
  );
}

const Container = styled(View)`
  padding: 12px 48px;
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
