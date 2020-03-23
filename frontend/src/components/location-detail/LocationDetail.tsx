import React, { useRef, useState } from 'react';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';

import { Card, View, Text } from '../../core-ui';
import styled from 'styled-components';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_WEIGHT_MEDIUM } from '../../constants/theme';

type LatLng = google.maps.LatLng;
type MouseEvent = google.maps.MouseEvent;

type Props = {
  visible: boolean;
  title: string;
  subTitle: string;
  population: string;
  income: string;
  age: number;
  markerPosition: LatLng;
  onPreviewPress: () => void;
  onClose: () => void;
};

export default function LocationDetail(props: Props) {
  let infoRef = useRef<Element | undefined>();
  let [infoBoxHeight, setInfoBoxHeight] = useState<number>(0);

  let {
    population,
    income,
    age,
    title,
    visible,
    subTitle,
    markerPosition,
    onPreviewPress,
    onClose,
  } = props;
  let leftText = [
    '3 Mile Daytime Population:',
    '3 Mile Median Household Income:',
    '3 Mile Median Age:',
  ];
  let rightText = [population, income, age + ' years'];
  let handleInfoBoxPress = (e: Event) => {
    e.stopPropagation();
    onPreviewPress();
  };
  return visible ? (
    <InfoBox
      defaultPosition={markerPosition}
      defaultVisible={true}
      options={{
        disableAutoPan: false,
        pixelOffset: new google.maps.Size(-150, -45 - infoBoxHeight),
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: 'floatPane',
        enableEventPropagation: true,
        closeBoxMargin: '10px 0 2px 2px',
        maxWidth: 400,
      }}
      onDomReady={() => {
        let infoBox = document.querySelector('.infoBox');
        if (infoBox) {
          infoRef.current = infoBox;
          infoRef.current.addEventListener('click', handleInfoBoxPress);
          let infoBoxHeight = infoBox.getClientRects()[0].height;
          setInfoBoxHeight(infoBoxHeight);
        }
      }}
      onCloseClick={onClose}
      onUnmount={() => {
        infoRef.current?.removeEventListener('click', handleInfoBoxPress);
      }}
    >
      <Container
        titleBackground="purple"
        title={title}
        subTitle={subTitle}
        titleProps={{ fontWeight: FONT_WEIGHT_MEDIUM }}
      >
        <ContentContainer>
          <LeftColumn>
            {leftText.map((line, i) => (
              <SmallText key={i}>{line}</SmallText>
            ))}
          </LeftColumn>
          <RightColumn>
            {rightText.map((line, i) => (
              <RightColumnText key={i}>{line}</RightColumnText>
            ))}
          </RightColumn>
        </ContentContainer>
        <SeeMoreContainer>
          <SeeMore>click location pin to see more</SeeMore>
        </SeeMoreContainer>
      </Container>
    </InfoBox>
  ) : null;
}

const Container = styled(Card)`
  width: 300px;
  height: auto;
`;
const ContentContainer = styled(View)`
  flex: 1;
  flex-direction: row;
  padding: 0 10px 0 5px;
`;

const SeeMoreContainer = styled(View)`
  padding: 0 10px 0 5px;
  align-items: flex-end;
`;
const LeftColumn = styled(View)`
  flex: 2;
  align-items: flex-start;
`;
const RightColumn = styled(View)`
  flex: 1;
  align-items: flex-end;
  text-align: right;
`;
const RightColumnText = styled(Text)`
  color: ${THEME_COLOR};
  font-size: ${FONT_SIZE_SMALL};
  margin: 10px 0 0 0;
`;
const SmallText = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  margin: 10px 0 0 0;
`;
const SeeMore = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  font-style: italic;
  color: ${THEME_COLOR};
  margin: 10px 0 5px 0;
`;
