import React, { useState, ReactNode } from 'react';
import styled from 'styled-components';

import { View } from '../core-ui';
import ProfileCard from '../views/ProfilePage/ProfileCard';
import { Menu } from '../views/ProfilePage/ProfileMenuList';

type Props = {
  children: ReactNode;
};

export default function UserProfileLayout(props: Props) {
  // let [selectedMenu, setSelectedMenu] = useState<Menu>('Profile');

  return (
    <Container>
      <ProfileCard
        name="Armand Jacobs"
        company="John Cooper Works"
        position="Manager"
        // onMenuPress={(value) => setSelectedMenu(value)}
        // selectedMenu={selectedMenu}
      />
      <Spacing />
      {props.children}
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  padding: 24px min(200px, 10vw);
`;

const Spacing = styled(View)`
  width: 24px;
`;
