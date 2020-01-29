import React from 'react';
import styled from 'styled-components';
import { View, Card, Avatar, Text, Button } from '../../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import { THEME_COLOR, RED_TEXT, BACKGROUND_COLOR } from '../../constants/colors';
import ProfileMenuList, { Menu } from './ProfileMenuList';

type Props = {
  name: string;
  company: string;
  position: string;
  avatar?: string;
  onMenuPress: (selectedMenu: Menu) => void;
  selectedMenu: Menu;
};

export default function ProfileCard(props: Props) {
  let { name, company, position, avatar, onMenuPress, selectedMenu } = props;
  return (
    <Container>
      <ProfileWrapper>
        <ProfilePicture size="large" src={avatar} />
        <ProfileText fontSize={FONT_SIZE_LARGE} fontWeight={FONT_WEIGHT_BOLD} color={THEME_COLOR}>
          {name}
        </ProfileText>
        <ProfileText>{company}</ProfileText>
        <ProfileText>{position}</ProfileText>
      </ProfileWrapper>
      <ProfileMenuList onMenuPress={onMenuPress} selectedMenu={selectedMenu} />
      <SignOutButton text="Sign Out" />
    </Container>
  );
}

const Container = styled(Card)`
  width: 242px;
  height: fit-content;
`;

const ProfileWrapper = styled(View)`
  padding: 32px 0 12px 0;
  align-items: center;
`;

const ProfilePicture = styled(Avatar)`
  margin-bottom: 24px;
`;

const ProfileText = styled(Text)`
  line-height: 2;
`;

const SignOutButton = styled(Button)`
  border-radius: 0;
  background-color: ${BACKGROUND_COLOR};
  ${Text} {
    color: ${RED_TEXT};
  }
`;
