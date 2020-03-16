import React from 'react';
import styled from 'styled-components';

import { Card, Text, View } from '../../core-ui';
import { THEME_COLOR, WHITE, DARK_TEXT_COLOR, SECONDARY_COLOR } from '../../constants/colors';
import {
  FONT_SIZE_XXXLARGE,
  FONT_SIZE_LARGE,
  FONT_SIZE_SMALL,
  FONT_WEIGHT_MEDIUM,
  SECONDARY_BORDER_RADIUS,
  FONT_WEIGHT_LIGHT,
} from '../../constants/theme';
import { roundDecimal } from '../../utils';
import ImagePlaceHolder from '../../assets/images/image-placeholder.jpg';

type Props = {
  photo?: string;
  percentile: number;
  description: string;
  name: string;
  tags: Array<string>;
};

export default function RelevantConsumerCard(props: Props) {
  let { photo, percentile, name, description, tags } = props;
  return (
    <Container flex>
      <Image src={photo ? photo : ImagePlaceHolder} alt="consumer-persona-image" />
      <RowedView>
        <PercentageContainer>
          <Text fontSize={FONT_SIZE_XXXLARGE} color={WHITE}>
            {roundDecimal(percentile, 0)}
            <Text fontSize={FONT_SIZE_LARGE} color={WHITE}>
              %
            </Text>
          </Text>
        </PercentageContainer>
        <PersonaName>{name}</PersonaName>
      </RowedView>
      <DescriptionContainer>
        <Text color={DARK_TEXT_COLOR}>Description</Text>
        <Description>{description}</Description>
      </DescriptionContainer>
      <Footer>
        <Text color={WHITE}>Social Tags</Text>
        <Tags>{tags.join(', ')}</Tags>
      </Footer>
    </Container>
  );
}

const Container = styled(Card)`
  margin: 0 4px;
  -webkit-min-logical-width: 250px;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
`;
const Image = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
`;

const PercentageContainer = styled(View)`
  background-color: ${THEME_COLOR};
  padding: 14px 24px;
  border-bottom-right-radius: ${SECONDARY_BORDER_RADIUS};
`;

const RowedView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

const PersonaName = styled(Text)`
  padding: 0 17px;
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;

const DescriptionContainer = styled(View)`
  padding: 6px 13px;
  min-height: 180px;
`;

const Description = styled(Text)`
  font-size: ${FONT_SIZE_SMALL};
  font-weight: ${FONT_WEIGHT_LIGHT};
  color: ${DARK_TEXT_COLOR};
  padding-top: 8px;
`;

const Footer = styled(View)`
  flex: 1;
  background-color: ${SECONDARY_COLOR};
  padding: 6px 13px;
  min-height: 125px;
`;

const Tags = styled(Text)`
  font-style: italic;
  color: ${WHITE};
  font-size: ${FONT_SIZE_SMALL};
  padding-top: 8px;
`;
