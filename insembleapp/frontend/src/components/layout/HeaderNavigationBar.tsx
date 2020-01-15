import React from 'react';
import styled from 'styled-components';
import InsembleLogo from '../common/InsembleLogo';
import { TouchableOpacity, Button } from '../../core-ui';
import { WHITE, HEADER_BORDER_COLOR } from '../../constants/colors';
import { NAVBAR_HEIGHT } from '../../constants/theme';

export default function HeaderNavigationBar() {
  return (
    <Container>
      <TouchableOpacity href="/">
        <InsembleLogo />
      </TouchableOpacity>
      <Button text="Sign Up" />
    </Container>
  );
}

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: ${NAVBAR_HEIGHT};
  background-color: ${WHITE};
  box-shadow: 0px 1px 1px 0px ${HEADER_BORDER_COLOR};
  padding: 0px 36px;
  position: sticky;
  top: 0px;
  z-index: 99;
`;
