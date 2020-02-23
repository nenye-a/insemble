import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import { View, Modal, TabBar, LoadingIndicator } from '../../core-ui';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import PropertyDetailView from './PropertyDetailView';
import Overview from './Overview';
import { GET_LOCATION_DETAILS } from '../../graphql/queries/server/deepdive';
import {
  LocationDetails,
  LocationDetailsVariables,
  LocationDetails_locationDetails_result as LocationDetailsLocationDetailsResult,
  LocationDetails_locationDetails_propertyDetails as DELETED_BASE64_STRING,
} from '../../generated/LocationDetails';
import { THEME_COLOR } from '../../constants/colors';

type SelectedLocation = { lat: string; lng: string; address: string; targetNeighborhood: string };

type DeepDiveContextType =
  | {
      result?: LocationDetailsLocationDetailsResult;
      propertyDetails?: DELETED_BASE64_STRING | null;
      selectedLocation?: SelectedLocation;
    }
  | undefined;

export const DeepDiveContext = React.createContext<DeepDiveContextType>(undefined);
type Props = {
  visible: boolean;
  onClose: () => void;
  lat: string;
  lng: string;
  address: string;
  targetNeighborhood: string;
};

// const SHRINK_HEIGHT = 160;
export default function LocationDeepDiveModal(props: Props) {
  let { brandId = '' } = useParams();
  let { visible, onClose, lat, lng, address, targetNeighborhood } = props;
  let [isLiked, toggleIsLiked] = useState(false); // get value from backend
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  // let [headerShrink, setHeaderShrink] = useState(false);
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

  // let handleOnScroll = (e: UIEvent<HTMLDivElement>) => {
  //   if (visible) {
  //     let target = e.target as HTMLDivElement;
  //     if (target.scrollTop !== 0 && target.scrollHeight + SHRINK_HEIGHT > window.innerHeight) {
  //       setHeaderShrink(true);
  //     } else if (target.scrollTop === 0) {
  //       setHeaderShrink(false);
  //     }
  //   }
  // };

  let noPropertyDetail = !data?.locationDetails.propertyDetails;

  return (
    <DeepDiveContext.Provider
      value={{
        ...data?.locationDetails,
        selectedLocation: {
          lat,
          lng,
          address,
          targetNeighborhood,
        },
      }}
    >
      <Modal onClose={onClose} visible={visible} svgCloseProps={{ fill: THEME_COLOR }}>
        {loading ? (
          <LoadingIndicator
            size="large"
            flex
            style={{ justifyContent: 'center', alignItems: 'center' }}
          />
        ) : (
          <>
            {/* <TourContainer isShrink={headerShrink}>
              <Text>3D Tour</Text>
            </TourContainer> */}
            {noPropertyDetail ? (
              <ScrollView
                flex
                //  onScroll={handleOnScroll}
              >
                <PropertyDeepDiveHeader
                  isLiked={isLiked}
                  onLikePress={toggleIsLiked}
                  address={address}
                  targetNeighborhood={targetNeighborhood}
                />
                <Overview />
              </ScrollView>
            ) : (
              <>
                <TabBar
                  options={['Overview', 'Property Details']}
                  activeTab={selectedTabIndex}
                  onPress={(index: number) => {
                    setSelectedTabIndex(index);
                  }}
                />
                <ScrollView
                  flex
                  // onScroll={handleOnScroll}
                >
                  <PropertyDeepDiveHeader
                    isLiked={isLiked}
                    onLikePress={toggleIsLiked}
                    address={address}
                    targetNeighborhood={targetNeighborhood}
                  />

                  {isOverviewSelected ? <Overview /> : <PropertyDetailView />}
                </ScrollView>
              </>
            )}
          </>
        )}
      </Modal>
    </DeepDiveContext.Provider>
  );
}

type TourContainerProps = {
  isShrink: boolean;
};

// const TourContainer = styled(View)<TourContainerProps>`
//   height: ${(props) => (props.isShrink ? '180px' : '320px')};
//   transition: 0.3s height linear;
//   justify-content: center;
//   align-items: center;
//   background-color: grey;
// `;

const ScrollView = styled(View)`
  overflow-y: scroll;
`;
