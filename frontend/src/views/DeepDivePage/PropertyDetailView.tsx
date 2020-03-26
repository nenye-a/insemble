import React, { useContext, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';

import { View, SegmentedControl, TouchableOpacity, Button } from '../../core-ui';
import PhotoGallery from './PhotoGallery';
import DescriptionCard from './DescriptionCard';
import SummaryCard from './SummaryCard';
import { TEXT_COLOR, THEME_COLOR } from '../../constants/colors';
import { DeepDiveContext } from './DeepDiveModal';
import { LocationDetails_locationDetails_spaceDetails as SpaceDetails } from '../../generated/LocationDetails';
import { FONT_WEIGHT_MEDIUM } from '../../constants/theme';
import SvgHeart from '../../components/icons/heart';
import ContactModal from './ContactModal';

type Params = {
  brandId: string;
};
export default function PropertyDetailView() {
  let contextValue = useContext(DeepDiveContext);
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [contactModalVisible, toggleContactModalVisibility] = useState(false);
  let params = useParams<Params>();
  let selectedData: SpaceDetails | null = useMemo(() => {
    if (contextValue?.spaceDetails) {
      return contextValue?.spaceDetails[selectedTabIndex];
    }
    return null;
  }, [selectedTabIndex, contextValue]);

  if (contextValue?.spaceDetails) {
    let getSpaceTab = () => {
      if (contextValue?.spaceDetails) {
        return contextValue.spaceDetails.map((_, index) => `Space ${index + 1}`);
      }
      return [];
    };
    return (
      <View>
        <HeaderContainer>
          <SpaceSegment
            options={getSpaceTab()}
            selectedIndex={selectedTabIndex}
            fullWidth={false}
            onPress={setSelectedTabIndex}
            segmentStyle={{ width: 75 }}
            activeSegmentStyle={{ width: 75 }}
            textStyle={{ fontWeight: FONT_WEIGHT_MEDIUM, color: TEXT_COLOR }}
          />
          <RowedView>
            <TouchableOpacity onPress={() => {}} style={{ marginRight: 14 }}>
              <SvgHeart fill={THEME_COLOR} />
            </TouchableOpacity>
            <Button text="Connect" onPress={() => toggleContactModalVisibility(true)} />
          </RowedView>
        </HeaderContainer>
        {selectedData && (
          <RowedView flex>
            <PhotoGallery images={[...selectedData.mainPhoto, ...selectedData.photos]} />
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
          </RowedView>
        )}
        <ContactModal
          matchScore={contextValue.result?.matchValue}
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
  padding: 10px 8px;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
`;

const SpaceSegment = styled(SegmentedControl)`
  height: 36px;
  border: none;
  width: fit-content;
`;
