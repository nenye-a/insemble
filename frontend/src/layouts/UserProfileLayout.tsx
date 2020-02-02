import React, { ReactNode } from 'react';
import styled from 'styled-components';

import { View } from '../core-ui';
import ProfileCard from '../views/ProfilePage/ProfileCard';

type Props = {
  children: ReactNode;
};

export default function UserProfileLayout(props: Props) {
  return (
    <Container>
      <ProfileCard name="Armand Jacobs" company="John Cooper Works" position="Manager" />
      <Spacing />
      {props.children}
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  padding: 24px 10vw;
`;

const Spacing = styled(View)`
  width: 24px;
`;
