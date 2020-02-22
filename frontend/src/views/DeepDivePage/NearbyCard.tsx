import React, { useState, useContext, useMemo } from 'react';
import styled from 'styled-components';

import { View, Card, TouchableOpacity, Dropdown } from '../../core-ui';
import NearbyPlacesCard from './NearbyPlacesCard';
import NearbyMap from './NearbyMap';
import NearbyMapLegend from './NearbyMapLegend';
import MiniNearbyPlacesCard from './MiniNearbyPlacesCard';
import { BACKGROUND_COLOR, GREY_ICON, THEME_COLOR } from '../../constants/colors';
import SvgGrid from '../../components/icons/grid';
import SvgList from '../../components/icons/list';
import { DeepDiveContext } from './DeepDiveModal';

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

//asr a-b
export default function NearbyCard() {
  let [selectedView, setSelectedView] = useState<ViewMode>('grid');
  let [selectedDropdownVal, setSelectedDropdownVal] = useState('Relevant');
  let isGridViewMode = selectedView === 'grid';
  let data = useContext(DeepDiveContext);
  let nearbyData = data?.result.nearby;
  let filteredData = useMemo(() => {
    switch (selectedDropdownVal) {
      case 'Relevant': {
        return nearbyData;
      }
      case 'Similar': {
        return nearbyData?.filter((item) => item.similar);
      }
      case 'Distance': {
        return nearbyData?.sort((a, b) => a.distance - b.distance);
      }
      case 'Rating': {
        return nearbyData?.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
      case 'Total Rating': {
        return nearbyData?.sort((a, b) => b.numberRating - a.numberRating);
      }
    }
  }, [selectedDropdownVal]);
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
              options={['Relevant', 'Similar', 'Distance', 'Rating', 'Total Rating']}
              onSelect={(newValue) => {
                setSelectedDropdownVal(newValue);
              }}
              selectedOption={selectedDropdownVal}
              containerStyle={{ paddingLeft: 6, paddingBottom: 12 }}
            />

            <NearbyPlacesCardContainer flex>
              {isGridViewMode
                ? filteredData &&
                  filteredData.map((item, index) => <NearbyPlacesCard key={index} {...item} />)
                : filteredData &&
                  filteredData.map((item, index) => <MiniNearbyPlacesCard key={index} {...item} />)}
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
