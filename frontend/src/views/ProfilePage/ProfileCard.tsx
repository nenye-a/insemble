import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQuery, useApolloClient } from '@apollo/react-hooks';

import { View, Card, Avatar, Text, Button, LoadingIndicator } from '../../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import { THEME_COLOR, RED_TEXT, BACKGROUND_COLOR } from '../../constants/colors';
import ProfileMenuList from './ProfileMenuList';
import { GetTenantProfile } from '../../generated/GetTenantProfile';
import { GET_TENANT_PROFILE } from '../../graphql/queries/server/profile';
import asyncStorage from '../../utils/asyncStorage';
import { Role } from '../../types/types';

type Props = {
  role: Role;
};

export default function ProfileCard({ role }: Props) {
  let name = '';
  let company = '';
  let title = '';

  let { loading, data } = useQuery<GetTenantProfile>(GET_TENANT_PROFILE, {
    notifyOnNetworkStatusChange: true,
  });
  let history = useHistory();
  let client = useApolloClient();

  if (role === Role.TENANT) {
    name = data?.profileTenant.firstName + ' ' + data?.profileTenant.lastName;
    company = data?.profileTenant.company || '';
    title = data?.profileTenant.title || '';
  } else {
    // TODO
    name = 'Armand Jacobs';
    company = 'Landlord.com';
    title = 'Landlord';
  }

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

      <ProfileMenuList role={role} />
      <SignOutButton
        text="Sign Out"
        onPress={async () => {
          await asyncStorage.removeRole();
          await asyncStorage.removeTenantToken();
          await asyncStorage.removeBrandId();
          history.push('/');
          await client.resetStore();
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
