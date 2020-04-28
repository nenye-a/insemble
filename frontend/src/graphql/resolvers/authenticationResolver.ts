import { ApolloCache } from 'apollo-cache';
import { UserContent } from '../localState';

export function loginSuccess(
  _: object,
  props: UserContent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { cache }: { cache: ApolloCache<any> }
) {
  let { tier, trial } = props;
  cache.writeData({
    data: {
      userState: {
        __typename: 'UserState',
        tier,
        trial,
      },
    },
  });

  return null;
}
