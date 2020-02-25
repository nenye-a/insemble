import React, { useState } from 'react';
import { Card, View, Text, TabBar } from '../../core-ui';
import styled from 'styled-components';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XXLARGE,
} from '../../constants/theme';
import { THEME_COLOR } from '../../constants/colors';

type Props = {
  withMargin?: boolean;
};
export default function TenantKeyFacts({ withMargin = true }: Props) {
  let [selectedIndex, setSelectedIndex] = useState<number>(0);

  let numbers1 = ['1', '7'];

  let categories1 = ['Number of stores', 'Years of operation'];

  let numbers2 = ['4.1/5', '254'];

  let categories2 = ['Rating', 'Average # of Reviews'];

  let content = (
    <>
      <TextView>
        <Title>Key Facts & Growth</Title>
      </TextView>
      <RowedView>
        <Tab
          verticalMode
          options={['Tenant Performance']}
          activeTab={selectedIndex}
          onPress={(index) => {
            setSelectedIndex(index);
          }}
        />
        <EconomicView flex>
          <EconomicColumn>
            {numbers1.map((line, i) => {
              return <NumberText key={i}>{line}</NumberText>;
            })}
          </EconomicColumn>
          <EconomicColumn>
            {categories1.map((line, i) => (
              <CategoriesText key={i}>{line}</CategoriesText>
            ))}
          </EconomicColumn>
          <EconomicColumn>
            {numbers2.map((line, i) => (
              <NumberText key={i}>{line}</NumberText>
            ))}
          </EconomicColumn>
          <EconomicColumn>
            {categories2.map((line, i) => (
              <CategoriesText key={i}>{line}</CategoriesText>
            ))}
          </EconomicColumn>
        </EconomicView>
      </RowedView>
    </>
  );
  return withMargin ? <Container>{content}</Container> : <View>{content}</View>;
}

const Container = styled(Card)`
  margin: 18px 36px;
  min-height: 400px;
`;

const RowedView = styled(View)`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const TextView = styled(View)`
  flex-direction: row;
  padding: 16px;
`;
const Tab = styled(TabBar)`
  height: 100%;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
`;

const NumberText = styled(Text)`
  font-size: ${FONT_SIZE_XXLARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  color: ${THEME_COLOR};
  margin: 24px 0 24px 24px;
`;

const CategoriesText = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_LIGHT};
  margin: 24px 0 24px 0;
`;

const EconomicView = styled(View)`
  flex-direction: row;
  width: 600px;
`;
const EconomicColumn = styled(View)`
  flex: 1;
  justify-content: space-around;
`;
