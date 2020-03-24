import React from 'react';
import { Role } from '../types/types';
import RedirectLogin from './RedirectLogin';

export default function RedirectLoginTenant() {
  return <RedirectLogin role={Role.TENANT} />;
}
