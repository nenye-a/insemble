import React from 'react';
import { useHistory } from 'react-router-dom';

import { Button } from '../core-ui';
import SvgLock from './icons/lock';
import { WHITE } from '../constants/colors';
import { Role } from '../types/types';
import { useCredentials } from '../utils';

export default function UpgradeButton() {
  let history = useHistory();
  let { role } = useCredentials();
  let location =
    role === Role.TENANT ? '/user/plan' : role === Role.LANDLORD ? '/landlord/billing' : '/';
  return (
    <>
      <SvgLock style={{ marginLeft: 14, marginRight: 20 }} />
      <Button
        textProps={{ style: { color: WHITE } }}
        size="small"
        text="Upgrade to Access"
        onPress={() => history.push(location)}
      />
    </>
  );
}
