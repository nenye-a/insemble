import { ApolloCache } from 'apollo-cache';
import { UserContent } from '../localState';

export let loginSuccess = async (
  _obj: ObjectKey,
  props: UserContent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { cache }: { cache: ApolloCache<any> }
) => {
  let { token, firstName, lastName, avatar, company, email, tier, role } = props;
  let data = {
    userState: {
      __typename: 'UserState',
      token,
      email,
      firstName,
      lastName,
      avatar,
      company,
      tier,
      role,
    },
  };
  cache.writeData({ data });
  return null;
};
