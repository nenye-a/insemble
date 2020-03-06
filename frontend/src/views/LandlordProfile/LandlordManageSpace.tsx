import React, { useState, ChangeEvent, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { useForm, FieldError, FieldValues } from 'react-hook-form';

import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
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
import PhotosPicker from '../LandlordOnboardingPage/PhotosPicker';
import { FileWithPreview } from '../../core-ui/Dropzone';
import { Equipments } from '../../generated/Equipments';
import { GET_SPACE, EDIT_SPACE } from '../../graphql/queries/server/space';
import { FONT_SIZE_LARGE } from '../../constants/theme';
import { getImageBlob, dateFormatter } from '../../utils';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { GetSpace, GetSpaceVariables } from '../../generated/GetSpace';

type Props = {
  spaceId: string;
};

export default function LandlordManageSpace(props: Props) {
  let { spaceId } = props;
  let { data, error, loading, refetch } = useQuery<GetSpace, GetSpaceVariables>(GET_SPACE, {
    variables: { spaceId },
  });
  let [
    editSpace,
    { data: editSpaceData, loading: editSpaceLoading, error: editSpaceError },
  ] = useMutation(EDIT_SPACE);
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let { register, errors, handleSubmit } = useForm();
  let [selectedCondition, setSelectedCondition] = useState('Whitebox');
  let [description, setDescription] = useState('');
  let [selectedEquipment, setSelectedEquipment] = useState<Array<string>>([]);
  let [mainPhoto, setMainPhoto] = useState<string | FileWithPreview | null>('');
  let [additionalPhotos, setAdditionalPhotos] = useState<Array<string | FileWithPreview | null>>(
    []
  );
  useEffect(() => {
    if (!loading && data) {
      let newPhotos: Array<string | null> = [];
      newPhotos.push(...data.space.photos);
      while (newPhotos.length < 4) {
        newPhotos.push(null);
      }
      setMainPhoto(data.space.mainPhoto);
      setAdditionalPhotos(newPhotos);
    }
  }, [data, loading]);
  let onSubmit = (fieldValues: FieldValues) => {
    let { sqft, priceSqft, date } = fieldValues;
    if (mainPhoto && typeof mainPhoto !== 'string') {
      let mainPhotoBlob = getImageBlob(mainPhoto.file);
      let additionalPhotosBlob = [];
      for (let photo of additionalPhotos) {
        if (!!photo && typeof photo !== 'string') {
          let photoBlob = getImageBlob(photo.file);
          additionalPhotosBlob.push(photoBlob);
        }
      }
      let newMainPhotoUrl =
        typeof mainPhoto === 'string' && mainPhoto === data?.space.mainPhoto ? mainPhoto : null;
      let newPhotoUrls = data?.space.photos.filter((item) => additionalPhotos.includes(item));
      if (Object.keys(errors).length === 0) {
        editSpace({
          variables: {
            spaceId,
            space: {
              mainPhoto: mainPhotoBlob ? mainPhotoBlob : null,
              photoUploads: additionalPhotosBlob,
              photoUrls: newPhotoUrls,
              mainPhotoUrl: newMainPhotoUrl,
              description: description,
              condition: selectedCondition,
              sqft,
              priceSqft,
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
    }
  };
  let errorMessage = editSpaceError ? editSpaceError.message : '';

  let today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Container>
          {loading ? (
            <LoadingIndicator />
          ) : error ? (
            <CenteredView flex>
              <Text fontSize={FONT_SIZE_LARGE}>{error.message || ''}</Text>
              <Button text="Try Again" onPress={refetch} />
            </CenteredView>
          ) : (
            data?.space && (
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
            )
          )}
          <Alert visible={!!editSpaceData} text="Your profile has been updated" />
          <Alert visible={!!editSpaceError} text={errorMessage} />
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
              containerStyle={{ marginTop: 8, marginBottom: 24, width: '100%' }}
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
        </Container>
        <OnboardingFooter>
          <Button text="Done" type="submit" loading={editSpaceLoading} />
        </OnboardingFooter>
      </Form>
    </>
  );
}
const Container = styled(View)`
  padding: 24px;
`;
const RowView = styled(View)`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 24px 0 0 0;
`;

const LabelText = styled(Label)`
  margin: 24px 0 8px 0;
`;

const RadioGroupContainer = styled(RadioGroup)`
  margin: 24px 0 0 0;
`;

const Features = styled(MultiSelectInput)`
  margin: 24px 0 0 0;
  width: 100%;
`;

const DatePicker = styled(TextInput)`
  width: 100%;
`;
const CenteredView = styled(View)`
  justify-content: center;
  align-items: center;
`;
