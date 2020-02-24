import React, { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';

import {
  View,
  RadioGroup,
  TextInput,
  TextArea,
  Label,
  MultiSelectInput,
  Alert,
  TouchableOpacity,
  Text,
} from '../../core-ui';
import { THEME_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import { PHOTOS } from '../../fixtures/dummyData';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';
import Placeholder from '../../assets/images/addphotos.png';
import SvgCircleClose from '../../components/icons/circle-close';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD, FONT_SIZE_SMALL } from '../../constants/theme';

export default function LandlordListing() {
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [message, setMessage] = useState('');
  let [selectedCondition, setSelectedCondition] = useState('Whitebox');
  let [sqft, setSqft] = useState('');
  let [sqftPrice, setSqftPrice] = useState('');
  let [, setSelectedEquipment] = useState<Array<string>>([]);
  let [photos, setPhotos] = useState<Array<string>>([]);
  photos = PHOTOS;
  if (photos.length < 5) {
    photos.push('');
    setPhotos(photos);
  }
  let today = new Date().toISOString().slice(0, 10);
  let onRemovePhoto = (index: number) => {
    let newPhotos = photos.splice(index, 1, '');
    setPhotos(newPhotos);
  };

  return (
    <Container>
      <RowView>
        <Title>Space 1</Title>
        <Address>1004 West Slauson Avenue, Los Angeles</Address>
      </RowView>
      <Alert
        visible
        text="We provide complementary virtual tours & comprehensive photos to every listing."
      />
      <LabelText text="Temporary Main Photo" />
      <TouchableOpacity disabled={true} flex forwardedAs="button" type="button">
        <TouchableOpacity onPress={() => onRemovePhoto(0)}>
          <CloseButton />
        </TouchableOpacity>
        <Photo src={photos[0] === '' ? Placeholder : photos[0]} />
      </TouchableOpacity>
      <LabelText text="Additional Property Photos" />
      <PhotosContainer flex>
        {photos.slice(1).map((item, index) => (
          <PhotoWrapper key={index} disabled={item !== ''} forwardedAs="button" type="button">
            {item !== '' && (
              <TouchableOpacity onPress={() => onRemovePhoto(index + 1)}>
                <CloseButton />
              </TouchableOpacity>
            )}
            <Photos key={index} src={item === '' ? Placeholder : item} alt={item} />
          </PhotoWrapper>
        ))}
      </PhotosContainer>
      <TextArea
        label="Description"
        placeholder="Enter Description"
        values={message}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
          setMessage(e.target.value);
        }}
        showCharacterLimit
        containerStyle={{ marginTop: 24 }}
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
        placeholder="0"
        value={sqft}
        onChange={(event) => {
          setSqft(event.target.value);
        }}
        containerStyle={{ marginTop: 24, width: 100 }}
      />

      <TextInput
        label="Price/Sqft"
        placeholder="$0"
        value={sqftPrice}
        onChange={(event) => {
          setSqftPrice(event.target.value);
        }}
        containerStyle={{ marginTop: 24, width: 100 }}
      />
      <LabelText text="Features & Amenities" />
      {!equipmentLoading && equipmentData && (
        <MultiSelectInput
          placeholder="Set Equipment Preference"
          options={equipmentData.equipments}
          onChange={setSelectedEquipment}
          containerStyle={{ marginTop: 8 }}
        />
      )}
      <LabelText text="Availability" />
      <RowView style={{ margin: 0 }}>
        <TextInput type="date" min={today} value={today} />
        <SpaceAlert visible text="You will be able to add more spaces later" />
      </RowView>
    </Container>
  );
}

const Container = styled(View)`
  padding: 24px 48px 24px 48px;
`;

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
`;
const Photo = styled.img`
  height: 300px;
  object-fit: cover;
  border: 0.5px solid white;
  border-radius: 5px;
`;

const RowView = styled(View)`
  flex-direction: row;
  align-items: center;
  width: 100%;
  margin: 24px 0 16px 0;
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
const Address = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  font-color: ${DARK_TEXT_COLOR};
`;

const SpaceAlert = styled(Alert)`
  margin: 0 0 0 38px;
`;
