import React, { useState, UIEvent } from 'react';
import styled from 'styled-components';

import { View, Modal, TabBar, LoadingIndicator } from '../../core-ui';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import TenantPropertyDetailsView from './TenantPropertyDetailsView';
import TenantOverview from './TenantOverview';
import { WHITE, BACKGROUND_COLOR } from '../../constants/colors';
import { GET_TENANT_DETAILS } from '../../graphql/queries/server/deepdive';
import { useQuery } from '@apollo/react-hooks';
import { TenantDetail, TenantDetailVariables } from '../../generated/TenantDetail';
import imgPlaceholder from '../../assets/images/image-placeholder.jpg';

type Props = {
  visible: boolean;
  onClose: () => void;
  brandId: string;
  propertyId: string;
  spaceId: string;
  tenantPhoto: string;
  matchScore: number;
};

const SHRINK_HEIGHT = 160;

export default function TenantDeepDiveModal(props: Props) {
  let { visible, onClose, brandId, tenantPhoto, matchScore, spaceId } = props;
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [headerShrink, setHeaderShrink] = useState(false);
  let isOverviewSelected = selectedTabIndex === 0;
  let { data, loading } = useQuery<TenantDetail, TenantDetailVariables>(GET_TENANT_DETAILS, {
    variables: {
      brandId,
      propertyId: props.propertyId,
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

  return (
    <Modal backgroundColor={BACKGROUND_COLOR} onClose={onClose} visible={visible}>
      {loading && !data ? (
        <LoadingIndicator />
      ) : (
        <>
          <TourContainer isShrink={headerShrink} src={tenantPhoto || imgPlaceholder} />
          <TabBar
            fullWidth={false}
            options={['Tenant View', 'Insights View']}
            activeTab={selectedTabIndex}
            onPress={(index: number) => {
              setSelectedTabIndex(index);
            }}
          />

          <ScrollView flex onScroll={handleOnScroll}>
            <View style={{ backgroundColor: WHITE }}>
              <PropertyDeepDiveHeader
                brandId={brandId}
                spaceId={spaceId}
                matchScore={matchScore}
                address={data?.tenantDetail.name || ''}
                targetNeighborhood={data?.tenantDetail.category || ''}
              />
            </View>
            {isOverviewSelected ? (
              <TenantOverview
                keyFacts={data?.tenantDetail.keyFacts}
                tenantView={data?.tenantDetail.tenantView}
              />
            ) : (
              <TenantPropertyDetailsView
                keyFacts={data?.tenantDetail.keyFacts}
                insightsView={data?.tenantDetail.insightView}
              />
            )}
          </ScrollView>
        </>
      )}
    </Modal>
  );
}

type TourContainerProps = {
  isShrink: boolean;
};

const TourContainer = styled.img<TourContainerProps>`
  height: ${(props) => (props.isShrink ? '180px' : '320px')};
  transition: 0.3s height linear;
  object-fit: cover;
`;

const ScrollView = styled(View)`
  overflow-y: scroll;
`;
