import React from 'react';
import styled, { css } from 'styled-components';

import { View, Text as BaseText } from '../../core-ui';

import seeBestLocationImg from '../../assets/images/see-best-location.png';
import keyDetailsImg from '../../assets/images/explore-key-details.png';
import topLinePropertiesImg from '../../assets/images/top-line-properties.png';
import { THEME_COLOR, WHITE } from '../../constants/colors';
import { FONT_WEIGHT_BOLD } from '../../constants/theme';

const FEATURES = [
  {
    img: seeBestLocationImg,
    title: 'Instantly see the best locations for your brand.',
    subtitle: 'Instantly survey the market for the best locations for your brand and customers.',
  },
  {
    img: topLinePropertiesImg,
    title: 'Find top line properties within your best areas.',
    subtitle:
      'Skip pounding the pavement.  See the best matching properties for site criteria, ranked by relevance.',
  },
  {
    img: keyDetailsImg,
    title: 'Explore key details about your matches.',
    subtitle:
      'Use psychographics, demographics, nearby analysis, mobile data, and trade area insights and compare directly with your store portfolio. ',
  },
];

type FeatureProp = {
  img: string;
  title: string;
  subtitle: string;
  isOdd: boolean;
  index: number;
};

type FeatureContainerProps = ViewProps & {
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
  let { title, subtitle, img, isOdd, index } = props;
  let description = (
    // giving padding left 3% because the photo has its own margin. so we need to push the text a bit.
    <DescriptionContainer
      key={`featureDescription${index.toString()}`}
      flex
      style={isOdd ? { paddingLeft: '3%' } : undefined}
    >
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
    </DescriptionContainer>
  );
  let photo = <Image key={`featureImg${index.toString()}`} src={img} />;

  let feature = [description, photo];
  return <FeatureContainer index={index}>{isOdd ? feature : feature.reverse()}</FeatureContainer>;
}

const Container = styled(View)`
  background-color: ${THEME_COLOR};
  padding: 0px 5vw;
`;

const FeatureContainer = styled(View)<FeatureContainerProps>`
  flex-direction: row;
  ${(props) =>
    props.index === 0
      ? css`
          margin-top: -100px;
        `
      : props.index === 2
      ? css`
          margin-bottom: -100px;
        `
      : undefined}
`;
const Text = styled(BaseText)`
  color: ${WHITE};
`;

const Title = styled(Text)`
  font-size: 32px;
  font-weight: ${FONT_WEIGHT_BOLD};
`;

const Subtitle = styled(Text)`
  font-size: 20px;
`;

const Image = styled.img`
  width: 60%;
  object-fit: contain;
`;

const DescriptionContainer = styled(View)`
  padding-top: 12%;
`;
