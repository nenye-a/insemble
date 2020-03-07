import React, { useState, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useForm, FieldError, FieldValues } from 'react-hook-form';

import {
  View,
  RadioGroup,
  TextInput,
  TextArea,
  Label,
  MultiSelectInput,
  Form,
  LoadingIndicator,
  Button,
  Text,
  Alert,
} from '../../core-ui';
import { FileWithPreview } from '../../core-ui/Dropzone';
import PhotosPicker from '../LandlordOnboardingPage/PhotosPicker';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { FONT_SIZE_LARGE } from '../../constants/theme';
import { WHITE } from '../../constants/colors';
import { getImageBlob, dateFormatter } from '../../utils';
import { GET_SPACE, EDIT_SPACE } from '../../graphql/queries/server/space';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';
import { GetSpace, GetSpaceVariables } from '../../generated/GetSpace';
import { PhotoFile } from '../../types/types';

type Props = {
  spaceId: string;
};

export default function LandlordManageSpace(props: Props) {
  let { spaceId } = props;
  let {
    data: spaceData,
    error: spaceError,
    loading: spaceLoading,
    refetch: spaceRefetch,
  } = useQuery<GetSpace, GetSpaceVariables>(GET_SPACE, {
    variables: { spaceId },
  });

  let [
    editSpace,
    { data: editSpaceData, loading: editSpaceLoading, error: editSpaceError },
  ] = useMutation(EDIT_SPACE);
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let { register, errors, handleSubmit } = useForm();
  let [selectedCondition, setSelectedCondition] = useState('');
  let [description, setDescription] = useState('');
  let [selectedEquipment, setSelectedEquipment] = useState<Array<string>>([]);
  let [mainPhoto, setMainPhoto] = useState<string | FileWithPreview | null>('');
  let [additionalPhotos, setAdditionalPhotos] = useState<Array<string | FileWithPreview | null>>(
    []
  );

  let today = new Date().toISOString().slice(0, 10);
  let errorMessage = editSpaceError ? editSpaceError.message : '';
  let textInputContainerStyle = { marginTop: 12, marginBottom: 12, width: 100 };
  let onSubmit = (fieldValues: FieldValues) => {
    let allValid = Object.keys(errors).length === 0 && mainPhoto;
    let { sqft, price, date } = fieldValues;

    let mainPhotoBlob =
      mainPhoto && typeof mainPhoto !== 'string' ? getImageBlob(mainPhoto.file) : undefined;

    let additionalPhotosBlob: Array<Blob> = [];
    for (let photo of additionalPhotos) {
      if (!!photo && typeof photo !== 'string') {
        let photoBlob = getImageBlob(photo.file);
        additionalPhotosBlob.push(photoBlob);
      }
    }
    let newMainPhotoUrl =
      typeof mainPhoto === 'string' && mainPhoto === spaceData?.space.mainPhoto ? mainPhoto : null;

    let newPhotoUrls = spaceData?.space.photos.filter((item) => additionalPhotos.includes(item));

    if (allValid) {
      editSpace({
        variables: {
          spaceId,
          space: {
            mainPhoto: mainPhotoBlob,
            photoUploads: additionalPhotosBlob,
            photoUrls: newPhotoUrls,
            mainPhotoUrl: newMainPhotoUrl,
            description: description,
            condition: selectedCondition,
            sqft: Number(sqft),
            pricePerSqft: Number(price),
            equipment: selectedEquipment,
            available: dateFormatter(date),
          },
        },
        refetchQueries: [
          {
            query: GET_SPACE,
          },
        ],
      });
    }
  };

  useEffect(() => {
    // populate state with previous values when fetching is finished
    if (!spaceLoading && spaceData) {
      let {
        space: {
          photos: prevPhotos,
          mainPhoto: prevMainPhoto,
          condition: prevCondition,
          description: prevDescription,
          equipment: prevEquipment,
        },
      } = spaceData;
      let newPhotos: Array<string | null> = [...prevPhotos];
      while (newPhotos.length < 4) {
        newPhotos.push(null);
      }
      setSelectedCondition(prevCondition);
      setDescription(prevDescription);
      setMainPhoto(prevMainPhoto);
      setAdditionalPhotos(newPhotos);
      setSelectedEquipment(prevEquipment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaceLoading]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <Alert visible={!!editSpaceData} text="Your profile has been updated" />
        <Alert visible={!!editSpaceError} text={errorMessage} />
        {spaceLoading ? (
          <LoadingIndicator />
        ) : spaceData?.space ? (
          <>
            <PhotosPicker
              mainPhoto={mainPhoto}
              onMainPhotoChange={(file: PhotoFile) => {
                setMainPhoto(file);
              }}
              additionalPhotos={additionalPhotos}
              onAdditionalPhotoChange={(files: Array<PhotoFile>) => {
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
              radioItemProps={{ style: { marginBottom: 8 } }}
            />
            <TextInput
              label="Sqft"
              name="sqft"
              placeholder="0"
              defaultValue={spaceData?.space.sqft}
              ref={register({
                required: 'Sqft should not be empty',
              })}
              containerStyle={textInputContainerStyle}
              errorMessage={(errors?.sqft as FieldError)?.message || ''}
            />
            <TextInput
              label="Price/Sqft"
              name="price"
              placeholder="$0"
              defaultValue={spaceData?.space.pricePerSqft}
              ref={register({
                required: 'Price/Sqft should not be empty',
              })}
              containerStyle={textInputContainerStyle}
              errorMessage={(errors?.price as FieldError)?.message || ''}
            />
            <LabelText text="Features & Amenities" />
            {!equipmentLoading && equipmentData && (
              <Features
                placeholder="Set Equipment Preference"
                options={equipmentData.equipments}
                onChange={setSelectedEquipment}
                inputContainerStyle={{ flex: 1 }}
                containerStyle={{ marginBottom: 12 }}
                defaultSelected={selectedEquipment}
              />
            )}
            <LabelText text="Availability" />
            <DatePicker
              type="date"
              name="date"
              min={today.slice(0, 10)}
              defaultValue={spaceData?.space.available.slice(0, 10) || today}
              ref={register({
                required: 'Date should not be empty',
              })}
              errorMessage={(errors?.date as FieldError)?.message || ''}
            />
          </>
        ) : (
          <CenteredView flex>
            <Text fontSize={FONT_SIZE_LARGE}>{spaceError?.message || ''}</Text>
            <Button text="Try Again" onPress={spaceRefetch} />
          </CenteredView>
        )}
      </Container>
      <OnboardingFooter>
        <Button text="Done" type="submit" loading={editSpaceLoading} />
      </OnboardingFooter>
    </Form>
  );
}
const Container = styled(View)`
  padding: 12px 24px;
  z-index: 1;
  background-color: ${WHITE};
`;

const LabelText = styled(Label)`
  margin: 12px 0 8px 0;
`;

const RadioGroupContainer = styled(RadioGroup)`
  margin: 12px 0 4px 0;
`;

const Features = styled(MultiSelectInput)`
  margin: 12px 0;
`;

const DatePicker = styled(TextInput)`
  width: 300px;
`;
const CenteredView = styled(View)`
  justify-content: center;
  align-items: center;
`;
