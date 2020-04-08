import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Button, Text } from '../core-ui';
import { WHITE } from '../constants/colors';
import SvgLock from './icons/lock';

export default function UpgradeAlert() {
  let history = useHistory();
  return (
    <>
      <SvgLock style={{ marginLeft: 14, marginRight: 20 }} />
      <UpgradeButton text="Upgrade to Access" onPress={() => history.push('/user/plan')} />
    </>
  );
}

const UpgradeButton = styled(Button)`
  ${Text} {
    color: ${WHITE};
  }
`;
