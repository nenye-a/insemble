import React from 'react';
import styled from 'styled-components';
<<<<<<< HEAD
import { useHistory } from 'react-router-dom';
import { View, Card, Avatar, Text, Button } from '../../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import { THEME_COLOR, RED_TEXT, BACKGROUND_COLOR } from '../../constants/colors';
import ProfileMenuList from './ProfileMenuList';
import asyncStorage from '../../utils/asyncStorage';
=======
import { useQuery } from '@apollo/react-hooks';

import { View, Card, Avatar, Text, Button, LoadingIndicator } from '../../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import { THEME_COLOR, RED_TEXT, BACKGROUND_COLOR } from '../../constants/colors';
import ProfileMenuList from './ProfileMenuList';
import { GetTenantProfile } from '../../generated/GetTenantProfile';
import { GET_TENANT_PROFILE } from '../../graphql/queries/server/profile';
>>>>>>> connect profile card

export default function ProfileCard() {
  let { loading, data } = useQuery<GetTenantProfile>(GET_TENANT_PROFILE, {
    notifyOnNetworkStatusChange: true,
  });
  let name = data?.profileTenant.firstName + ' ' + data?.profileTenant.lastName;
  let company = data?.profileTenant.company || '';
  let title = data?.profileTenant.title || '';

<<<<<<< HEAD
export default function ProfileCard(props: Props) {
  let { name, company, position, avatar } = props;
  let history = useHistory();
=======
>>>>>>> connect profile card
  return (
    <Container>
      {loading ? (
        <LoadingIndicator />
      ) : (
        <ProfileWrapper>
          <ProfilePicture size="large" image={data?.profileTenant.avatar} />
          <ProfileText fontSize={FONT_SIZE_LARGE} fontWeight={FONT_WEIGHT_BOLD} color={THEME_COLOR}>
            {name}
          </ProfileText>
          <ProfileText>{company}</ProfileText>
          <ProfileText>{title}</ProfileText>
        </ProfileWrapper>
      )}

      <ProfileMenuList />
      <SignOutButton
        text="Sign Out"
        onPress={async () => {
          await asyncStorage.removeRole();
          await asyncStorage.removeTenantToken();
          await asyncStorage.removeBrandId();
          history.push('/');
        }}
      />
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
