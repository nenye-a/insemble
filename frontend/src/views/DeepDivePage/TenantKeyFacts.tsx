import React, { useState } from 'react';
import { View, Text, TabBar } from '../../core-ui';
import styled from 'styled-components';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XXLARGE,
} from '../../constants/theme';
import { SECONDARY_COLOR } from '../../constants/colors';
import { TenantDetail_tenantDetail_keyFacts as KeyFactsProps } from '../../generated/TenantDetail';
import { EmptyDataComponent } from '../../components';

type Props = {
  keyFacts?: KeyFactsProps;
};

export default function TenantKeyFacts({ keyFacts }: Props) {
  let [selectedIndex, setSelectedIndex] = useState<number>(0);
  if (keyFacts) {
    let {
      tenantPerformance: { storeCount, rating, operationYears, averageReviews },
    } = keyFacts;

    let numbers1 = [storeCount, operationYears];

    let categories1 = ['Number of stores', 'Years of operation'];

    let numbers2 = [rating.toFixed(2), averageReviews];

    let categories2 = ['Rating', 'Average # of Reviews'];
    return (
      <View>
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
                return <NumberText key={i}>{line || '-'}</NumberText>;
              })}
            </EconomicColumn>
            <EconomicColumn>
              {categories1.map((line, i) => (
                <CategoriesText key={i}>{line || '-'}</CategoriesText>
              ))}
            </EconomicColumn>
            <EconomicColumn>
              {numbers2.map((line, i) => (
                <NumberText key={i}>{line || '-'}</NumberText>
              ))}
            </EconomicColumn>
            <EconomicColumn>
              {categories2.map((line, i) => (
                <CategoriesText key={i}>{line || '-'}</CategoriesText>
              ))}
            </EconomicColumn>
          </EconomicView>
        </RowedView>
      </View>
    );
  }
  return <EmptyDataComponent />;
}

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
  color: ${SECONDARY_COLOR};
  margin: 24px 0 24px 24px;
  align-self: center;
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
