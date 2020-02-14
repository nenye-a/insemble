export const SAVE_TENANT_LOGIN = gql`
  mutation loginSuccess(
    $token: String!
    $email: String!
    $firstName: String!
    $lastName: String!
    $avatar: String
    $company: String
    $tier: String!
    $role: String!
  ) {
    loginSuccess(
      token: $token
      email: $email
      firstName: $firstName
      lastName: $lastName
      avatar: $avatar
      company: $company
      tier: $tier
      role: $role
    ) @client
  }
`;
