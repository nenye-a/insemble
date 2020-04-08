import React from 'react';
import styled, { css } from 'styled-components';
import { useHistory } from 'react-router-dom';

import { View, Text, Button } from '../core-ui';
import OnboardingCard from './OnboardingPage/OnboardingCard';
import { useViewport } from '../utils';
import OnboardingFooter from '../components/layout/OnboardingFooter';
import { FONT_SIZE_LARGE } from '../constants/theme';
import { THEME_COLOR } from '../constants/colors';
import { MAPS_IFRAME_URL_SEARCH } from '../constants/googleMaps';

type Props = {
  latitude: number;
  longitude: number;
};
export default function OutOfBound({ latitude, longitude }: Props) {
  let history = useHistory();

  let { isDesktop } = useViewport();

  let iframeSource = MAPS_IFRAME_URL_SEARCH + '&q=' + latitude + ', ' + longitude;

  return (
    <Container isDesktop={isDesktop} flex>
      <OnboardingCard progress={0} title="Unsupported Address">
        {iframeSource && <Iframe src={iframeSource} />}
        <ContentContainer>
          <ContentContainer>
            <Title>We apologize, your address is not supported.</Title>
            <Text>
              Insemble currently only supports addresses within the Los Angeles and Orange County
              metropolitan area. We will be expanding our area of support in the upcoming months. To
              access our platform, please use an address within the Los Angeles and Orange County
              area, or choose categories that represent your brand.
            </Text>
          </ContentContainer>
        </ContentContainer>
        <OnboardingFooter>
          <Button text="Back" onPress={() => history.goBack()} />
        </OnboardingFooter>
      </OnboardingCard>
    </Container>
  );
}

type ContainerProps = ViewProps & {
  isDesktop: boolean;
};

const Container = styled(View)<ContainerProps>`
  align-items: center;
  ${(props) =>
    props.isDesktop
      ? css`
          margin: 24px;
        `
      : css`
          min-height: 90vh;
        `}
`;

const ContentContainer = styled(View)`
  padding: 24px;
  z-index: 1;
  flex: 1;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_LARGE};
  color: ${THEME_COLOR};
  margin-bottom: 10px;
`;

const Iframe = styled.iframe`
  display: block;
  width: 100%;
  height: 152px;
  border: none;
`;
