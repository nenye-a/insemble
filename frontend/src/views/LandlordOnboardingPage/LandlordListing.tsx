import React, {
  useState,
  ChangeEvent,
  Dispatch,
  useEffect,
  useCallback,
  ComponentProps,
} from 'react';
import styled, { css } from 'styled-components';
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
import { THEME_COLOR, DARK_TEXT_COLOR, RED_TEXT } from '../../constants/colors';
import { FONT_SIZE_MEDIUM, FONT_WEIGHT_BOLD, FONT_SIZE_SMALL } from '../../constants/theme';
import { Action, State as LandlordOnboardingState } from '../../reducers/landlordOnboardingReducer';
import { GET_EQUIPMENT_LIST } from '../../graphql/queries/server/filters';
import { Equipments } from '../../generated/Equipments';
import { validateNumber, useViewport } from '../../utils';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { SPACES_TYPE } from '../../constants/spaces';
import {
  MARKETING_PREFERENCE_OPTIONS,
  MarketingPreferenceRadio,
} from '../../constants/marketingPreference';

type Props = {
  state: LandlordOnboardingState;
  dispatch: Dispatch<Action>;
};

export default function LandlordListing(props: Props) {
  let history = useHistory();
  let { state, dispatch } = props;
  let { confirmLocation, spaceListing } = state;
  let { isDesktop } = useViewport();
  let { register, errors, handleSubmit, watch } = useForm();
  let sqft = spaceListing.sqft || watch('sqft');
  let price = spaceListing.pricePerSqft || watch('price');
  let date = spaceListing.availability || watch('date');
  let { data: equipmentData, loading: equipmentLoading } = useQuery<Equipments>(GET_EQUIPMENT_LIST);
  let [mainPhoto, setMainPhoto] = useState<string | FileWithPreview | null>(spaceListing.mainPhoto);
  let [additionalPhotos, setAdditionalPhotos] = useState<Array<string | FileWithPreview | null>>(
    spaceListing.propertyPhotos
  );
  let [selectedType, setSelectedType] = useState<Array<string>>(spaceListing.spaceType || []);
  let [selectedMarketingPreference, setSelectedMarketingPreference] = useState<
    MarketingPreferenceRadio
  >(state.spaceListing.marketingPreference);
  let [description, setDescription] = useState<string>(spaceListing.description);
  let [selectedCondition, setSelectedCondition] = useState(spaceListing.condition || 'Whitebox');
  let [selectedEquipments, setSelectedEquipment] = useState<Array<string>>(spaceListing.equipments);
  let today = new Date().toISOString().slice(0, 10);

  let allValid =
    mainPhoto &&
    additionalPhotos.filter((photo) => !!photo).length > 0 &&
    selectedCondition &&
    description &&
    selectedType.length > 0 &&
    sqft &&
    price &&
    date &&
    Object.keys(errors).length === 0;

  let saveFormState = useCallback(
    (fieldValues?: FieldValues) => {
      if (allValid && mainPhoto) {
        dispatch({
          type: 'SAVE_CHANGES_NEW_LISTING',
          values: {
            spaceListing: {
              mainPhoto,
              propertyPhotos: additionalPhotos,
              description,
              condition: selectedCondition,
              sqft: fieldValues ? fieldValues.sqft : sqft,
              pricePerSqft: fieldValues ? fieldValues.price : price,
              equipments: selectedEquipments,
              availability: fieldValues ? fieldValues.date : date,
              marketingPreference: selectedMarketingPreference,
              spaceType: selectedType,
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

  let onSubmit = (fieldValues: FieldValues) => {
    if (allValid) {
      saveFormState(fieldValues);
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
    selectedMarketingPreference,
    selectedType,
  ]);

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Container>
        <TitleContainer>
          {/* Check number of space when connecting to BE */}
          <Title>Space 1</Title>
          <Address>{confirmLocation?.physicalAddress?.address || ''}</Address>
        </TitleContainer>
        <ListingAlert
          visible
          text="We provide complementary virtual tours & comprehensive photos to every listing."
        />
        <RadioGroup<MarketingPreferenceRadio>
          label="Marketing Preference"
          options={MARKETING_PREFERENCE_OPTIONS}
          selectedOption={selectedMarketingPreference}
          onSelect={(item) => {
            setSelectedMarketingPreference(item);
          }}
          radioItemProps={{ lineHeight: 2 }}
          titleExtractor={(item: MarketingPreferenceRadio) => item.label}
          required={true}
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
          required={true}
        />
        <RadioGroupContainer
          label="Condition"
          options={['Whitebox', 'Second Generation Restaurant']}
          selectedOption={selectedCondition}
          onSelect={(value: string) => {
            setSelectedCondition(value);
          }}
          radioItemProps={{ lineHeight: 2 }}
          required={true}
        />
        <FieldInput>
          <RowView>
            <LabelText text="What type of space is this?" />
            <LabelText text="*required" color={RED_TEXT} style={{ marginLeft: 8 }} />
          </RowView>
          {SPACES_TYPE.map((option, index) => {
            let isChecked = selectedType.includes(option);
            return (
              <Checkbox
                key={index}
                title={option}
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
          required={true}
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
          required={true}
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
            required={true}
            ref={register({
              required: 'Date should not be empty',
            })}
            errorMessage={(errors?.date as FieldError)?.message || ''}
          />
          <SpaceAlert
            isDesktop={isDesktop}
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
        />
        <Button text="Next" disabled={!allValid} type="submit" />
      </OnboardingFooter>
    </Form>
  );
}

type AlertProps = ComponentProps<typeof Alert> & {
  isDesktop: boolean;
};

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

const SpaceAlert = styled(Alert)<AlertProps>`
  ${({ isDesktop }) =>
    isDesktop
      ? css`
          margin: 0 0 0 38px;
          align-self: flex-end;
        `
      : css`
          margin: 24px 0 12px 0;
        `}
`;

const ShortTextInput = styled(TextInput)`
  width: 100px;
`;

const TitleContainer = styled(RowView)`
  padding: 12px 0;
`;

const DatePickerContainer = styled(RowView)`
  padding: 12px 0;
  flex-flow: wrap;
`;

const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;

const FieldInput = styled(View)`
  padding: 12px 0;
`;

const ListingAlert = styled(Alert)`
  margin-bottom: 8px;
`;
