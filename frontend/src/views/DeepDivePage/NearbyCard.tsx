import React, { useState, useContext, useMemo, useRef } from 'react';
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
import { EmptyDataComponent } from '../../components';
import { TenantTier } from '../../generated/globalTypes';
import BlurredNearby from '../../assets/images/blurred-nearby.png';

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

export type DropdownSelection = 'Most Popular' | 'Distance' | 'Rating' | 'Similar';

export default function NearbyCard(props: ViewProps) {
  let [selectedView, setSelectedView] = useState<ViewMode>('list');
  let [selectedDropdownVal, setSelectedDropdownVal] = useState<DropdownSelection>('Most Popular');
  let [selectedCard, setSelectedCard] = useState('');
  let [hasSelectedCard, setHasSelectedCard] = useState(false);
  let isGridViewMode = selectedView === 'grid';
  let data = useContext(DeepDiveContext);
  let mile = data?.result?.keyFacts.mile;
  let nearbyData = data?.result?.nearby;
  let category = data?.categories;
  let isLocked = !data?.trial || data?.tier === TenantTier.FREE;

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

  // TODO: fix typing
  const cardsRefs = useRef(
    filteredData?.reduce((acc: any, { name }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      acc[name] = useRef();
      return acc;
    }, {})
  );

  const scrollTo = (target: string) => {
    if (cardsRefs) {
      cardsRefs.current[target].current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  };

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
      isLocked={isLocked}
      {...props}
    >
      {isLocked ? (
        <Image src={BlurredNearby} />
      ) : (
        <RowedView flex>
          <NearbyMap
            hasSelected={hasSelectedCard}
            selected={selectedCard}
            data={filteredData || []}
            onClickMarker={(name) => {
              setSelectedCard(name);
              setHasSelectedCard(true);
              scrollTo(name);
            }}
          />
          <View flex>
            <NearbyMapLegend />
            <RightContent flex>
              <Dropdown<DropdownSelection>
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
                  filteredData?.map((item, index) => (
                    <MiniNearbyPlacesCard
                      key={index}
                      selectedDropdownValue={selectedDropdownVal}
                      {...item}
                    />
                  ))
                ) : (
                  filteredData?.map((item, index) => (
                    <NearbyPlacesCard
                      forwardedRef={cardsRefs.current[item.name]}
                      selectedCard={selectedCard}
                      onPress={(name) => {
                        setSelectedCard(name);
                        setHasSelectedCard(true);
                      }}
                      key={index}
                      {...item}
                    />
                  ))
                )}
              </NearbyPlacesCardContainer>
            </RightContent>
          </View>
        </RowedView>
      )}
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

const Image = styled.img`
  width: 100%;
  object-fit: cover;
`;
