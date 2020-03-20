import React from 'react';
import { Role } from '../types/types';
import RedirectLogin from './RedirectLogin';

export default function RedirectLoginLandlord() {
  return <RedirectLogin role={Role.LANDLORD} />;
}
