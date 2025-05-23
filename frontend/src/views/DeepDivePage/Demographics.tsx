import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

import { View, Text, Card, SegmentedControl } from '../../core-ui';
import { CarouselFilter, UpgradeButton, EmptyDataComponent } from '../../components';
import SvgGreenArrow from '../../components/icons/green-arrow';
import SvgRedArrow from '../../components/icons/red-arrow';
import DemographicsLegend from './DemographicsLegend';
import {
  HOVERED_LIST_ITEM_BG,
  THEME_COLOR,
  RED_TEXT,
  GREEN_TEXT,
  LIGHT_GREY,
  DARK_TEXT_COLOR,
} from '../../constants/colors';
import {
  FONT_WEIGHT_BOLD,
  FONT_SIZE_MEDIUM,
  FONT_FAMILY_NORMAL,
  FONT_SIZE_NORMAL,
  FONT_SIZE_SMALL,
} from '../../constants/theme';
import { roundDecimal, convertToKilos, formatSnakeCaseLabel } from '../../utils';
import BlurredDemographics from '../../assets/images/blurred-demographics.png';
import { LocationDetails_locationDetails_result_demographics1 as LocationDetailsDemographics } from '../../generated/LocationDetails';
import { PropertyLocationDetails_propertyDetails_demographics1 as PropertyDetailsDemographics } from '../../generated/PropertyLocationDetails';
import { TenantDetail_tenantDetail_insightView_demographics1 as TenantDetailsDemographics } from '../../generated/TenantDetail';

//TODO Improve Typing for data
type DemographicsStatus = {
  name: string;
  curLocation?: number;
  targetLocation?: number;
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

type Props = ViewProps & {
  withMargin?: boolean;
  isLocked?: boolean;
  demographicsData?: Array<
    | LocationDetailsDemographics
    | PropertyDetailsDemographics
    | TenantDetailsDemographics
    | undefined
    | null
  >;
};

function hasGrowth(
  data: LocationDetailsDemographics | PropertyDetailsDemographics | TenantDetailsDemographics
): data is LocationDetailsDemographics {
  return (data as LocationDetailsDemographics).age[0].growth !== undefined;
}

export default function Graphic(props: Props) {
  let { demographicsData, withMargin, isLocked, ...otherProps } = props;
  let [activeIndex, setActiveIndex] = useState<number>(0);
  let [selectedFilter, setSelectedFilter] = useState<string>('Age');
  let chartContainerRef = useRef<HTMLDivElement | null>(null);
  let options = ['Age', 'Income', 'Ethnicity', 'Education', 'Gender'];
  let dataActiveIndex = demographicsData && demographicsData[activeIndex];

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
    if (dataActiveIndex && hasGrowth(dataActiveIndex)) {
      let demographicsData =
        dataActiveIndex && dataActiveIndex[selectedFilter.toLocaleLowerCase() as DataKey][index];
      return (
        <>
          {demographicsData?.growth && demographicsData.growth !== 0 && (
            <>
              {demographicsData.growth > 0 ? (
                <>
                  <SvgGreenArrow x={x + width / 2 - 5} y={5} />
                  <LabelText fill={GREEN_TEXT} x={x + width / 2 + 16} y={25}>
                    {roundDecimal(demographicsData.growth, 2) + '%'}
                  </LabelText>
                </>
              ) : (
                <>
                  <SvgRedArrow x={x + width / 2 - 5} y={5} />
                  <LabelText fill={RED_TEXT} x={x + width / 2 + 16} y={25}>
                    {roundDecimal(demographicsData.growth, 2) + '%'}
                  </LabelText>
                </>
              )}
            </>
          )}
          {value && (
            <LabelText x={x + width / 2} y={y} fill={THEME_COLOR} textAnchor="middle" dy={-6}>
              {/* TODO: Adjust roundDecimal */}
              {roundDecimal(convertToKilos(value), 0) + 'K'}
            </LabelText>
          )}
        </>
      );
    } else {
      return (
        <LabelText x={x + width / 2} y={y} fill={THEME_COLOR} textAnchor="middle" dy={-6}>
          {/* TODO: Adjust roundDecimal */}
          {roundDecimal(convertToKilos(value || 0), 0) + 'K'}
        </LabelText>
      );
    }
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
        {/* TODO: Adjust roundDecimal */}
        {`${value ? roundDecimal(convertToKilos(value), 0) + 'K' : ''}`}
      </LabelText>
    );
  };

  let content = (
    <>
      <RowedView>
        <Row>
          <Title>Demographics</Title>
          {isLocked ? <UpgradeButton /> : null}
        </Row>

        {isLocked ? null : (
          <RightTitleContainer>
            <Text>Radius</Text>
            <Segmented
              onPress={(index: number) => setActiveIndex(index)}
              options={['1 mile', '3 miles', '5 miles']}
              selectedIndex={activeIndex}
            />
          </RightTitleContainer>
        )}
      </RowedView>
      {isLocked ? (
        <Image src={BlurredDemographics} />
      ) : (
        <>
          <RowedView>
            <DemographicsLegend />
            {/* hiding this until data is ready */}
            {/* <RowedView style={{ margin: 0 }}>
   <Text>Population: </Text>
   <PopulationText>k</PopulationText>
 </RowedView> */}
          </RowedView>
          {dataActiveIndex ? (
            <ChartContainer flex ref={chartContainerRef}>
              <BarChart
                width={chartContainerRef.current?.clientWidth || 720}
                height={400}
                data={
                  dataActiveIndex && dataActiveIndex[selectedFilter.toLocaleLowerCase() as DataKey]
                }
              >
                <XAxis
                  dataKey="name"
                  tickFormatter={formatSnakeCaseLabel}
                  tick={{ color: LIGHT_GREY, fontSize: FONT_SIZE_SMALL, fontFamily: 'Avenir' }}
                />
                <YAxis
                  axisLine={false}
                  tick={{ color: LIGHT_GREY, fontSize: FONT_SIZE_SMALL, fontFamily: 'Avenir' }}
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
                    value: 'Population',
                    angle: -90,
                    x: -100,
                    position: 'insideLeft',
                    style: { fill: DARK_TEXT_COLOR, fontFamily: 'Avenir' },
                  }}
                />
                <Bar
                  dataKey="targetLocation"
                  barSize={24}
                  fill={THEME_COLOR}
                  label={renderCustomBarLabel}
                  radius={[5, 5, 0, 0]}
                />
                <Bar
                  dataKey="myLocation"
                  barSize={24}
                  fill={HOVERED_LIST_ITEM_BG}
                  label={renderCustomSecondBarLabel}
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <EmptyDataComponent />
          )}
          <CarouselFilter
            selectedOption={selectedFilter}
            options={options}
            onSelectionChange={(value) => {
              setSelectedFilter(value);
            }}
          />
        </>
      )}
    </>
  );

  return withMargin ? (
    <Container flex {...otherProps}>
      {content}
    </Container>
  ) : (
    <ViewContainer flex {...otherProps}>
      {content}
    </ViewContainer>
  );
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

const RightTitleContainer = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const Segmented = styled(SegmentedControl)`
  margin-left: 12px;
  width: 230px;
`;

const Title = styled(Text)`
  font-size: ${FONT_SIZE_MEDIUM};
  font-weight: ${FONT_WEIGHT_BOLD};
`;

const LabelText = styled.text`
  font-family: ${FONT_FAMILY_NORMAL};
  font-size: ${FONT_SIZE_NORMAL};
  z-index: 10;
`;

// const PopulationText = styled(Text)`
//   font-weight: ${FONT_WEIGHT_MEDIUM};
// `;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
`;

const Row = styled(View)`
  flex-direction: row;
  align-items: center;
`;
