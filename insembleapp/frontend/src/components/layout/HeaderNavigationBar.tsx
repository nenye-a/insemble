import React from 'react';
import styled from 'styled-components';
import InsembleLogo from '../common/InsembleLogo';
import { WHITE, HEADER_BORDER_COLOR } from '../../constants/colors';
import TouchableOpacity from '../../core-ui/TouchableOpacity';

export default function HeaderNavigationBar() {
  return (
    <Container>
      <TouchableOpacity href="/">
        <InsembleLogo />
      </TouchableOpacity>

      {/* TODO: add button sign up */}
    </Container>
  );
}

const Container = styled('div')`
  display: flex;
  width: 100%;
  height: 65px;
  background-color: ${WHITE};
  border-bottom-color: ${HEADER_BORDER_COLOR};
  border-bottom-width: 1;
  padding: 20px 36px;
  position: sticky;
  top: 0px;
  z-index: 99;
`;
