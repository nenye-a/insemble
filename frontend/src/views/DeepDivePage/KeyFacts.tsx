import React, { useState, useEffect, useContext } from 'react';
import { Card, View, Text, TabBar } from '../../core-ui';
import { PieChart, Pie, Cell } from 'recharts';
import styled from 'styled-components';
import {
  FONT_WEIGHT_BOLD,
  FONT_WEIGHT_LIGHT,
  FONT_SIZE_MEDIUM,
  FONT_SIZE_LARGE,
  FONT_SIZE_XXLARGE,
} from '../../constants/theme';
import { THEME_COLOR } from '../../constants/colors';
import { DeepDiveContext } from './DeepDiveModal';

type Data = {
  name: string;
  value: number;
};

type Props = {
  time?: number;
  chartData?: Array<Data>;
  economicData?: Array<string>;
};

export default function KeyFacts(props: Props) {
  let data = useContext(DeepDiveContext);
  let commuteData = data?.result.commute;
  let keyFactsData = data?.result.keyFacts;
  let { time } = props;
  let [selectedIndex, setSelectedIndex] = useState<number>(0);
  let [pieSize, setPieSize] = useState<Array<number>>([]);

  useEffect(() => {
    let size = () => {
      let target = document.getElementById('economic-view');
      if (target) {
        return [target.getBoundingClientRect().width, target.getBoundingClientRect().height];
      }
      return [];
    };
    setPieSize(size());
  }, []);

  // let data = [
  //   { name: 'Walk', value: 1000 },
  //   { name: 'Drive', value: 2000 },
  //   { name: 'Small Business', value: 3000 },
  //   { name: 'Public Transit', value: 4000 },
  // ];
  const COLORS = ['#674EA7CC', '#674EA799', '#674EA766', '#674EA733'];
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
        <Label x={x} y={y} textAnchor={'middle'} dominantBaseline="central">
          {commuteData && commuteData[index].name}
        </Label>
        <Value x={x} y={y && y + 20} fill="black" textAnchor={'middle'} dominantBaseline="central">
          {commuteData && commuteData[index].value.toString().slice(0, -3)}K
        </Value>
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
  return (
    <Container>
      <TextView>
        <Title>Key Facts & Growth</Title>
        <Radius>within 1 mile</Radius>
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
        {selectedIndex === 0 ? (
          <EconomicViews id="economic-view">
            <PieChart width={pieSize[0]} height={pieSize[1]}>
              <Pie
                data={commuteData && commuteData}
                cx="50%"
                cy="50%"
                outerRadius={150}
                nameKey="name"
                fill="#8884d8"
                dataKey="value"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {sortedData &&
                  sortedData.map((entry, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
            </PieChart>
            <TextView>
              <AverageTime>Average time to work: </AverageTime>
              <Time>{time}mins</Time>
            </TextView>
          </EconomicViews>
        ) : (
          <CommuteView flex>
            <CommuteColumn>
              {numbers1.map((line, i) => (
                <NumberText key={i}>{line}</NumberText>
              ))}
            </CommuteColumn>
            <CommuteColumn>
              {categories1.map((line, i) => (
                <CategoriesText key={i}>{line}</CategoriesText>
              ))}
            </CommuteColumn>
            <CommuteColumn>
              {numbers2.map((line, i) => (
                <NumberText key={i}>{line}</NumberText>
              ))}
            </CommuteColumn>
            <CommuteColumn>
              {categories2.map((line, i) => (
                <CategoriesText key={i}>{line}</CategoriesText>
              ))}
            </CommuteColumn>
          </CommuteView>
        )}
      </RowedView>
    </Container>
  );
}

const Container = styled(Card)`
  flex: 1;
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
const AverageTime = styled(Text)`
  color: ${THEME_COLOR};
  font-size: ${FONT_SIZE_LARGE};
`;
const Time = styled(Text)`
  margin: 0 0 0 11px;
  font-size: ${FONT_SIZE_LARGE};
  font-weight: ${FONT_WEIGHT_LIGHT};
`;
const Label = styled.text`
  font-size: ${FONT_SIZE_MEDIUM};
  fill: ${THEME_COLOR};
`;
const Value = styled.text`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_LIGHT};
  fill: black;
`;

const EconomicViews = styled(View)`
  flex: 1;
  justify-content: space-between;
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

const CommuteView = styled(View)`
  flex-direction: row;
  width: 600px;
`;
const CommuteColumn = styled(View)`
  flex: 1;
  justify-content: space-around;
`;
