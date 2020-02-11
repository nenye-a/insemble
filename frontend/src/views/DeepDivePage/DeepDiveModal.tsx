import React, { useState, UIEvent } from 'react';
import styled from 'styled-components';

import { View, Text, Modal, TabBar } from '../../core-ui';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import Overview from './Overview';
import PropertyDetailsView from './PropertyDetailsView';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const SHRINK_HEIGHT = 160;
export default function LocationDeepDiveModal(props: Props) {
  let { visible, onClose } = props;
  let [isLiked, toggleIsLiked] = useState(false); // get value from backend
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
