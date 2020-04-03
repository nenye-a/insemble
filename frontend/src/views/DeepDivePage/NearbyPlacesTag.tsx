import React from 'react';
import styled, { css } from 'styled-components';

import { View, Text } from '../../core-ui';
import { TAG_BACKGROUND, THEME_COLOR } from '../../constants/colors';
import { DEFAULT_BORDER_RADIUS, FONT_WEIGHT_MEDIUM, FONT_SIZE_SMALL } from '../../constants/theme';
import { ViewPropsWithViewport } from '../../constants/viewports';
import { useViewport } from '../../utils';

type Props = ViewProps & {
  content: string | number | null;
  postfix: string;
};

export default function NearbyPlacesTag(props: Props) {
  let { postfix, content, ...otherProps } = props;
  let { isDesktop } = useViewport();
  return (
    <Container isDesktop={isDesktop} {...otherProps}>
      <Text color={THEME_COLOR} fontWeight={FONT_WEIGHT_MEDIUM} fontSize={FONT_SIZE_SMALL}>
        {content}
        <Text fontSize={FONT_SIZE_SMALL}> {postfix}</Text>
      </Text>
    </Container>
  );
}

const Container = styled(View)<ViewPropsWithViewport>`
  justify-content: center;
  align-items: center;
  padding: 6px 8px;
  background-color: ${TAG_BACKGROUND};
  border-radius: ${DEFAULT_BORDER_RADIUS};
  ${({ isDesktop }) =>
    isDesktop
      ? css`
          margin: 4px auto 4px 0px;
        `
      : css`
          margin: 2px 2px 2px 0px;
        `}
`;
