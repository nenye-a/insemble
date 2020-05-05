import React, { ReactNode } from 'react';

import ProfileLayout from './ProfileLayout';
import { Role } from '../types/types';
import FreeTrialBanner from '../components/layout/FreeTrialBanner';

type Props = {
  children: ReactNode;
  showBanner?: boolean;
};

export default function LandlordProfileLayout({ showBanner, children }: Props) {
  return (
    <>
      {showBanner && <FreeTrialBanner />}
      <ProfileLayout role={Role.LANDLORD}>{children}</ProfileLayout>
    </>
  );
}
