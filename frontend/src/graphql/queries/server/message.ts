import gql from 'graphql-tag';

export const CREATE_CONVERSATION = gql`
  mutation CreateConversation(
    $brandId: String!
    $spaceId: String!
    $matchScore: Float!
    $header: String!
    $messageInput: MessageInput!
  ) {
    createConversation(
      brandId: $brandId
      spaceId: $spaceId
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

export const GET_CONVERSATION = gql`
  query Conversation($conversationId: String!) {
    conversation(conversationId: $conversationId) {
      id
      brand {
        tenantId
        id
        name
      }
      landlord {
        id
        email
        firstName
        lastName
        avatar
      }
      tenant {
        id
        email
        firstName
        lastName
        avatar
      }
      header
      messages {
        id
        message
        sender
        createdAt
      }
      matchScore
      property {
        id
        propertyId
        name
        location {
          address
        }
        space {
          mainPhoto
        }
      }
      space {
        id
        spaceId
        mainPhoto
      }
      createdAt
    }
  }
`;

export const GET_CONVERSATIONS = gql`
  query Conversations {
    conversations {
      id
      brand {
        id
        tenantId
        name
      }
      landlord {
        id
        email
        firstName
        lastName
        avatar
      }
      tenant {
        id
        email
        firstName
        lastName
        avatar
      }
      header
      messages {
        id
        message
        sender
        createdAt
      }
      matchScore
      property {
        id
        propertyId
        name
        location {
          address
        }
        space {
          mainPhoto
        }
      }
      createdAt
    }
  }
`;
