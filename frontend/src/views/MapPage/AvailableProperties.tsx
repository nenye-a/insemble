import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import SwipeableBottomSheet from 'react-swipeable-bottom-sheet';
import { Text, View, Button } from '../../core-ui';
import { FONT_SIZE_SMALL, FONT_SIZE_MEDIUM } from '../../constants/theme';
import AvailablePropertyCard from './AvailablePropertyCard';
import { THEME_COLOR } from '../../constants/colors';
import { TenantMatches_tenantMatches_matchingProperties as MatchingProperties } from '../../generated/TenantMatches';
import { EmptyDataComponent } from '../../components';
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
          textProps={{
            style: { color: THEME_COLOR, fontStyle: 'italic', transition: 'all linear 500ms' },
          }}
        />
      </UpperTextContainer>
      {matchingProperties.length > 0 ? (
        <>
          <RowedFlex>
            <ItalicText
              fontSize={FONT_SIZE_SMALL}
            >{`${matchingProperties.length} available`}</ItalicText>
            {/* hiding this until BE ready */}
            {/* <ItalicText color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
    {` (${TOTAL_RECOMMENDED_PROPERTY} recommended)`}
  </ItalicText> */}
          </RowedFlex>
          {matchingProperties.map(
            ({ lat, lng, address, rent, sqft, tenantType, propertyId }, index) => (
              <AvailablePropertyCard
                key={index}
                // TODO: pass photo when BE is ready
                photo=""
                address={address}
                price={rent}
                area={sqft}
                propertyType={tenantType.join(', ')}
                onPress={() => {
                  onPropertyPress({ lat, lng, address, propertyId, targetNeighborhood: '' });
                }}
              />
            )
          )}
        </>
      ) : (
        <EmptyDataComponent text="No Matching Property Found" />
      )}
    </>
  );

  if (!isDesktop) {
    return (
      <SwipeableBottomSheet
        open={visible}
        overflowHeight={75}
        style={{ zIndex: 99 }}
        overlay={false}
        bodyStyle={{ padding: 8, height: 'calc(100vh - 95px)' }}
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
  padding: 8px;
  transition: transform 500ms linear;
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
