import { TenantTier } from './../generated/globalTypes';

export type UserContent = {
  tier: TenantTier | null;
  brandId: string;
  trial: boolean | null;
};

type UserState = { userState: { __typename: string } & UserContent };

export type RootState = UserState;

export const defaultState: RootState = {
  userState: {
    __typename: 'UserState',
    tier: null,
    trial: null,
    brandId: '',
  },
};
