import React from 'react';
import { TOUR_SHRINK_HEIGHT, TOUR_DEFAULT_HEIGHT } from '../../constants/theme';

type Props = {
  tourSource?: string;
  placeholder?: string;
  isShrink: boolean;
};

export default function VirtualTour(props: Props) {
  let { tourSource, placeholder, isShrink } = props;

  let style = {
    transition: '0.3s height linear',
    height: isShrink ? TOUR_SHRINK_HEIGHT : TOUR_DEFAULT_HEIGHT,
    width: '100%',
    'object-fit': 'cover',
  };
  if (tourSource) {
    return <iframe frameBorder={0} allowFullScreen src={tourSource} style={style} />;
  } else if (placeholder) {
    return <img src={placeholder} style={style} />;
  }
  return null;
}
