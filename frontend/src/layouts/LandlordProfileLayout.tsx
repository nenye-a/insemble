import React, { ReactNode } from 'react';

import ProfileLayout from './ProfileLayout';
import { Role } from '../types/types';
import FreeTrialBanner from '../components/layout/FreeTrialBanner';
import Footer from '../views/LandingPage/Footer';

type Props = {
  children: ReactNode;
  showBanner?: boolean;
  showFooter?: boolean;
};

export default function LandlordProfileLayout({ showBanner, showFooter, children }: Props) {
  return (
    <>
      {showBanner && <FreeTrialBanner />}
      <ProfileLayout role={Role.LANDLORD}>{children}</ProfileLayout>
      {showFooter && <Footer />}
    </>
  );
}
