import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import SvgGreenArrow from '../components/icons/green-arrow';
import SvgRedArrow from '../components/icons/red-arrow';
import Card from './Card';
import Legend from '../views/MapPage/Legend';
import { HOVERED_LIST_ITEM_BG, THEME_COLOR, RED_TEXT, GREEN_TEXT } from '../constants/colors';
import {
  FONT_WEIGHT_BOLD,
  FONT_SIZE_MEDIUM,
  FONT_FAMILY_NORMAL,
  FONT_SIZE_NORMAL,
} from '../constants/theme';
import SegmentedControl from './SegmentedControl';
import { View, Text } from '../core-ui';
import { CarouselFilter } from '../components';
import { DeepDiveContext } from '../views/DeepDivePage/DeepDiveModal';
import { roundDecimal, convertToKilos } from '../utils';

//TODO Improve Typing for data
type DemographicsStatus = {
  name: string;
  curLocation?: number;
  targetLocation: number;
  growth?: number;
};

type Data = {
  population: number;
  age: Array<DemographicsStatus>;
  income: Array<DemographicsStatus>;
  ethnicity: Array<DemographicsStatus>;
  education: Array<DemographicsStatus>;
  gender: Array<DemographicsStatus>;
};

type DataKey = Exclude<keyof Data, 'population'>;

type Props = {
  withMargin?: boolean;
};
export default function Graphic({ withMargin = true }: Props) {
  let data = useContext(DeepDiveContext);
  let [activeIndex, setActiveIndex] = useState<number>(0);
  let [selectedFilter, setSelectedFilter] = useState<string>('Age');
  let options = ['Age', 'Income', 'Ethnicity', 'Education', 'Gender'];
  let datas = [
    data?.result?.demographics1,
    data?.result?.demographics3,
    data?.result?.demographics5,
  ];
  let dataActiveIndex = datas[activeIndex];
  const renderCustomBarLabel = ({
    x,
    y,
    width,
    value,
    index,
  }: {
    index: number;
    x: number;
    y: number;
    width: number;
    value: number;
  }) => {
    let demographicData =
      dataActiveIndex && dataActiveIndex[selectedFilter.toLocaleLowerCase() as DataKey][index];
    return (
      <>
        {demographicData?.growth && demographicData.growth !== 0 && (
          <>
            {demographicData.growth > 0 ? (
              <>
                <SvgGreenArrow x={x + width / 2 - 5} y={5} />
                <LabelText fill={GREEN_TEXT} x={x + width / 2 + 16} y={25}>
                  {roundDecimal(demographicData.growth, 2) + '%'}
                </LabelText>
              </>
            ) : (
              <>
                <SvgRedArrow x={x + width / 2 - 5} y={5} />
                <LabelText fill={RED_TEXT} x={x + width / 2 + 16} y={25}>
                  {roundDecimal(demographicData.growth, 2) + '%'}
                </LabelText>
              </>
            )}
          </>
        )}
        {value && (
          <LabelText x={x + width / 2} y={y} fill={THEME_COLOR} textAnchor="middle" dy={-6}>
            {roundDecimal(convertToKilos(value)) + 'K'}
          </LabelText>
        )}
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
        {`${value ? roundDecimal(convertToKilos(value)) + 'K' : ''}`}
      </LabelText>
    );
  };

  let content = (
    <>
      <RowedView>
        <Title>Demographics</Title>
        <Segmented
          onPress={(index: number) => setActiveIndex(index)}
          options={['1 mile', '3 miles', '5 miles']}
          selectedIndex={activeIndex}
        />
      </RowedView>
      <RowedView>
        <Legend barGraph={true} />
        {/* hiding this until data is ready */}
        {/* <RowedView style={{ margin: 0 }}>
        <Text>Population: </Text>
        <PopulationText>k</PopulationText>
      </RowedView> */}
      </RowedView>
      <ChartContainer>
        <Chart
          width={700}
          height={400}
          data={dataActiveIndex && dataActiveIndex[selectedFilter.toLocaleLowerCase() as DataKey]}
        >
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={(value: number) =>
              value
                .toString()
                .slice(0, -3)
                .concat('K')
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
            dataKey="myLocation"
            barSize={24}
            fill={THEME_COLOR}
            label={renderCustomBarLabel}
            radius={[5, 5, 0, 0]}
          />
          <Bar
            dataKey="targetLocation"
            barSize={24}
            fill={HOVERED_LIST_ITEM_BG}
            label={renderCustomSecondBarLabel}
            radius={[5, 5, 0, 0]}
          />
        </Chart>
      </ChartContainer>

      <CarouselFilter
        selectedOption={selectedFilter}
        options={options}
        onSelectionChange={(value) => {
          setSelectedFilter(value);
        }}
      />
    </>
  );
  return withMargin ? <Container>{content}</Container> : <ViewContainer>{content}</ViewContainer>;
}

const ViewContainer = styled(View)`
  padding: 0 12px 12px 12px;
`;

const RowedView = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  margin: 16px 0 4px 0;
`;

const Container = styled(Card)`
  padding: 0 12px 12px 12px;
  margin: 18px 36px;
`;

const ChartContainer = styled(View)`
  justify-content: center;
  align-items: center;
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

// const PopulationText = styled(Text)`
//   font-weight: ${FONT_WEIGHT_MEDIUM};
// `;
