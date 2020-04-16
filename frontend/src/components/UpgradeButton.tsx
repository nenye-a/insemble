import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from '../core-ui';
import SvgLock from './icons/lock';
import { WHITE } from '../constants/colors';

export default function UpgradeButton() {
  let history = useHistory();
  return (
    <>
      <SvgLock style={{ marginLeft: 14, marginRight: 20 }} />
      <Button
        textProps={{ style: { color: WHITE } }}
        size="small"
        text="Upgrade to Access"
        onPress={() => history.push('/user/plan')}
      />
    </>
  );
}
