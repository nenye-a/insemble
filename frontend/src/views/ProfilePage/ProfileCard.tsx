import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks';

import { View, Card, Avatar, Text, Button, LoadingIndicator, Dropzone } from '../../core-ui';
import { FONT_SIZE_LARGE, FONT_WEIGHT_BOLD } from '../../constants/theme';
import {
  THEME_COLOR,
  RED_TEXT,
  BACKGROUND_COLOR,
  WHITE,
  BUTTON_BORDER_COLOR,
} from '../../constants/colors';
import ProfileMenuList from './ProfileMenuList';
import { GetTenantProfile } from '../../generated/GetTenantProfile';
import {
  GET_TENANT_PROFILE,
  GET_LANDLORD_PROFILE,
  EDIT_TENANT_PROFILE,
  EDIT_LANDLORD_PROFILE,
} from '../../graphql/queries/server/profile';
import { logout } from '../../utils/authorization';
import { Role } from '../../types/types';
import { GetLandlordProfile } from '../../generated/GetLandlordProfile';
import { getImageBlob } from '../../utils';
import { EditTenantProfile, EditTenantProfileVariables } from '../../generated/EditTenantProfile';
import {
  EditLandlordProfile,
  EditLandlordProfileVariables,
} from '../../generated/EditLandlordProfile';
import { FileWithPreview } from '../../core-ui/Dropzone';

type Props = {
  role: Role;
};

type Profile = {
  name: string;
  company: string;
  title: string | null;
  avatar: string | null;
};

export default function ProfileCard(props: Props) {
  let { role } = props;
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

  let { loading: tenantLoading, data: tenantData, refetch: refetchTenantProfile } = useQuery(
    GET_TENANT_PROFILE,
    {
      notifyOnNetworkStatusChange: true,
      skip: role === Role.LANDLORD,
    }
  );

  let { loading: landlordLoading, data: landlordData, refetch: refetchLandlordProfile } = useQuery(
    GET_LANDLORD_PROFILE,
    {
      notifyOnNetworkStatusChange: true,
      skip: role === Role.TENANT,
    }
  );
  let [editTenantProfile, { loading: editTenantLoading }] = useMutation<
    EditTenantProfile,
    EditTenantProfileVariables
  >(EDIT_TENANT_PROFILE, {
    onCompleted: () => {
      refetchTenantProfile();
    },
  });

  let [editLandlordProfile, { loading: editLandlordLoading }] = useMutation<
    EditLandlordProfile,
    EditLandlordProfileVariables
  >(EDIT_LANDLORD_PROFILE, {
    onCompleted: () => {
      refetchLandlordProfile();
    },
  });

  useEffect(() => {
    if (role === Role.TENANT && tenantData) {
      onTenantCompleted(tenantData);
    } else if (role === Role.LANDLORD && landlordData) {
      onLandlordCompleted(landlordData);
    }
  }, [role, landlordData, tenantData]);

  let editAvatar = (file: FileWithPreview) => {
    let avatarBlob = getImageBlob(file.file);

    if (role === Role.TENANT) {
      editTenantProfile({
        variables: {
          profile: {
            avatar: avatarBlob,
          },
        },
        refetchQueries: [
          {
            query: GET_TENANT_PROFILE,
          },
        ],
      });
    } else if (role === Role.LANDLORD && landlordData) {
      editLandlordProfile({
        variables: {
          profile: {
            avatar: avatarBlob,
          },
        },
        refetchQueries: [
          {
            query: GET_LANDLORD_PROFILE,
          },
        ],
      });
    }
  };

  return (
    <CardContainer>
      {tenantLoading || landlordLoading ? (
        <LoadingIndicator />
      ) : (
        <ProfileWrapper>
          <ProfilePicture size="large" image={avatar} />
          <Dropzone
            loading={editLandlordLoading || editTenantLoading}
            isAvatar={true}
            getPreview={editAvatar}
            containerStyle={{
              position: 'absolute',
              height: 35,
              width: 35,
              top: -35,
              right: -60,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '50%',
              backgroundColor: WHITE,
              borderWidth: 0.3,
              borderColor: BUTTON_BORDER_COLOR,
              boxShadow: '0px 2px 6px 0px rgba(0, 0, 0, 0.3)',
            }}
          />
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
          if (role === Role.TENANT) {
            history.push('/');
          } else {
            history.push('/landlord/login');
          }
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
