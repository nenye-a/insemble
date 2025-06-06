import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';

import { View, SegmentedControl, TouchableOpacity, Button } from '../../core-ui';
import PhotoGallery from './PhotoGallery';
import DescriptionCard from './DescriptionCard';
import SummaryCard from './SummaryCard';
import ContactModal from './ContactModal';
import { DeepDiveContext } from './DeepDiveModal';
import { TEXT_COLOR, THEME_COLOR, WHITE } from '../../constants/colors';
import { FONT_WEIGHT_MEDIUM } from '../../constants/theme';
import SvgHeart from '../../components/icons/heart';
import { SAVE_SPACE, GET_SAVED_SPACES } from '../../graphql/queries/server/space';
import { LocationDetails_locationDetails_spaceDetails as SpaceDetails } from '../../generated/LocationDetails';
import { SaveSpace, SaveSpaceVariables } from '../../generated/SaveSpace';

type Params = {
  brandId: string;
};

type Props = {
  propertyId?: string;
  selectedSpaceIndex: number;
  onSpaceChange: (spaceIndex: number) => void;
};

export default function PropertyDetailView(props: Props) {
  let { propertyId = '', selectedSpaceIndex, onSpaceChange } = props;
  let contextValue = useContext(DeepDiveContext);
  let [saveSpace, { data }] = useMutation<SaveSpace, SaveSpaceVariables>(SAVE_SPACE);
  let [contactModalVisible, toggleContactModalVisibility] = useState(false);
  let params = useParams<Params>();
  let [spaceDetails, setSpaceDetails] = useState<Array<SpaceDetails>>(
    contextValue?.spaceDetails || []
  );

  useEffect(() => {
    let newSpaceDetails = spaceDetails.map((space) => {
      if (space.spaceId === data?.saveProperty.spaceId) {
        return { ...space, liked: !space.liked };
      }
      return space;
    });
    setSpaceDetails(newSpaceDetails);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  let selectedData = spaceDetails[selectedSpaceIndex];

  if (spaceDetails) {
    let getSpaceTab = () => {
      if (spaceDetails) {
        return spaceDetails.map((_, index) => `Space ${index + 1}`);
      }
      return [];
    };
    return (
      <View>
        <HeaderContainer>
          <SpaceSegment
            options={getSpaceTab()}
            selectedIndex={selectedSpaceIndex}
            fullWidth={false}
            onPress={onSpaceChange}
            segmentStyle={{ width: 75 }}
            activeSegmentStyle={{ width: 75 }}
            textStyle={{ fontWeight: FONT_WEIGHT_MEDIUM, color: TEXT_COLOR }}
          />
          <RowedView>
            <TouchableOpacity
              onPress={() => {
                saveSpace({
                  variables: {
                    spaceId: selectedData.spaceId,
                    brandId: params.brandId,
                    propertyId,
                    matchValue: contextValue?.result?.matchValue || 0,
                  },
                  refetchQueries: [{ query: GET_SAVED_SPACES }],
                  awaitRefetchQueries: true,
                });
              }}
              style={{ marginRight: 14 }}
            >
              <SvgHeart fill={selectedData.liked ? THEME_COLOR : WHITE} />
            </TouchableOpacity>
            <Button text="Connect" onPress={() => toggleContactModalVisibility(true)} />
          </RowedView>
        </HeaderContainer>
        {selectedData && (
          <SpaceDetail flex>
            <PhotoGallery images={[selectedData.mainPhoto, ...selectedData.photos]} />
            <CardsContainer flex>
              <SummaryCard
                priceSqft={selectedData.summary.pricePerSqft.toString() || ''}
                sqft={selectedData.sqft.toString() || ''}
                type={selectedData.summary.type.join(', ')}
                tenacy=""
                condition={selectedData.summary.condition}
              />
              <Spacing />
              <DescriptionCard content={selectedData.description || ''} />
            </CardsContainer>
          </SpaceDetail>
        )}
        <ContactModal
          matchScore={contextValue?.result?.matchValue}
          brandId={params.brandId}
          spaceId={selectedData?.spaceId || ''}
          visible={contactModalVisible}
          onClose={() => toggleContactModalVisibility(false)}
        />
      </View>
    );
  }
  return <View />;
}

const CardsContainer = styled(View)`
  padding: 16px;
`;

const Spacing = styled(View)`
  height: 12px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const HeaderContainer = styled(RowedView)`
  padding: 10px 16px;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
`;

const SpaceSegment = styled(SegmentedControl)`
  height: 36px;
  border: none;
  width: fit-content;
`;

const SpaceDetail = styled(View)`
  flex-direction: row;
  align-items: flex-start;
`;
