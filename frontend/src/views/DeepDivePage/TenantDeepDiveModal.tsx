import React, { useState, UIEvent } from 'react';
import styled from 'styled-components';

import { View, Modal, TabBar } from '../../core-ui';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import TenantPropertyDetailsView from './TenantPropertyDetailsView';
import TenantOverview from './TenantOverview';
import { WHITE, BACKGROUND_COLOR } from '../../constants/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SHRINK_HEIGHT = 160;
export default function TenantDeepDiveModal(props: Props) {
  let { visible, onClose } = props;
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let [headerShrink, setHeaderShrink] = useState(false);
  let isOverviewSelected = selectedTabIndex === 0;

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
      <TourContainer isShrink={headerShrink} />
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
            isLiked
            onLikePress={() => {}}
            address="California Cheeseburgers"
            targetNeighborhood="Hamburger Restaurant"
          />
        </View>
        {isOverviewSelected ? <TenantOverview /> : <TenantPropertyDetailsView />}
      </ScrollView>
    </Modal>
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
