import React from 'react';
import styled from 'styled-components';
import Joyride, { STATUS, Step } from 'react-joyride';

import { View, Text } from '../../core-ui';
import { THEME_COLOR } from '../../constants/colors';
import { FONT_FAMILY_NORMAL } from '../../constants/theme';

type Props = {
  showGuide: boolean;
  onTourFinishedOrSkipped: (showGuide: boolean) => void;
};

export default function MapTour(props: Props) {
  let { showGuide, onTourFinishedOrSkipped } = props;
  let steps: Array<Step> = [
    {
      target: '.heat-map-example',
      content: (
        <View>
          <FullWidthImage
            src="https://d3v63q50apccnu.cloudfront.net/instructional+photos/heat-map-tour.png"
            alt=""
          />
          <Text>Insemble generates a heatmap of recommended locations based on your search.</Text>
        </View>
      ),
      placement: 'center',
    },
    {
      target: '.search-box',
      content: <Text>Search existing locations, brands, or brand types of interest.</Text>,
      placement: 'top',
    },
    {
      target: '.marker-example',
      content: (
        <View>
          <FullWidthImage
            src="https://d3v63q50apccnu.cloudfront.net/instructional+photos/marker-tour.png"
            alt=""
          />
          <Text>
            Click to see important information about interesting locations. Click again to dive
            deeper.
          </Text>
        </View>
      ),
      placement: 'center',
    },
  ];
  return (
    <>
      <Joyride
        steps={steps}
        scrollToFirstStep={true}
        continuous={true}
        run={showGuide}
        showSkipButton={true}
        styles={{
          options: {
            zIndex: 10000,
            primaryColor: THEME_COLOR,
          },
          tooltipContent: {
            paddingBottom: 0,
          },
          buttonNext: {
            fontFamily: FONT_FAMILY_NORMAL,
          },
          buttonBack: {
            fontFamily: FONT_FAMILY_NORMAL,
          },
          buttonSkip: {
            fontFamily: FONT_FAMILY_NORMAL,
          },
        }}
        callback={({ status }) => {
          if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
            onTourFinishedOrSkipped(false);
          }
        }}
        locale={{ last: 'Done' }}
        spotlightClicks={false}
      />
      {showGuide && <View className="marker-example heat-map-example empty-container" />}
    </>
  );
}

const FullWidthImage = styled.img`
  object-fit: contain;
  width: 100%;
  margin: 10px 0;
`;
