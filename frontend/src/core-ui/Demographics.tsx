import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import SvgGreenArrow from '../components/icons/green-arrow';
import SvgRedArrow from '../components/icons/red-arrow';
import Card from './Card';
import Legend from '../views/MapPage/Legend';
import { HOVERED_LIST_ITEM_BG, THEME_COLOR } from '../constants/colors';
import {
  FONT_WEIGHT_BOLD,
  FONT_SIZE_MEDIUM,
  FONT_FAMILY_NORMAL,
  FONT_SIZE_NORMAL,
  FONT_WEIGHT_MEDIUM,
} from '../constants/theme';
import SegmentedControl from './SegmentedControl';
import { View, Text } from '../core-ui';

type Props = {
  data: any;
  population: number;
};
export default function Graphic(props: Props) {
  let { population } = props;

  let data = [
    {
      name: '<18',
      values1: '10000',
      values2: '20000',
      populationUp: true,
    },
    {
      name: '18-24',
      values1: '20000',
      values2: '11000',
      populationUp: false,
    },
    {
      name: '25-44',
      values1: '10000',
      values2: '30000',
      populationUp: false,
    },
    {
      name: '45-54',
      values1: '22000',
      values2: '10000',
      populationUp: false,
    },
    {
      name: '65+',
      values1: '30000',
      values2: '15000',
      populationUp: true,
    },
  ];
  const renderCustomBarLabel = ({
    x,
    y,
    width,
    value,
  }: {
    x: number;
    y: number;
    width: number;
    value: number;
  }) => {
    return (
      //TODO Fix Population Arrow Indicator And Percentage Based On BE data
      <>
        {population ? (
          <SvgGreenArrow x={x + width / 2 - 5} y={5} />
        ) : (
          <SvgRedArrow x={x + width / 2 - 5} y={5} />
        )}
        <LabelText fill={population ? '#666' : 'red'} x={x + width / 2 + 16} y={25}>
          {'9' + '%'}
        </LabelText>
        <LabelText x={x + width / 2} y={y} fill={THEME_COLOR} textAnchor="middle" dy={-6}>
          {`${value
            .toString()
            .slice(0, value.toString().length - 3)
            .concat('k')}`}
        </LabelText>
      </>
    );
  };
  const renderCustomSecondBarLabel = ({
    x,
    y,
    width,
    value,
  }: {
    x: number;
    y: number;
    width: number;
    value: number;
  }) => {
    return (
      <LabelText x={x + width / 2} y={y} fill={THEME_COLOR} textAnchor="middle" dy={-6}>
        {`${value
          .toString()
          .slice(0, value.toString().length - 3)
          .concat('k')}`}
      </LabelText>
    );
  };

  return (
    <Container>
      <RowedView>
        <Title>Demographic</Title>
        <Segmented options={['1 mile', '3 miles', '5 miles']} selectedIndex={1} />
      </RowedView>
      <RowedView>
        <Legend barGraph={true} />
        <RowedView style={{ margin: 0 }}>
          <Text>Population: </Text>
          <PopulationText>{population}k</PopulationText>
        </RowedView>
      </RowedView>
      <Chart width={600} height={400} data={data}>
        <XAxis dataKey={'name'} />
        <YAxis
          tickFormatter={(value: number) =>
            value
              .toString()
              .slice(0, value.toString().length - 3)
              .concat('k')
          }
          domain={[0, (dataMax) => dataMax * 1.3]}
          padding={{ top: 50, bottom: 0 }}
          scale="linear"
          orientation="left"
          label={{
            value: 'population',
            angle: -90,
            x: -100,
            position: 'insideLeft',
          }}
        />
        <Bar
          dataKey="values1"
          barSize={24}
          fill={THEME_COLOR}
          label={renderCustomBarLabel}
          radius={[5, 5, 0, 0]}
        />
        <Bar
          dataKey="values2"
          barSize={24}
          fill={HOVERED_LIST_ITEM_BG}
          label={renderCustomSecondBarLabel}
          radius={[5, 5, 0, 0]}
        />
      </Chart>
      {/**TODO Add Filter */}
    </Container>
  );
}

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 16px 0 4px 0;
`;

const Container = styled(Card)`
  padding: 0 12px 0 12px;
  margin: 24px;
`;

const Segmented = styled(SegmentedControl)`
  width: 230px;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
`;

const Chart = styled(BarChart)`
  margin: 56px 0 0 0;
`;

const LabelText = styled.text`
  font-family: ${FONT_FAMILY_NORMAL};
  font-size: ${FONT_SIZE_NORMAL};
  z-index: 10;
`;

const PopulationText = styled(Text)`
  font-weight: ${FONT_WEIGHT_MEDIUM};
`;
