import React, { ReactNode } from 'react';

import ProfileLayout from './ProfileLayout';

type Props = {
  children: ReactNode;
};

export default function LandlordProfileLayout(props: Props) {
  return <ProfileLayout role="landlord">{props.children}</ProfileLayout>;
}
