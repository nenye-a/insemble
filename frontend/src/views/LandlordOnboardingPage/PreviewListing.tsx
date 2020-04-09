import React, { Dispatch } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { View, Text, Alert, Form, Button } from '../../core-ui';
import PhotoGallery from '../DeepDivePage/PhotoGallery';
import DescriptionCard from '../DeepDivePage/DescriptionCard';
import SummaryCard from '../DeepDivePage/SummaryCard';
import PropertyDeepDiveHeader from '../DeepDivePage/PropertyDeepDiveHeader';
import OnboardingFooter from '../../components/layout/OnboardingFooter';
import { THEME_COLOR, WHITE } from '../../constants/colors';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import { State, Action } from '../../reducers/landlordOnboardingReducer';
import { CREATE_PROPERTY, GET_PROPERTIES } from '../../graphql/queries/server/properties';
import { CreateProperty, CreatePropertyVariables } from '../../generated/CreateProperty';
import { getImageBlob, useViewport } from '../../utils';
import { MarketingPreference } from '../../generated/globalTypes';

type Props = {
  dispatch: Dispatch<Action>;
  state: State;
};
export default function PreviewListing(props: Props) {
  let { state: landlordOnboardingState } = props;
  let { confirmLocation, confirmTenant, spaceListing } = landlordOnboardingState;
  let propertyPhotos =
    spaceListing?.propertyPhotos.map((item) =>
      item && typeof item !== 'string' ? item?.preview : null
    ) || [];
  let history = useHistory();
  let [
    createProperty,
    { loading: createPropertyLoading, data: createPropertyData, error: createPropertyError },
  ] = useMutation<CreateProperty, CreatePropertyVariables>(CREATE_PROPERTY);
  let { isDesktop } = useViewport();

  let onSubmit = () => {
    let { userRelations, physicalAddress } = confirmLocation;
    let { businessType, otherBusinessType, existingExclusives } = confirmTenant;

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
    if (mainPhoto && typeof mainPhoto !== 'string') {
      let mainPhotoBlob = getImageBlob(mainPhoto.file);
      let additionalPhotosBlob = [];
      for (let photo of propertyPhotos) {
        if (!!photo && typeof photo !== 'string') {
          let photoBlob = getImageBlob(photo.file);
          additionalPhotosBlob.push(photoBlob);
        }
      }

      let filteredBusinessType = businessType.filter((item) => item !== 'Other');
      let availableDate = new Date(availability).toISOString();

      createProperty({
        variables: {
          property: {
            businessType: otherBusinessType
              ? [...filteredBusinessType, otherBusinessType]
              : filteredBusinessType,
            exclusive: existingExclusives,
            location: {
              lat: physicalAddress?.lat || '',
              lng: physicalAddress?.lng || '',
              address: physicalAddress?.address || '',
            },
            name: physicalAddress?.name || '',
            userRelations,
          },
          space: {
            available: availableDate,
            condition,
            description,
            equipment: equipments,
            mainPhoto: mainPhotoBlob,
            photoUploads: additionalPhotosBlob.filter((item) => item != null),
            pricePerSqft: Number(pricePerSqft),
            sqft: Number(sqft),
            marketingPreference: MarketingPreference.PUBLIC, // TODO: get marketing preference
          },
        },
        refetchQueries: [{ query: GET_PROPERTIES }],
      });
    }
  };

  if (createPropertyData?.createProperty) {
    history.push('/landlord/properties');
  }
  let photoGallery = (
    <PhotoGallery
      images={[
        (typeof spaceListing.mainPhoto !== 'string' && spaceListing?.mainPhoto?.preview) || '',
        ...propertyPhotos,
      ]}
    />
  );

  let cards = (
    <CardsContainer flex isDesktop={isDesktop}>
      <SummaryCard
        priceSqft={`$${spaceListing.pricePerSqft.toString()}`}
        sqft={spaceListing.sqft}
        tenacy="Multiple"
        type={confirmLocation.propertyType?.join(', ') || ''}
        condition={spaceListing.condition}
      />
      <Spacing />
      <DescriptionCard content={spaceListing?.description || ''} />
    </CardsContainer>
  );

  let content = isDesktop ? [photoGallery, cards] : [cards, photoGallery];
  return (
    <Form onSubmit={onSubmit}>
      <Alert visible={!!createPropertyError} text={createPropertyError?.message || ''} />
      <RowView>
        <Title>Space 1</Title>
        {isDesktop && <Alert visible text="This is how the Retailer will see your listing." />}
      </RowView>
      <TourContainer isShrink={false}>
        <PendingAlert visible text="Pending virtual tour" />
        <Text>3D Tour</Text>
      </TourContainer>
      <PropertyDeepDiveHeader
        address={confirmLocation?.physicalAddress?.address || ''}
        // TODO: ask where to get this info
        clickable={false}
        targetNeighborhood=""
      />
      <Content flex isDesktop={isDesktop}>
        {content}
      </Content>
      <OnboardingFooter>
        <TransparentButton mode="transparent" text="Back" onPress={() => history.goBack()} />
        <Button type="submit" text="Next" loading={createPropertyLoading} />
      </OnboardingFooter>
    </Form>
  );
}

type ViewPropsWithViewport = ViewProps & {
  isDesktop: boolean;
};

type TourContainerProps = {
  isShrink: boolean;
};

const CardsContainer = styled(View)<ViewPropsWithViewport>`
  padding: ${(props) => (props.isDesktop ? '0 16px 16px 16px' : '16px')};
`;
const Spacing = styled(View)`
  height: 12px;
`;
const Content = styled(View)<ViewPropsWithViewport>`
  flex-direction: ${({ isDesktop }) => (isDesktop ? 'row' : 'column')};
  background-color: ${WHITE};
`;
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
