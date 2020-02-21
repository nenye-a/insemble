import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';

import InsembleLogo from '../common/InsembleLogo';
import { TouchableOpacity, Button, View, Avatar } from '../../core-ui';
import { WHITE, HEADER_BORDER_COLOR, THEME_COLOR } from '../../constants/colors';
import { NAVBAR_HEIGHT } from '../../constants/theme';
import { GET_TENANT_PROFILE } from '../../graphql/queries/server/profile';
import { GetTenantProfile } from '../../generated/GetTenantProfile';

type Props = {
  showButton?: boolean;
};

export default function HeaderNavigationBar(props: Props) {
  let history = useHistory();
  let { data } = useQuery<GetTenantProfile>(GET_TENANT_PROFILE);
  let avatar = data?.profileTenant.avatar;
  return (
    <Container>
      <TouchableOpacity
        onPress={() => {
          history.push('/');
        }}
      >
        <InsembleLogo color="purple" />
      </TouchableOpacity>
      {data?.profileTenant.id ? (
        <TouchableOpacity
          onPress={() => {
            history.push('/user/edit-profile');
          }}
        >
          <Avatar size="small" image={avatar} />
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

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
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
