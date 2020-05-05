import React, { ReactNode } from 'react';

import ProfileLayout from './ProfileLayout';
import { Role } from '../types/types';

type Props = {
  children: ReactNode;
};

export default function UserProfileLayout({ children }: Props) {
  return <ProfileLayout role={Role.TENANT}>{children}</ProfileLayout>;
}
