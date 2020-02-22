import React, { useState, UIEvent } from 'react';
import styled from 'styled-components';

import { View, Text, Modal, TabBar, LoadingIndicator } from '../../core-ui';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import PropertyDetailView from './PropertyDetailView';
import Overview from './Overview';
import { useQuery } from '@apollo/react-hooks';
import { GET_LOCATION_DETAILS } from '../../graphql/queries/server/deepdive';
import {
  LocationDetails,
  LocationDetailsVariables,
  LocationDetails_locationDetails as LocationDetailsLocationDetails,
} from '../../generated/locationDetails';
import { useParams } from 'react-router-dom';

export const DeepDiveContext = React.createContext<LocationDetailsLocationDetails | undefined>(
  undefined
);
type Props = {
  visible: boolean;
  onClose: () => void;
  lat: string;
  lng: string;
  address: string;
};

const SHRINK_HEIGHT = 160;
export default function LocationDeepDiveModal(props: Props) {
  let { brandId = '' } = useParams();
  let { visible, onClose, lat, lng, address } = props;
  let [isLiked, toggleIsLiked] = useState(false); // get value from backend
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [headerShrink, setHeaderShrink] = useState(false);
  let isOverviewSelected = selectedTabIndex === 0;
  let { data, loading } = useQuery<LocationDetails, LocationDetailsVariables>(
    GET_LOCATION_DETAILS,
    {
      variables: {
        brandId,
        selectedLocation: {
          address,
          lat,
          lng,
        },
      },
    }
  );

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
  return (
    <DeepDiveContext.Provider value={data?.locationDetails}>
      <Modal onClose={onClose} visible={visible}>
        {loading ? (
          <LoadingIndicator
            size="large"
            flex
            style={{ justifyContent: 'center', alignItems: 'center' }}
          />
        ) : (
          <>
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
              {isOverviewSelected ? <Overview /> : <PropertyDetailView />}
            </ScrollView>
          </>
        )}
      </Modal>
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
