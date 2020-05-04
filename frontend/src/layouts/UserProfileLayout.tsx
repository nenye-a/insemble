import React, { ReactNode } from 'react';

import ProfileLayout from './ProfileLayout';
import { Role } from '../types/types';
import Footer from '../views/LandingPage/Footer';

type Props = {
  children: ReactNode;
  showFooter?: boolean;
};

export default function UserProfileLayout({ showFooter, children }: Props) {
  return (
    <>
      <ProfileLayout role={Role.TENANT}>{children}</ProfileLayout>
      {showFooter && <Footer />}
    </>
  );
}
