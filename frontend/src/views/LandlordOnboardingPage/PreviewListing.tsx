import React, { Dispatch } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Alert, Form, Button } from '../../core-ui';
import PhotoGallery from '../DeepDivePage/PhotoGallery';
import DescriptionCard from '../DeepDivePage/DescriptionCard';
import SummaryCard from '../DeepDivePage/SummaryCard';
import PropertyDeepDiveHeader from '../DeepDivePage/PropertyDeepDiveHeader';
import { THEME_COLOR, WHITE } from '../../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { State, Action } from '../../reducers/landlordOnboardingReducer';
import { useMutation } from '@apollo/react-hooks';
import { CREATE_PROPERTY } from '../../graphql/queries/server/property';
import { CreateProperty, CreatePropertyVariables } from '../../generated/CreateProperty';
import { getImageBlob } from '../../utils';

type Props = {
  dispatch: Dispatch<Action>;
  state: State;
};
export default function PreviewListing(props: Props) {
  let { state: landlordOnboardingState } = props;
  let { confirmLocation, confirmTenant, spaceListing } = landlordOnboardingState;
  let propertyPhotos = spaceListing?.propertyPhotos.map((item) => item?.preview || '') || [];
  let history = useHistory();
  let [
    createProperty,
    { loading: createPropertyLoading, data: createPropertyData, error: createPropertyError },
  ] = useMutation<CreateProperty, CreatePropertyVariables>(CREATE_PROPERTY);
  let onSubmit = () => {
    let { userRelation, propertyType, physicalAddress, marketingPreference } = confirmLocation;
    let {
      businessType,
      // otherBussinessType,  ask be
      selectedRetailCategories,
      existingExclusives,
    } = confirmTenant;

    let {
      mainPhoto,
      propertyPhotos,
      description,
      condition,
      sqft,
      pricePerSqft,
      equipments,
      availability,
    } = spaceListing;
    if (mainPhoto) {
      let mainPhotoBlob = getImageBlob(mainPhoto.file);
      let additionalPhotosBlob = [];
      for (let photo of propertyPhotos) {
        if (!!photo) {
          let photoBlob = getImageBlob(photo.file);
          additionalPhotosBlob.push(photoBlob);
        }
      }

      createProperty({
        variables: {
          property: {
            businessType,
            categories: selectedRetailCategories,
            exclusive: existingExclusives,
            location: {
              lat: physicalAddress?.lat || '',
              lng: physicalAddress?.lng || '',
              address: physicalAddress?.address || '',
            },
            marketingPreference,
            name: physicalAddress?.name || '',
            propertyType,
            userRelation,
          },
          space: {
            available: availability, // convert date
            condition,
            description,
            equipment: equipments,
            mainPhoto: mainPhotoBlob,
            photoUploads: additionalPhotosBlob,
            pricePerSqft: Number(pricePerSqft),
            sqft: Number(sqft),
          },
        },
      });
    }
  };

  if (createPropertyData?.createProperty) {
    history.push('/landlord/properties');
  }
  return (
    <Form onSubmit={onSubmit}>
      <Alert visible={!!createPropertyError} text={createPropertyError?.message || ''} />
      <RowView>
        <Title>Space 1</Title>
        <Alert visible text="This is how the Retailer will see your listing." />
      </RowView>
      <TourContainer isShrink={false}>
        <PendingAlert visible text="Pending virtual tour" />
        <Text>3D Tour</Text>
      </TourContainer>
      <PropertyDeepDiveHeader
        address={confirmLocation?.physicalAddress?.address || ''}
        // TODO: ask where to get this info
        targetNeighborhood=""
      />
      <RowedView flex>
        <PhotoGallery images={[spaceListing?.mainPhoto?.preview || '', ...propertyPhotos]} />
        <CardsContainer flex>
          <SummaryCard
            priceSqft={`$${spaceListing?.pricePerSqft.toString()}` || ''}
            sqft={spaceListing?.sqft || ''}
            tenacy={'Multiple'}
            type={confirmLocation?.propertyType?.join(', ') || ''}
            condition={spaceListing?.condition || ''}
          />
          <Spacing />
          <DescriptionCard content={spaceListing?.description || ''} />
        </CardsContainer>
      </RowedView>
      <OnboardingFooter>
        <TransparentButton mode="transparent" text="Back" onPress={() => history.goBack()} />
        <Button type="submit" text="Next" loading={createPropertyLoading} />
      </OnboardingFooter>
    </Form>
  );
}

const CardsContainer = styled(View)`
  padding: 0 16px;
`;
const Spacing = styled(View)`
  height: 12px;
`;
const RowedView = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  background-color: ${WHITE};
`;

type TourContainerProps = {
  isShrink: boolean;
};

const TourContainer = styled(View)<TourContainerProps>`
  height: ${(props) => (props.isShrink ? '180px' : '320px')};
  transition: 0.3s height linear;
  justify-content: center;
  align-items: center;
  background-color: grey;
`;
const RowView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 24px 0;
  padding: 0 24px 0 50px;
`;
const Title = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  color: ${THEME_COLOR};
  margin: 0 14px 0 0;
`;
const PendingAlert = styled(Alert)`
  position: absolute;
  top: 12px;
  left: 12px;
`;
const TransparentButton = styled(Button)`
  margin-right: 8px;
  padding: 0 12px;
`;
