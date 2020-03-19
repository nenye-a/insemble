import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import { Text, View, Button } from '../../core-ui';
import { FONT_SIZE_SMALL, FONT_SIZE_MEDIUM } from '../../constants/theme';
import AvailablePropertyCard from './AvailablePropertyCard';
import { THEME_COLOR } from '../../constants/colors';
import { TenantMatches_tenantMatches_matchingProperties as MatchingProperties } from '../../generated/TenantMatches';
import { EmptyDataComponent } from '../../components';

type Props = {
  visible: boolean;
  onHideClick: () => void;
  matchingProperties: Array<MatchingProperties>;
};

type ContainerProps = ComponentProps<typeof View> & {
  visible?: boolean;
};

export default function AvailableProperties(props: Props) {
  let { visible, onHideClick, matchingProperties } = props;
  let visibleProperties = matchingProperties.filter((property) => property.visible);
  return (
    <Container flex visible={visible}>
      <UpperTextContainer>
        <View flex>
          <Text fontSize={FONT_SIZE_MEDIUM}>Properties for rent</Text>
        </View>
        <Button
          text="Hide"
          mode="transparent"
          onPress={onHideClick}
          textProps={{ style: { color: THEME_COLOR, fontStyle: 'italic' } }}
        />
      </UpperTextContainer>
      {visibleProperties.length > 0 ? (
        <>
          <RowedFlex>
            <ItalicText
              fontSize={FONT_SIZE_SMALL}
            >{`${visibleProperties.length} available`}</ItalicText>
            {/* hiding this until BE ready */}
            {/* <ItalicText color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
          {` (${TOTAL_RECOMMENDED_PROPERTY} recommended)`}
        </ItalicText> */}
          </RowedFlex>
          {visibleProperties.map(({ address, rent, sqft, tenantType }, index) => (
            <AvailablePropertyCard
              key={index}
              // TODO: pass photo when BE is ready
              photo=""
              address={address}
              price={rent}
              area={sqft}
              propertyType={tenantType.join(', ')}
              // TODO: open deep dive
              onPress={() => {}}
            />
          ))}
        </>
      ) : (
        <EmptyDataComponent text="No Matching Property Found" />
      )}
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
