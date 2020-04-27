import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';

import InsembleLogo from '../common/InsembleLogo';
import { TouchableOpacity, Button, View, Avatar } from '../../core-ui';
import { WHITE, HEADER_BORDER_COLOR, THEME_COLOR } from '../../constants/colors';
import { NAVBAR_HEIGHT } from '../../constants/theme';
import { GET_TENANT_PROFILE, GET_LANDLORD_PROFILE } from '../../graphql/queries/server/profile';
import { GetTenantProfile } from '../../generated/GetTenantProfile';
import { GetLandlordProfile } from '../../generated/GetLandlordProfile';
import { Role } from '../../types/types';
import { useCredentials } from '../../utils';
import { GET_BRANDID } from '../../graphql/queries/client/userState';

type Props = {
  showButton?: boolean;
};

type Profile = {
  id: string;
  avatar: string | null;
};

export default function HeaderNavigationBar(props: Props) {
  let history = useHistory();
  let { role } = useCredentials();
  let [profileInfo, setProfileInfo] = useState<Profile>({ id: '', avatar: '' });

  let onTenantCompleted = (tenantResult: GetTenantProfile) => {
    if (tenantResult?.profileTenant) {
      let { profileTenant } = tenantResult;
      let { id, avatar } = profileTenant;
      setProfileInfo({
        id,
        avatar,
      });
    }
  };

  let onLandlordCompleted = (landlordResult: GetLandlordProfile) => {
    if (landlordResult?.profileLandlord) {
      let { profileLandlord } = landlordResult;
      let { id, avatar } = profileLandlord;
      setProfileInfo({
        id,
        avatar,
      });
    }
  };

  let [getBrandId, { data: brandId }] = useLazyQuery(GET_BRANDID, {
    notifyOnNetworkStatusChange: true,
  });

  let [getTenantProfile] = useLazyQuery<GetTenantProfile>(GET_TENANT_PROFILE, {
    onCompleted: onTenantCompleted,
    fetchPolicy: 'network-only',
  });

  let [getLandlordProfile] = useLazyQuery<GetLandlordProfile>(GET_LANDLORD_PROFILE, {
    onCompleted: onLandlordCompleted,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (role === Role.TENANT) {
      getTenantProfile();
    } else if (role === Role.LANDLORD) {
      getLandlordProfile();
    }
  }, [role, getTenantProfile, getLandlordProfile]);

  useEffect(() => {
    if (brandId) {
      history.push(`/map/${brandId}`);
    }
  }, [brandId, history]);

  return (
    <Container>
      <TouchableOpacity
        onPress={() => {
          if (role === Role.TENANT) {
            getBrandId();
          } else if (role === Role.LANDLORD) {
            history.push(`/landlord/properties/`);
          } else {
            history.push('/');
          }
        }}
      >
        <InsembleLogo color="purple" />
      </TouchableOpacity>
      {profileInfo.id ? (
        <TouchableOpacity
          onPress={() => {
            if (role === Role.TENANT) {
              history.push('/user/edit-profile');
            }
            if (role === Role.LANDLORD) {
              history.push('/landlord/edit-profile');
            }
          }}
        >
          <Avatar size="small" image={profileInfo.avatar || ''} />
        </TouchableOpacity>
      ) : (
        <>
          {props.showButton ? (
            <RowView>
              <LogIn
                mode="secondary"
                text="Log In"
                textProps={{ style: { color: THEME_COLOR } }}
                onPress={() => {
                  history.push('/login');
                }}
              />
              <Button
                text="Sign Up"
                onPress={() => {
                  history.push('/signup');
                }}
              />
            </RowView>
          ) : null}
        </>
      )}
    </Container>
  );
}

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  height: ${NAVBAR_HEIGHT};
  background-color: ${WHITE};
  box-shadow: 0px 1px 1px 0px ${HEADER_BORDER_COLOR};
  padding: 0px 32px;
  position: sticky;
  top: 0px;
  z-index: 99;
`;

const RowView = styled(View)`
  flex-direction: row;
  align-items: flex-end;
`;
const LogIn = styled(Button)`
  margin: 0 12px 0 0;
  border-color: ${THEME_COLOR};
`;
