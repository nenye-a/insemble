import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import { Text, View, Button } from '../../core-ui';
import { FONT_SIZE_SMALL, FONT_SIZE_MEDIUM } from '../../constants/theme';
import AvailablePropertyCard from './AvailablePropertyCard';
import { THEME_COLOR, DARK_TEXT_COLOR } from '../../constants/colors';
import { TenantMatches_tenantMatches_matchingProperties as MatchingProperties } from '../../generated/TenantMatches';
import { SelectedLatLng } from '../MainMap';
import { useViewport } from '../../utils';

type Props = {
  visible: boolean;
  onShowOrHide: (visible?: boolean) => void;
  matchingProperties: Array<MatchingProperties>;
  onPropertyPress: (selectedProperty: SelectedLatLng) => void;
};

type ContainerProps = ComponentProps<typeof View> & {
  visible?: boolean;
};

export default function AvailableProperties(props: Props) {
  let { visible, onShowOrHide, matchingProperties, onPropertyPress } = props;
  let { isDesktop } = useViewport();

  let content = (
    <>
      <UpperTextContainer>
        <View flex>
          <Text fontSize={FONT_SIZE_MEDIUM}>Properties for rent</Text>
        </View>
        <Button
          text={visible ? 'Hide' : 'Show'}
          mode="transparent"
          onPress={onShowOrHide}
          style={{ height: 'fit-content' }}
          textProps={{
            style: { color: THEME_COLOR, fontStyle: 'italic', transition: 'all linear 100ms' },
          }}
        />
      </UpperTextContainer>
      <RowedFlex>
        <ItalicText fontSize={FONT_SIZE_SMALL}>{`${matchingProperties.length} results`}</ItalicText>
        {/* hiding this until BE ready */}
        {/* <ItalicText color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
    {` (${TOTAL_RECOMMENDED_PROPERTY} recommended)`}
  </ItalicText> */}
      </RowedFlex>
      {matchingProperties.length > 0 ? (
        matchingProperties.map(
          ({ lat, lng, address, rent, sqft, propertyId, matchValue, thumbnail }, index) => (
            <AvailablePropertyCard
              key={index}
              photo={thumbnail}
              address={address}
              price={rent}
              area={sqft}
              matchValue={matchValue}
              onPress={() => {
                onPropertyPress({ lat, lng, address, propertyId, targetNeighborhood: '' });
              }}
            />
          )
        )
      ) : (
        <EmptyDataContainer>
          <Text color={THEME_COLOR} fontSize={FONT_SIZE_MEDIUM} style={{ lineHeight: 2 }}>
            No Matching Properties.
          </Text>
          <Text color={DARK_TEXT_COLOR}>
            Please adjust your filters to see matching properties.
          </Text>
        </EmptyDataContainer>
      )}
    </>
  );

  if (!isDesktop) {
    return (
      <SwipeableBottomSheet
        open={visible}
        overflowHeight={70}
        style={{ zIndex: 99 }}
        overlay={false}
        bodyStyle={{ padding: 16, height: 'calc(100vh - 220px)' }}
        onChange={onShowOrHide}
      >
        {content}
      </SwipeableBottomSheet>
    );
  }
  return (
    <Container flex visible={visible}>
      {content}
    </Container>
  );
}

const Container = styled(View)<ContainerProps>`
  width: 350px;
  position: absolute;
  right: 0px;
  background-color: white;
  padding: 16px;
  transition: transform 250ms linear;
  transform: translateX(${(props) => (props.visible ? '0px' : '350px')});
  height: 100%;
  overflow-y: scroll;
`;

const UpperTextContainer = styled(View)`
  justify-content: between;
  align-items: center;
  flex-direction: row;
`;

const RowedFlex = styled(View)`
  flex-direction: row;
`;

const ItalicText = styled(Text)`
  font-style: italic;
  color: ${THEME_COLOR};
`;

const EmptyDataContainer = styled(View)`
  padding: 42px 0;
`;
