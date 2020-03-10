export type UserContent = {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar: string;
  company: string;
  tier: string;
  role: string;
};

type UserState = { userState: { __typename: string } & UserContent };

export type ErrorContent = {
  locationPreview: boolean;
};

export type ErrorState = {
  errorState: { __typename: string } & ErrorContent;
};

export type RootState = UserState & ErrorState;

export const defaultState: RootState = {
  userState: {
    __typename: 'UserState',
    token: '',
    email: '',
    firstName: '',
    lastName: '',
    avatar: '',
    company: '',
    tier: '',
    role: '',
  },
  errorState: {
    __typename: 'ErrorState',
    locationPreview: false,
  },
};
