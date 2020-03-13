import gql from 'graphql-tag';

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation(
    $brandId: String!
    $propertyId: String!
    $matchScore: Float!
    $header: String!
    $messageInput: MessageInput!
  ) {
    createConversation(
      brandId: $brandId
      propertyId: $propertyId
      matchScore: $matchScore
      header: $header
      messageInput: $messageInput
    )
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($conversationId: String!, $messageInput: MessageInput!) {
    sendMessage(conversationId: $conversationId, messageInput: $messageInput)
  }
`;
