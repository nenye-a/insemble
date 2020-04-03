import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import { View, Modal, TabBar, LoadingIndicator, Text, Button } from '../../core-ui';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import PropertyDetailView from './PropertyDetailView';
import Overview from './Overview';
import { GET_LOCATION_DETAILS } from '../../graphql/queries/server/deepdive';
import {
  LocationDetails,
  LocationDetailsVariables,
  LocationDetails_locationDetails_result as LocationDetailsLocationDetailsResult,
  LocationDetails_locationDetails_spaceDetails as LocationDetailsLocationDetailsSpaceDetails,
} from '../../generated/LocationDetails';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_SIZE_LARGE } from '../../constants/theme';
import { useViewport } from '../../utils';

type SelectedLocation = { lat: string; lng: string; address: string; targetNeighborhood: string };

type DeepDiveContextType =
  | {
      result?: LocationDetailsLocationDetailsResult;
      spaceDetails?: Array<LocationDetailsLocationDetailsSpaceDetails>;
      selectedLocation?: SelectedLocation;
      categories?: Array<string>;
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
  categories?: Array<string>;
  propertyId?: string;
};

// const SHRINK_HEIGHT = 160;
export default function LocationDeepDiveModal(props: Props) {
  let { brandId = '' } = useParams();
  let { isDesktop } = useViewport();
  let { visible, onClose, lat, lng, address, targetNeighborhood, categories, propertyId } = props;
  let [selectedTabIndex, setSelectedTabIndex] = useState(1);
  // let [headerShrink, setHeaderShrink] = useState(false);
  let isOverviewSelected = selectedTabIndex === 0;
  let { data, loading, error, refetch } = useQuery<LocationDetails, LocationDetailsVariables>(
    GET_LOCATION_DETAILS,
    {
      variables: {
        brandId,
        selectedLocation: {
          address,
          lat,
          lng,
        },
        selectedPropertyId: propertyId ? propertyId : null,
      },
      notifyOnNetworkStatusChange: true,
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

  let noPropertyDetail =
    !data?.locationDetails.spaceDetails || data?.locationDetails.spaceDetails.length === 0;

  return (
    <DeepDiveContext.Provider
      value={{
        ...data?.locationDetails,
        spaceDetails: data?.locationDetails.spaceDetails,
        selectedLocation: {
          lat,
          lng,
          address,
          targetNeighborhood,
        },
        categories,
      }}
    >
      <Modal onClose={onClose} visible={visible} svgCloseProps={{ fill: THEME_COLOR }}>
        {loading ? (
          <LoadingIndicator
            size="large"
            flex
            style={{ justifyContent: 'center', alignItems: 'center' }}
          />
        ) : error ? (
          // TODO: add a more proper ErrorComponent
          <CenteredView flex>
            <Text fontSize={FONT_SIZE_LARGE}>{error.message || ''}</Text>
            <Button text="Try Again" onPress={refetch} />
          </CenteredView>
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
                {isDesktop ? (
                  <PropertyDeepDiveHeader
                    showConnect={false}
                    matchScore={0}
                    address={address}
                    targetNeighborhood={targetNeighborhood}
                  />
                ) : (
                  <MobileContainer>
                    <PropertyDeepDiveHeader
                      showConnect={false}
                      matchScore={0}
                      address={address}
                      targetNeighborhood={targetNeighborhood}
                    />
                  </MobileContainer>
                )}

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
                    matchScore={data?.locationDetails.result.matchValue || 0}
                    brandId={brandId}
                    address={address}
                    targetNeighborhood={targetNeighborhood}
                    showConnect={false}
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

const CenteredView = styled(View)`
  justify-content: center;
  align-items: center;
`;

const MobileContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;
