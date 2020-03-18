import React from 'react';
import styled, { css } from 'styled-components';

import { View, Text, TouchableOpacity } from '../../core-ui';

import { useViewport } from '../../utils';
import { BLACK, WHITE } from '../../constants/colors';
import { SUPPORT_EMAIL } from '../../constants/app';
import { VIEWPORT_TYPE } from '../../constants/viewports';

type ViewWithViewportType = ViewProps & {
  isDesktop: boolean;
};

export default function Footer() {
  let { viewportType } = useViewport();
  let isDesktop = viewportType === VIEWPORT_TYPE.DESKTOP;

  return (
    <Container isDesktop={isDesktop}>
      <TouchableOpacity href={`mailto:${SUPPORT_EMAIL}`}>
        <WhiteText>Contact us!</WhiteText>
      </TouchableOpacity>
      <CopyrightContainer isDesktop={isDesktop}>
        <WhiteText>@2020 Insemble</WhiteText>
        <WhiteText>Insemble Inc. All Rights Reserved.</WhiteText>
      </CopyrightContainer>
    </Container>
  );
}

const Container = styled(View)<ViewWithViewportType>`
  align-items: center;
  background-color: ${BLACK};
  padding: 20px 5vw;
  height: 160px;
  ${({ isDesktop }) =>
    isDesktop
      ? css`
          flex-direction: row;
          justify-content: space-between;
        `
      : css`
          flex-direction: column;
          justify-content: center;
        `}
`;

const CopyrightContainer = styled(View)<ViewWithViewportType>`
  ${({ isDesktop }) =>
    !isDesktop
      ? css`
          align-items: center;
          padding-top: 35px;
        `
      : css`
          align-items: flex-end;
        `}
`;

const WhiteText = styled(Text)`
  color: ${WHITE};
`;
