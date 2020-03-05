import React, { useState, useContext, useMemo } from 'react';
import styled from 'styled-components';

import { View, Card, TouchableOpacity, Dropdown, Text } from '../../core-ui';
import NearbyPlacesCard from './NearbyPlacesCard';
import NearbyMap from './NearbyMap';
import NearbyMapLegend from './NearbyMapLegend';
import MiniNearbyPlacesCard from './MiniNearbyPlacesCard';
import { BACKGROUND_COLOR, GREY_ICON, THEME_COLOR } from '../../constants/colors';
import SvgGrid from '../../components/icons/grid';
import SvgList from '../../components/icons/list';
import { DeepDiveContext } from './DeepDiveModal';
import { EmptyDataComponent } from '../../components';

type ViewMode = 'grid' | 'list';

export type NearbyPlace = {
  photo: string;
  name: string;
  category: string;
  rating: number | null;
  numberRating: number;
  distance: number;
  placeType: Array<string>;
  lat: number;
  lng: number;
  similar: boolean;
};

export default function NearbyCard() {
  let [selectedView, setSelectedView] = useState<ViewMode>('list');
  let [selectedDropdownVal, setSelectedDropdownVal] = useState('Most Popular');
  let isGridViewMode = selectedView === 'grid';
  let data = useContext(DeepDiveContext);
  let mile = data?.result?.keyFacts.mile;
  let nearbyData = data?.result?.nearby;
  let category = data?.categories;

  let filteredData = useMemo(() => {
    switch (selectedDropdownVal) {
      case 'Similar': {
        return nearbyData?.filter((item) => item.similar).slice(0, 20);
      }
      case 'Distance': {
        return nearbyData?.sort((a, b) => a.distance - b.distance).slice(0, 30);
      }
      case 'Rating': {
        return nearbyData?.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 20);
      }
      case 'Most Popular': {
        return nearbyData?.sort((a, b) => b.numberRating - a.numberRating).slice(0, 20);
      }
    }
  }, [selectedDropdownVal, nearbyData]);

  let iconTab = (
    <RightTitleContainer>
      <IconContainer
        onPress={() => {
          setSelectedView('list');
        }}
      >
        <SvgList style={{ color: isGridViewMode ? GREY_ICON : THEME_COLOR }} />
      </IconContainer>
      <IconContainer
        onPress={() => {
          setSelectedView('grid');
        }}
      >
        <SvgGrid style={{ color: !isGridViewMode ? GREY_ICON : THEME_COLOR }} />
      </IconContainer>
    </RightTitleContainer>
  );

  return (
    <Container
      titleBackground="white"
      title="Nearby"
      rightTitleComponent={iconTab}
      titleContainerProps={{ style: { height: 56 } }}
    >
      <RowedView flex>
        <NearbyMap data={filteredData || []} />
        <View flex>
          <NearbyMapLegend />
          <RightContent flex>
            <Dropdown
              options={['Most Popular', 'Distance', 'Rating', 'Similar']}
              onSelect={(newValue) => {
                setSelectedDropdownVal(newValue);
              }}
              selectedOption={selectedDropdownVal}
              containerStyle={{ paddingLeft: 6, paddingBottom: 12 }}
            />

            <NearbyPlacesCardContainer flex>
              {filteredData?.length === 0 ? (
                <EmptyDataComponent
                  text={category && mile ? `No ${category} within ${mile} mile(s)` : ''}
                />
              ) : isGridViewMode ? (
                filteredData?.map((item, index) => <MiniNearbyPlacesCard key={index} {...item} />)
              ) : (
                filteredData?.map((item, index) => <NearbyPlacesCard key={index} {...item} />)
              )}
            </NearbyPlacesCardContainer>
          </RightContent>
        </View>
      </RowedView>
    </Container>
  );
}

const Container = styled(Card)`
  margin: 18px 36px;
  height: 630px;
`;

const RowedView = styled(View)`
  flex-direction: row;
`;

const RightContent = styled(View)`
  padding: 24px 20px;
  background-color: ${BACKGROUND_COLOR};
`;
const RightTitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 0 8px;
  align-self: flex-end;
`;

const IconContainer = styled(TouchableOpacity)`
  margin: 8px;
`;

const NearbyPlacesCardContainer = styled(View)`
  align-content: flex-start;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-y: scroll;
  padding-top: 12px;
`;
