import React, { ComponentProps } from 'react';
import styled, { css } from 'styled-components';

import { View, Text as BaseText } from '../../core-ui';

import seeBestLocationImg from '../../assets/images/see-best-location.png';
import keyDetailsImg from '../../assets/images/explore-key-details.png';
import topLinePropertiesImg from '../../assets/images/top-line-properties.png';
import { THEME_COLOR, WHITE } from '../../constants/colors';
import { FONT_WEIGHT_BOLD, FONT_SIZE_XLARGE, FONT_WEIGHT_LIGHT } from '../../constants/theme';
import { useViewport } from '../../utils';
import { VIEWPORT_TYPE } from '../../constants/viewports';

const FEATURES = [
  {
    img: seeBestLocationImg,
    title: 'Instantly see the best locations for your brand.',
    mobileTitle: 'Instantly see the best\nlocations for your brand.',
    subtitle: 'Instantly survey the market for the best locations for your brand and customers.',
  },
  {
    img: topLinePropertiesImg,
    title: 'Find top line properties within your best areas.',
    mobileTitle: 'Find top line properties\nwithin your best areas.',
    subtitle:
      'Skip pounding the pavement.\nSee the best matching properties for site criteria, ranked by relevance.',
  },
  {
    img: keyDetailsImg,
    title: 'Explore key details about your matches.',
    mobileTitle: 'Explore key details\nabout your matches.',
    subtitle:
      'Use psychographics, demographics, nearby analysis, mobile data, and trade area insights and compare directly with your store portfolio. ',
  },
];

type FeatureProp = {
  img: string;
  title: string;
  mobileTitle: string;
  subtitle: string;
  isOdd: boolean;
  index: number;
};

type ViewWithViewportType = {
  isDesktop: boolean;
};

type ImageWithViewportType = ComponentProps<'img'> & {
  isDesktop: boolean;
};

type TextWithViewportType = TextProps & {
  isDesktop: boolean;
};

type FeatureContainerProps = ViewWithViewportType & {
  index: number;
};

export default function Features() {
  return (
    <Container>
      {FEATURES.map((item, index) => (
        <Feature key={index} {...item} index={index} isOdd={index % 2 === 1} />
      ))}
    </Container>
  );
}

function Feature(props: FeatureProp) {
  let { title, mobileTitle, subtitle, img, isOdd, index } = props;
  let { viewportType } = useViewport();
  let isDesktop = viewportType === VIEWPORT_TYPE.DESKTOP;
  let description = (
    // giving padding left 3% because the photo has its own margin. so we need to push the text a bit.
    <DescriptionContainer
      key={`featureDescription${index.toString()}`}
      flex
      style={isOdd ? { paddingLeft: '3%' } : undefined}
      isDesktop={isDesktop}
    >
      <Title isDesktop={isDesktop}>{isDesktop ? title : mobileTitle}</Title>
      <Subtitle isDesktop={isDesktop}>{subtitle}</Subtitle>
    </DescriptionContainer>
  );
  let photo = <Image key={`featureImg${index.toString()}`} src={img} isDesktop={isDesktop} />;

  let feature = [description, photo];
  let content = isDesktop && isOdd ? feature : feature.reverse();
  return (
    <FeatureContainer index={index} isDesktop={isDesktop}>
      {content}
    </FeatureContainer>
  );
}

const Container = styled(View)`
  background-color: ${THEME_COLOR};
  padding: 0px 5vw;
`;

const FeatureContainer = styled(View)<FeatureContainerProps>`
  ${(props) =>
    !props.isDesktop
      ? css`
          align-items: center;
          flex-direction: column;
        `
      : css`
          flex-direction: row;
          padding: 23px 0;
        `}
  ${(props) =>
    props.index === 0
      ? css`
          margin-top: -100px;
        `
      : props.index === 2 && props.isDesktop
      ? css`
          margin-bottom: -100px;
        `
      : undefined}
`;
const Text = styled(BaseText)`
  color: ${WHITE};
`;

const Title = styled(Text)<TextWithViewportType>`
  font-weight: ${FONT_WEIGHT_BOLD};
  ${(props) =>
    props.isDesktop
      ? css`
          font-size: 32px;
        `
      : css`
          font-size: ${FONT_SIZE_XLARGE};
          text-align: center;
        `}
`;

const Subtitle = styled(Text)<TextWithViewportType>`
  font-size: 20px;
  text-align: ${(props) => !props.isDesktop && 'center'};
  font-family: ${FONT_WEIGHT_LIGHT};
  margin-top: 22px;
`;

const Image = styled.img<ImageWithViewportType>`
  width: ${(props) => (props.isDesktop ? '60%' : '100%')};
  object-fit: contain;
`;

const DescriptionContainer = styled(View)<ViewWithViewportType>`
  ${(props) =>
    props.isDesktop
      ? css`
          padding-top: 12%;
        `
      : css`
          padding: 0 12px 12% 12px;
        `}
`;
