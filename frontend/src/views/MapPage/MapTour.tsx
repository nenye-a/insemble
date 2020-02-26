import React from 'react';
import Joyride, { STATUS, Step } from 'react-joyride';
import { THEME_COLOR } from '../../constants/colors';

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
        <div className="pt-2">
          <img
            className="mb-2 full-width-image"
            src="https://d3v63q50apccnu.cloudfront.net/instructional+photos/heat-map-tour.png"
            alt=""
          />
          <p className="text-center m-0">
            Insemble generates a heatmap of recommended locations based on your search.
          </p>
        </div>
      ),
      placement: 'center',
    },
    {
      target: '.search-box',
      content: (
        <p className="text-center m-0">
          Search existing locations, brands, or brand types of interest.
        </p>
      ),
      placement: 'top',
    },
    {
      target: '.marker-example',
      content: (
        <div className="pt-2">
          <img
            className="mb-2 full-width-image"
            src="https://d3v63q50apccnu.cloudfront.net/instructional+photos/marker-tour.png"
            alt=""
          />
          <p className="text-center m-0">
            Click to see important information about interesting locations. Click again to dive
            deeper.
          </p>
        </div>
      ),
      placement: 'center',
    },
  ];
  return (
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
      }}
      callback={({ status }) => {
        if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
          onTourFinishedOrSkipped(false);
        }
      }}
      locale={{ last: 'Done' }}
      spotlightClicks={false}
    />
  );
}
