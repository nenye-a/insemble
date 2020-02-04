import React, { useState } from 'react';
import styled from 'styled-components';

import { View, Text, Modal, TabBar } from '../../core-ui';
import PropertyDeepDiveHeader from './PropertyDeepDiveHeader';
import Overview from './Overview';
import PropertyDetailsView from './PropertyDetailsView';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function LocationDeepDiveModal(props: Props) {
  let { visible, onClose } = props;
  let [isLiked, toggleIsLiked] = useState(false); // get value from backend
  let [selectedTabIndex, setSelectedTabIndex] = useState(0);
  let isOverviewSelected = selectedTabIndex === 0;
  return (
    <Modal onClose={onClose} visible={visible}>
      <TourContainer>
        <Text>3D Tour</Text>
      </TourContainer>
      <TabBar
        options={['Overview', 'Property Details']}
        activeTab={selectedTabIndex}
        onPress={(index: number) => {
          setSelectedTabIndex(index);
        }}
      />
      <ScrollView flex>
        <PropertyDeepDiveHeader isLiked={isLiked} onLikePress={toggleIsLiked} />
        {isOverviewSelected ? <Overview /> : <PropertyDetailsView />}
      </ScrollView>
    </Modal>
  );
}

const TourContainer = styled(View)`
  height: 320px;
  justify-content: center;
  align-items: center;
  background-color: grey;
`;

const ScrollView = styled(View)`
  overflow-y: scroll;
`;
