import React, { ReactNode } from 'react';

import ProfileLayout from './ProfileLayout';

type Props = {
  children: ReactNode;
};

export default function UserProfileLayout(props: Props) {
  return <ProfileLayout role="tenant">{props.children}</ProfileLayout>;
}
