import React, { useState, useEffect } from 'react';
import { Card, View, Text, TabBar } from '../../core-ui';
import { PieChart, Pie, Cell } from 'recharts';
import styled from 'styled-components';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_XXLARGE,
} from '../../constants/theme';
import { THEME_COLOR, COMMUTE_CHART_COLORS, SECONDARY_COLOR } from '../../constants/colors';
import { convertToKilos, roundDecimal, getKeyfactsValue } from '../../utils';
import {
  LocationDetails_locationDetails_result_commute as locationDetailsCommute,
  LocationDetails_locationDetails_result_keyFacts as locationDetailsKeyFacts,
} from '../../generated/LocationDetails';

type Props = {
  withMargin?: boolean;
  keyFactsData?: locationDetailsKeyFacts;
  commuteData?: Array<locationDetailsCommute>;
};
export default function KeyFacts(props: Props) {
  let { withMargin, keyFactsData, commuteData } = props;
  let [selectedIndex, setSelectedIndex] = useState<number>(0);
  let [pieSize, setPieSize] = useState<Array<number>>([]);
  let isCommuteSelected = selectedIndex === 1;

  useEffect(() => {
    let size = () => {
      let target = document.getElementById('commute-view');
      if (target) {
        return [target.getBoundingClientRect().width, target.getBoundingClientRect().height];
      }
      return [];
    };
    setPieSize(size());
  }, [selectedIndex]);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx = 0,
    cy = 0,
    midAngle = 0,
    innerRadius = 0,
    outerRadius = 0,
    index = 0,
  }: {
    cx?: number | string;
    cy?: number | string;
    midAngle?: number;
    innerRadius?: number | string;
    outerRadius?: number | string;
    percent?: number;
    index?: number;
  }) => {
    let x;
    let y;
    if (
      typeof innerRadius === 'number' &&
      typeof outerRadius === 'number' &&
      typeof cx === 'number' &&
      typeof cy === 'number'
    ) {
      const radius = innerRadius + outerRadius + 80;
      x = cx - 20 + radius * Math.cos(-midAngle * RADIAN);
      y = cy + radius * Math.sin(-midAngle * RADIAN);
    }

    return (
      <>
        <Label x={x} y={y} textAnchor="middle" dominantBaseline="central">
          {commuteData && commuteData[index].name}
        </Label>
        {commuteData && (
          <Value x={x} y={y && y + 20} fill="black" textAnchor="middle" dominantBaseline="central">
            {convertToKilos(commuteData[index].value)}K
          </Value>
        )}
      </>
    );
  };

  let sortedData = commuteData && commuteData.sort((a, b) => (a.value > b.value ? -1 : 1));

  let numbers1 = [
    keyFactsData?.daytimePop,
    keyFactsData?.mediumHouseholdIncome,
    keyFactsData?.totalHousehold,
    keyFactsData?.householdGrowth2017to2022,
  ];
  let numbers2 = [
    keyFactsData?.numMetro,
    keyFactsData?.numUniversities,
    keyFactsData?.numHospitals,
    keyFactsData?.numApartements,
  ];
  let categories1 = [
    'Daytime Population',
    'Medium Household Income',
    'Total Households',
    'Total Household Growth',
  ];
  let categories2 = ['Metro stations', 'Universities', 'Hospitals', 'Apartments'];

  let content = (
    <>
      <TextView>
        <Title>Key Facts & Growth</Title>
        {keyFactsData?.mile && <Radius>within {keyFactsData.mile} miles</Radius>}
      </TextView>
      <RowedView>
        <Tab
          verticalMode
          options={['Economic Drivers', 'Commute']}
          activeTab={selectedIndex}
          onPress={(index) => {
            setSelectedIndex(index);
          }}
        />
        {isCommuteSelected ? (
          <CommuteView flex id="commute-view">
            <PieChart width={pieSize[0]} height={pieSize[1]}>
              <Pie
                data={commuteData && commuteData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                nameKey="name"
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {sortedData &&
                  sortedData.map((entry, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COMMUTE_CHART_COLORS[index % COMMUTE_CHART_COLORS.length]}
                    />
                  ))}
              </Pie>
            </PieChart>
            {/* hiding this until data is ready */}
            {/* <TextView>
            <AverageTime>Average time to work: </AverageTime>
            <Time>{time}mins</Time>
          </TextView> */}
          </CommuteView>
        ) : (
          <EconomicView flex>
            <EconomicColumn>
              {numbers1.map((line, i) => {
                let lastIndex = numbers1.length - 1 === i;
                let houseHoldIncomeIndex = i === 1;
                let formattedValues = line
                  ? lastIndex
                    ? roundDecimal(line) + '%'
                    : houseHoldIncomeIndex
                    ? '$' + getKeyfactsValue(line)
                    : getKeyfactsValue(line)
                  : '';
                return <NumberText key={i}>{formattedValues}</NumberText>;
              })}
            </EconomicColumn>
            <EconomicColumn>
              {categories1.map((line, i) => (
                <CategoriesText key={i}>{line}</CategoriesText>
              ))}
            </EconomicColumn>
            <EconomicColumn>
              {numbers2.map((line, i) => {
                // currently system can only show up to 60 results. so we need to add '+' for values === 60
                let value = getKeyfactsValue(line);
                let formattedValues =
                  value === 60 || value === '60' ? value.toString() + '+' : line;
                return <NumberText key={i}>{formattedValues}</NumberText>;
              })}
            </EconomicColumn>
            <EconomicColumn>
              {categories2.map((line, i) => (
                <CategoriesText key={i}>{line}</CategoriesText>
              ))}
            </EconomicColumn>
          </EconomicView>
        )}
      </RowedView>
    </>
  );
  return withMargin ? <Container>{content}</Container> : <View>{content}</View>;
}

const Container = styled(Card)`
  margin: 18px 36px;
  min-height: 600px;
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
const Radius = styled(Text)`
  margin: 0 0 0 48px;
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_LIGHT};
`;
const Title = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
`;
// const AverageTime = styled(Text)`
//   color: ${THEME_COLOR};
//   font-size: ${FONT_SIZE_LARGE};
// `;
// const Time = styled(Text)`
//   margin: 0 0 0 11px;
//   font-size: ${FONT_SIZE_LARGE};
//   font-weight: ${FONT_WEIGHT_LIGHT};
// `;
const Label = styled.text`
  font-size: ${FONT_SIZE_MEDIUM};
  fill: ${THEME_COLOR};
`;
const Value = styled.text`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_LIGHT};
  fill: black;
`;

const CommuteView = styled(View)`
  justify-content: space-between;
`;

const NumberText = styled(Text)`
  font-size: ${FONT_SIZE_XXLARGE};
  font-weight: ${FONT_WEIGHT_BOLD};
  color: ${SECONDARY_COLOR};
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
