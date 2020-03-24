import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory, useParams } from 'react-router-dom';

import { LoadingIndicator, View } from '../core-ui';
import { saveCredentials } from '../utils';
import { Role } from '../types/types';

type Params = {
  token: string;
};

type Props = {
  role: Role;
};

export default function RedirectLogin({ role }: Props) {
  let [loading, setLoading] = useState(true);
  let history = useHistory();
  let params = useParams<Params>();

  useEffect(() => {
    if (role === Role.TENANT) {
      saveCredentials({
        tenantToken: params.token,
        role: Role.TENANT,
      });
      setLoading(false);
      history.push('/user/brands');
    } else {
      saveCredentials({
        landlordToken: params.token,
        role: Role.LANDLORD,
      });
      setLoading(false);
      history.push('/landlord/properties');
    }
  }, [history, params.token, role]);
  return (
    <Container>
      {loading ? <LoadingIndicator size="large" text="Logging you in..." /> : null}
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
