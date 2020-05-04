import React from 'react';
import styled, { css } from 'styled-components';

import { View, Text, TouchableOpacity } from '../../core-ui';

import { useViewport } from '../../utils';
import { BLACK, WHITE } from '../../constants/colors';
import { SUPPORT_EMAIL, PRIVACY_POLICY_PDF, TERMS_OF_SERVICE_PDF } from '../../constants/app';
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
      <Row isDesktop={isDesktop}>
        <CopyrightContainer isDesktop={isDesktop}>
          <TouchableOpacity href={TERMS_OF_SERVICE_PDF} target="_blank">
            <WhiteText>Terms of Service</WhiteText>
          </TouchableOpacity>
          <TouchableOpacity href={PRIVACY_POLICY_PDF} target="_blank">
            <WhiteText>Privacy Policy</WhiteText>
          </TouchableOpacity>
        </CopyrightContainer>
        <CopyrightContainer isDesktop={isDesktop}>
          <WhiteText>@2020 Insemble</WhiteText>
          <WhiteText>Insemble Inc. All Rights Reserved.</WhiteText>
        </CopyrightContainer>
      </Row>
    </Container>
  );
}

const Row = styled(View)<ViewWithViewportType>`
  flex-direction: ${({ isDesktop }) => (isDesktop ? 'row' : 'column')};
`;
const Container = styled(View)<ViewWithViewportType>`
  align-items: center;
  background-color: ${BLACK};
  padding: 20px 5vw;
  bottom: 0;
  width: 100%;
  height: 140px;
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
          padding-top: 20px;
        `
      : css`
          align-items: flex-end;
          padding-left: 35px;
        `}
`;

const WhiteText = styled(Text)`
  color: ${WHITE};
`;
