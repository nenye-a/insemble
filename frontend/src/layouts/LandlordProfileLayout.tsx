import React, { ReactNode } from 'react';

import ProfileLayout from './ProfileLayout';
import { Role } from '../types/types';

type Props = {
  children: ReactNode;
};

export default function LandlordProfileLayout(props: Props) {
  return <ProfileLayout role={Role.LANDLORD}>{props.children}</ProfileLayout>;
}
