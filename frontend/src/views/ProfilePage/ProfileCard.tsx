import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useApolloClient, useLazyQuery } from '@apollo/react-hooks';

import { View, Card, Avatar, Text, Button, LoadingIndicator } from '../../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import { THEME_COLOR, RED_TEXT, BACKGROUND_COLOR } from '../../constants/colors';
import ProfileMenuList from './ProfileMenuList';
import { GetTenantProfile } from '../../generated/GetTenantProfile';
import { GET_TENANT_PROFILE, GET_LANDLORD_PROFILE } from '../../graphql/queries/server/profile';
import asyncStorage from '../../utils/asyncStorage';
import { Role } from '../../types/types';
import { GetLandlordProfile } from '../../generated/GetLandlordProfile';

type Props = {
  role: Role;
};

type Profile = {
  name: string;
  company: string;
  title: string | null;
  avatar: string | null;
};

export default function ProfileCard({ role }: Props) {
  let [{ name, company, title, avatar }, setProfileInfo] = useState<Profile>({
    name: '',
    company: '',
    title: '',
    avatar: null,
  });

  let onTenantCompleted = (tenantResult: GetTenantProfile) => {
    setProfileInfo({
      name: tenantResult?.profileTenant.firstName + ' ' + tenantResult?.profileTenant.lastName,
      company: tenantResult?.profileTenant.company,
      title: tenantResult?.profileTenant.title,
      avatar: tenantResult?.profileTenant.avatar,
    });
  };

  let onLandlordCompleted = (landlordResult: GetLandlordProfile) => {
    setProfileInfo({
      name:
        landlordResult?.profileLandlord.firstName + ' ' + landlordResult?.profileLandlord.lastName,
      company: landlordResult?.profileLandlord.company,
      title: landlordResult?.profileLandlord.title,
      avatar: landlordResult?.profileLandlord.avatar,
    });
  };

  let [getTenant, { loading: tenantLoading }] = useLazyQuery<GetTenantProfile>(GET_TENANT_PROFILE, {
    onCompleted: onTenantCompleted,
  });

  let [getLandlord, { loading: landlordLoading }] = useLazyQuery<GetLandlordProfile>(
    GET_LANDLORD_PROFILE,
    {
      onCompleted: onLandlordCompleted,
    }
  );

  useEffect(() => {
    if (role === Role.TENANT) {
      getTenant();
    }
    if (role === Role.LANDLORD) {
      getLandlord();
    }
  }, [getLandlord, getTenant, role]);

  let history = useHistory();
  let client = useApolloClient();

  return (
    <Container>
      {tenantLoading || landlordLoading ? (
        <LoadingIndicator />
      ) : (
        <ProfileWrapper>
          <ProfilePicture size="large" image={avatar} />
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
