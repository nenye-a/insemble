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
import { CREATE_SPACE } from '../../graphql/queries/server/space';
import { getImageBlob } from '../../utils';
import { CreateSpace, CreateSpaceVariables } from '../../generated/CreateSpace';
import { Action, State as LandlordAddSpaceState } from '../../reducers/landlordAddSpaceReducer';
import { GET_PROPERTIES, GET_PROPERTY } from '../../graphql/queries/server/properties';
import { MarketingPreference } from '../../generated/globalTypes';

type Props = {
  dispatch: Dispatch<Action>;
  state: LandlordAddSpaceState;
};

export default function PreviewSpace(props: Props) {
  let history = useHistory();
  let { state } = props;
  let { addSpace } = state;
  let propertyPhotos =
    addSpace?.propertyPhotos.map((item) =>
      item && typeof item !== 'string' ? item?.preview : null
    ) || [];
  let { propertyId, address } = history.location.state;
  let [
    createSpace,
    { loading: createSpaceLoading, data: createSpaceData, error: createSpaceError },
  ] = useMutation<CreateSpace, CreateSpaceVariables>(CREATE_SPACE);
  let onSubmit = () => {
    let {
      mainPhoto,
      propertyPhotos,
      description,
      condition,
      sqft,
      pricePerSqft,
      equipments,
      availability,
      marketingPreference,
      propertyType,
    } = addSpace;
    if (mainPhoto && typeof mainPhoto !== 'string') {
      let mainPhotoBlob = getImageBlob(mainPhoto.file);
      let additionalPhotosBlob = [];
      for (let photo of propertyPhotos) {
        if (!!photo && typeof photo !== 'string') {
          let photoBlob = getImageBlob(photo.file);
          additionalPhotosBlob.push(photoBlob);
        }
      }

      let availableDate = new Date(availability).toISOString();
      if (propertyId) {
        createSpace({
          variables: {
            propertyId: propertyId,
            space: {
              available: availableDate,
              condition,
              description,
              equipment: equipments,
              mainPhoto: mainPhotoBlob,
              photoUploads: additionalPhotosBlob.filter((item) => item != null),
              pricePerSqft: Number(pricePerSqft),
              sqft: Number(sqft),
              // marketingPreference: MarketingPreference.PUBLIC, // TODO: get marketing preference
              spaceType: propertyType,
              marketingPreference,
            },
          },
          refetchQueries: [
            { query: GET_PROPERTIES },
            { query: GET_PROPERTY, variables: { propertyId } },
          ],
          awaitRefetchQueries: true,
        });
      }
    }
  };

  if (createSpaceData?.createSpace) {
    history.push('/landlord/properties');
  }
  return (
    <Form onSubmit={onSubmit}>
      <Alert visible={!!createSpaceError} text={createSpaceError?.message || ''} />
      <RowView>
        <Title>Space 1</Title>
        <Alert visible text="This is how the Retailer will see your listing." />
      </RowView>
      <TourContainer isShrink={false}>
        <PendingAlert visible text="Pending virtual tour" />
        <Text>{address}</Text>
      </TourContainer>
      <PropertyDeepDiveHeader
        address={address || ''}
        // TODO: ask where to get this info
        clickable={false}
        targetNeighborhood=""
      />
      <RowedView flex>
        <PhotoGallery
          images={[
            (typeof addSpace.mainPhoto !== 'string' && addSpace?.mainPhoto?.preview) || '',
            ...propertyPhotos,
          ]}
        />
        <CardsContainer flex>
          <SummaryCard
            priceSqft={`$${addSpace.pricePerSqft.toString()}`}
            sqft={addSpace.sqft}
            tenacy="Multiple"
            type={addSpace.propertyType?.join(', ') || ''}
            condition={addSpace.condition}
          />
          <Spacing />
          <DescriptionCard content={addSpace.description || ''} />
        </CardsContainer>
      </RowedView>
      <OnboardingFooter>
        <TransparentButton mode="transparent" text="Back" onPress={() => history.goBack()} />
        <Button type="submit" text="Next" loading={createSpaceLoading} />
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
