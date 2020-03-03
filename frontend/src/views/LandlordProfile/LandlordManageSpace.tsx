import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useForm, FieldError } from 'react-hook-form';

import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import {
  View,
  RadioGroup,
  TextInput,
  TextArea,
  Label,
  MultiSelectInput,
  TouchableOpacity,
  Form,
  Text,
} from '../../core-ui';
import PhotosPicker from '../LandlordOnboardingPage/PhotosPicker';
import { FileWithPreview } from '../../core-ui/Dropzone';
import { Equipments } from '../../generated/Equipments';
import SvgCircleClose from '../../components/icons/circle-close';
import { THEME_COLOR, DARKER_GREY } from '../../constants/colors';
import { PHOTOS } from '../../fixtures/dummyData';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD, FONT_SIZE_SMALL } from '../../constants/theme';

export default function LandlordSpace() {
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [description, setDescription] = useState<string>('');
  let [selectedCondition, setSelectedCondition] = useState('Whitebox');
  let [, setSelectedEquipment] = useState<Array<string>>([]);
  let { register, errors } = useForm();
  let [photos, setPhotos] = useState<Array<string | null>>(PHOTOS);
  let [mainPhoto, setMainPhoto] = useState<FileWithPreview | null>(null);
  let [additionalPhotos, setAdditionalPhotos] = useState<Array<FileWithPreview | null>>([
    null,
    null,
    null,
    null,
  ]);
  while (photos.length < 5) {
    photos.push(null);
    setPhotos(photos);
  }
  let today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <View flex>
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
      </View>
      <Form>
        <TextArea
          label="Description"
          placeholder="Enter Description"
          values={description}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
            setDescription(e.target.value);
          }}
          showCharacterLimit
          containerStyle={{ marginTop: 24 }}
          characterLimit={300}
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
        <TextInput
          label="Sqft"
          name="sqft"
          placeholder="0"
          ref={register({
            required: 'Sqft should not be empty',
          })}
          containerStyle={{ marginTop: 24, width: 100 }}
          errorMessage={(errors?.sqft as FieldError)?.message || ''}
        />
        <TextInput
          label="Price/Sqft"
          name="price"
          placeholder="$0"
          ref={register({
            required: 'Price/Sqft should not be empty',
          })}
          containerStyle={{ marginTop: 24, width: 100, marginBottom: 24 }}
          errorMessage={(errors?.price as FieldError)?.message || ''}
        />
        <LabelText text="Features & Amenities" />
        {!equipmentLoading && equipmentData && (
          <Features
            placeholder="Set Equipment Preference"
            options={equipmentData.equipments}
            onChange={setSelectedEquipment}
            containerStyle={{ marginTop: 8, marginBottom: 24 }}
          />
        )}
        <LabelText text="Availability" />
        <RowView style={{ margin: 0 }}>
          <DatePicker
            type="date"
            name="date"
            min={today}
            defaultValue={today}
            ref={register({
              required: 'Date should not be empty',
            })}
            errorMessage={(errors?.date as FieldError)?.message || ''}
            containerStyle={{ marginTop: 8 }}
          />
        </RowView>
      </Form>
    </>
  );
}

const PhotosContainer = styled(View)`
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`;
const Photos = styled.img`
  height: 160px;
  object-fit: cover;
  border: 0.5px solid white;
  border-radius: 5px;
  width: 100%;
`;
const Photo = styled.img`
  height: 300px;
  object-fit: cover;
  border: 0.5px solid white;
  border-radius: 5px;
  width: 100%;
`;

const RowView = styled(View)`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 24px 0 0 0;
`;

const PhotoWrapper = styled(TouchableOpacity)`
  width: 24%;
`;
const LabelText = styled(Label)`
  margin: 24px 0 8px 0;
`;

const CloseButton = styled(SvgCircleClose)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const RadioGroupContainer = styled(RadioGroup)`
  margin: 24px 0 0 0;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
  color: ${THEME_COLOR};
  margin: 0 14px 0 0;
`;
const TotalSpace = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  font-color: ${DARKER_GREY};
  font-style: italic;
`;

const Features = styled(MultiSelectInput)`
  margin: 24px 0 0 0;
`;

const DatePicker = styled(TextInput)`
  width: 50%;
`;
