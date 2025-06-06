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

export const CREATE_PENDING_CONVERSATION = gql`
  mutation CreatePendingConversation(
    $brandId: String!
    $spaceId: String!
    $receiverContact: ReceiverContactInput!
    $matchScore: Float!
    $header: String!
    $messageInput: MessageInput!
    $brandInfo: BrandInfoInput
  ) {
    createPendingConversation(
      brandId: $brandId
      spaceId: $spaceId
      receiverContact: $receiverContact
      matchScore: $matchScore
      header: $header
      messageInput: $messageInput
      brandInfo: $brandInfo
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
      brand {
        categories
        nextLocations {
          address
        }
        locationCount
      }
      property {
        id
        propertyId
        name
        location {
          id
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
      brand {
        categories
        nextLocations {
          address
        }
        locationCount
      }
      property {
        id
        propertyId
        name
        location {
          id
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
