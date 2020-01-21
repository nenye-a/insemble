import React from 'react';
import { Card, View, Text, TouchableOpacity } from '../../core-ui';
import styled from 'styled-components';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_SIZE_SMALL, FONT_WEIGHT_MEDIUM } from '../../constants/theme';

type Props = {
  visible: boolean;
  title: string;
  subTitle: string;
  population: string;
  income: string;
  age: number;
  gender: string;
  ethnicity: Array<string>;
  onSeeMore: () => void;
};

export default function LocationDetail(props: Props) {
  let { population, income, age, gender, ethnicity, title, onSeeMore, visible, subTitle } = props;
  let leftText = [
    '3 Mile Population:',
    'Median Income:',
    'Average Age:',
    'Gender:',
    'Top Ethnicity:',
  ];
  let rightText = [population, income, age + 'years', gender, ethnicity.join(', ')];
  return visible ? (
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
          <TouchableOpacity onPress={onSeeMore}>
            <SeeMore>Click again to see more</SeeMore>
          </TouchableOpacity>
        </RightColumn>
      </ContentContainer>
    </Container>
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
const LeftColumn = styled(View)`
  flex: 1;
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
