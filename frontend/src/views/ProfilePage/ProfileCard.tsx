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
import { logout } from '../../utils/authorization';
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
  let history = useHistory();
  let client = useApolloClient();

  let [{ name, company, title, avatar }, setProfileInfo] = useState<Profile>({
    name: '',
    company: '',
    title: '',
    avatar: null,
  });

  let onTenantCompleted = (tenantResult: GetTenantProfile) => {
    let { profileTenant } = tenantResult;
    if (profileTenant) {
      let { firstName, lastName, company, title, avatar } = profileTenant;
      setProfileInfo({
        name: firstName + ' ' + lastName,
        company,
        title,
        avatar,
      });
    }
  };

  let onLandlordCompleted = (landlordResult: GetLandlordProfile) => {
    let { profileLandlord } = landlordResult;
    if (profileLandlord) {
      let { firstName, lastName, company, title, avatar } = profileLandlord;
      setProfileInfo({
        name: firstName + ' ' + lastName,
        company,
        title,
        avatar,
      });
    }
  };

  let [getTenant, { loading: tenantLoading, data: tenantData }] = useLazyQuery<GetTenantProfile>(
    GET_TENANT_PROFILE,
    {
      notifyOnNetworkStatusChange: true,
    }
  );

  let [getLandlord, { loading: landlordLoading, data: landlordData }] = useLazyQuery<
    GetLandlordProfile
  >(GET_LANDLORD_PROFILE, {
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (role === Role.TENANT) {
      getTenant();
    }
    if (role === Role.LANDLORD) {
      getLandlord();
    }
  }, [getLandlord, getTenant, role]);

  useEffect(() => {
    if (role === Role.TENANT && tenantData) {
      onTenantCompleted(tenantData);
    } else if (role === Role.LANDLORD && landlordData) {
      onLandlordCompleted(landlordData);
    }
  }, [role, landlordData, tenantData]);

  return (
    <CardContainer>
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
          logout();
          history.push('/');
          await client.resetStore();
        }}
      />
    </CardContainer>
  );
}

const CardContainer = styled(Card)`
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
