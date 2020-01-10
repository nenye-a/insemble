import React, { ComponentProps } from 'react';
import styled from 'styled-components';
import { Text, View } from '../../core-ui';
import { FONT_SIZE_SMALL, FONT_SIZE_MEDIUM } from '../../constants/theme';
import AvailablePropertyCard from './AvailablePropertyCard';
import {
  AVAILABLE_PROPERTIES,
  TOTAL_RECOMMENDED_PROPERTY,
  TOTAL_AVAILABLE_PROPERTY,
} from '../../fixtures/dummyData';
import { THEME_COLOR } from '../../constants/colors';

type Props = {
  visible: boolean;
  onHideClick: () => void;
};

type ContainerProps = ComponentProps<typeof View> & {
  visible?: boolean;
};

export default function AvailableProperties(props: Props) {
  let { visible, onHideClick } = props;

  return (
    <Container flex visible={visible}>
      <UpperTextContainer>
        <View flex>
          <Text fontSize={FONT_SIZE_MEDIUM}>Properties for rent</Text>
        </View>
        {/* TODO: change to touchable component */}
        <ItalicText onClick={onHideClick}>Hide</ItalicText>
      </UpperTextContainer>
      <RowedFlex>
        <ItalicText
          fontSize={FONT_SIZE_SMALL}
        >{`${TOTAL_AVAILABLE_PROPERTY} available`}</ItalicText>
        <ItalicText color={THEME_COLOR} fontSize={FONT_SIZE_SMALL}>
          {` (${TOTAL_RECOMMENDED_PROPERTY} recommended)`}
        </ItalicText>
      </RowedFlex>
      {AVAILABLE_PROPERTIES.map(({ photo, address, price, area, propertyType }, index) => (
        <AvailablePropertyCard
          key={index}
          photo={photo}
          address={address}
          price={price}
          area={area}
          propertyType={propertyType}
          onClick={() => {}}
        />
      ))}
    </Container>
  );
}

const Container = styled(View)<ContainerProps>`
  width: 350px;
  position: absolute;
  right: ${(props) => (props.visible ? '0px' : '-350px')};
  background-color: white;
  padding: 8px;
  transition: all 500ms linear;
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
