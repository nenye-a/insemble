import React, { useState, UIEvent } from 'react';
import styled from 'styled-components';

import { View, Text, Modal, TabBar } from '../../core-ui';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import Overview from './PropertyDetailView';
import PropertyDetailsView from './Overview';
import { useQuery } from '@apollo/react-hooks';
import { GET_LOCATION_DETAILS } from '../../graphql/queries/server/deepdive';
import {
  locationDetails_locationDetails,
  locationDetailsVariables,
} from '../../generated/locationDetails';
import { useParams } from 'react-router-dom';

export const DeepDiveContext = React.createContext<locationDetails_locationDetails | undefined>(
  undefined
);
type Props = {
  visible: boolean;
  onClose: () => void;
  lat: string | undefined;
  lng: string | undefined;
};

const SHRINK_HEIGHT = 160;
export default function LocationDeepDiveModal(props: Props) {
  let { brandId = '' } = useParams();
  let { visible, onClose, lat, lng } = props;
  let [isLiked, toggleIsLiked] = useState(false); // get value from backend
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [headerShrink, setHeaderShrink] = useState(false);
  let isOverviewSelected = selectedTabIndex === 0;
  let { data, loading, error } = useQuery<locationDetails_locationDetails>(GET_LOCATION_DETAILS, {
    variables: {
      brandId: 'ck6voxz1v00026to8qfk10h4g',
      selectedLocation: {
        address: '5011 S Western Ave, Los Angeles',
        lat: '33.849193',
        lng: '-118.364243',
      },
    },
  });

  let handleOnScroll = (e: UIEvent<HTMLDivElement>) => {
    if (visible) {
      let target = e.target as HTMLDivElement;
      if (target.scrollTop !== 0 && target.scrollHeight + SHRINK_HEIGHT > window.innerHeight) {
        setHeaderShrink(true);
      } else if (target.scrollTop === 0) {
        setHeaderShrink(false);
      }
    }
  };
  console.log('this>>', data);
  console.log('err>>', error);
  console.log('Loading>>', loading);

  return (
    <DeepDiveContext.Provider value={data}>
      {!loading && (
        <Modal onClose={onClose} visible={visible}>
          <TourContainer isShrink={headerShrink}>
            <Text>3D Tour</Text>
          </TourContainer>
          <TabBar
            options={['Overview', 'Property Details']}
            activeTab={selectedTabIndex}
            onPress={(index: number) => {
              setSelectedTabIndex(index);
            }}
          />

          <ScrollView flex onScroll={handleOnScroll}>
            <PropertyDeepDiveHeader isLiked={isLiked} onLikePress={toggleIsLiked} />
            {isOverviewSelected ? <Overview /> : <PropertyDetailsView />}
          </ScrollView>
        </Modal>
      )}
    </DeepDiveContext.Provider>
  );
}

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

const ScrollView = styled(View)`
  overflow-y: scroll;
`;
