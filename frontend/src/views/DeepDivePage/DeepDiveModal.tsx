import React, { useState, UIEvent } from 'react';
import styled from 'styled-components';
import { useQuery } from '@apollo/react-hooks';
import { useParams } from 'react-router-dom';

import { View, Modal, TabBar, LoadingIndicator } from '../../core-ui';
import { ErrorComponent } from '../../components';

import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import PropertyDetailView from './PropertyDetailView';
import Overview from './Overview';
import VirtualTour from './VirtualTour';
import { GET_LOCATION_DETAILS } from '../../graphql/queries/server/deepdive';
import {
  LocationDetails,
  LocationDetailsVariables,
  LocationDetails_locationDetails_result as LocationDetailsLocationDetailsResult,
  LocationDetails_locationDetails_spaceDetails as LocationDetailsLocationDetailsSpaceDetails,
} from '../../generated/LocationDetails';
import { THEME_COLOR } from '../../constants/colors';

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
  lat?: string;
  lng?: string;
  address: string;
  targetNeighborhood?: string;
  categories?: Array<string>;
  propertyId?: string;
  brandId?: string;
  sqft?: number;
};

const SHRINK_HEIGHT = 160;
export default function LocationDeepDiveModal(props: Props) {
  let { brandId: brandIdParam = '' } = useParams();
  let {
    visible,
    onClose,
    lat = '',
    lng = '',
    address,
    targetNeighborhood = '',
    categories,
    propertyId,
    brandId: brandIdProps,
    sqft,
  } = props;
  let brandId = brandIdParam || brandIdProps || '';
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [selectedSpaceIndex, setSelectedSpaceIndex] = useState(0);
  let [headerShrink, setHeaderShrink] = useState(false);
  let isOverviewSelected = selectedTabIndex === 0;
  let { data, loading, error, refetch } = useQuery<LocationDetails, LocationDetailsVariables>(
    GET_LOCATION_DETAILS,
    {
      variables: {
        brandId,
        selectedLocation:
          address && lat && lng
            ? {
                address,
                lat,
                lng,
              }
            : undefined,
        selectedPropertyId: propertyId ? propertyId : null,
      },
      notifyOnNetworkStatusChange: true,
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
          <ErrorComponent onRetry={refetch} text={error.message} />
        ) : (
          <>
            {noPropertyDetail ? (
              <ScrollView flex onScroll={handleOnScroll}>
                <PropertyDeepDiveHeader
                  showConnect={false}
                  matchScore={0}
                  address={address}
                  targetNeighborhood={targetNeighborhood}
                  sqft={sqft}
                />
                <Overview />
              </ScrollView>
            ) : (
              <>
                <VirtualTour
                  tourSource={data?.locationDetails.spaceDetails[selectedSpaceIndex].tour3D || ''}
                  placeholder={data?.locationDetails.spaceDetails[selectedSpaceIndex].mainPhoto}
                  isShrink={headerShrink}
                />
                <TabBar
                  options={['Overview', 'Property Details']}
                  activeTab={selectedTabIndex}
                  onPress={(index: number) => {
                    setSelectedTabIndex(index);
                  }}
                />
                <ScrollView flex onScroll={handleOnScroll}>
                  <PropertyDeepDiveHeader
                    matchScore={data?.locationDetails.result.matchValue || 0}
                    brandId={brandId}
                    address={address}
                    targetNeighborhood={targetNeighborhood}
                    showConnect={false}
                    sqft={sqft}
                  />
                  {isOverviewSelected ? (
                    <Overview />
                  ) : (
                    <PropertyDetailView
                      propertyId={propertyId}
                      selectedSpaceIndex={selectedSpaceIndex}
                      onSpaceChange={setSelectedSpaceIndex}
                    />
                  )}
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
