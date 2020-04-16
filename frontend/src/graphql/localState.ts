import { TenantTier } from './../generated/globalTypes';

export type UserContent = {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  company: string;
  tier: TenantTier | null;
  role: string;
};

type UserState = { userState: { __typename: string } & UserContent };

export type RootState = UserState;

export const defaultState: RootState = {
  userState: {
    __typename: 'UserState',
    token: '',
    email: '',
    firstName: '',
    lastName: '',
    avatar: '',
    company: '',
    tier: null,
    role: '',
  },
};
