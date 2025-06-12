// /src/components/MessageSubscription.tsx
import { messageType } from '@/lib/utils';
import { gql, useSubscription } from '@apollo/client';

// --- Subscriptions ---
export const MESSAGE_SUBSCRIPTION = gql`
  subscription OnMessageSent($groupId: ID!) {
    messageSent(groupId: $groupId) {
      attachments {
        fileUrl
        fileName
        fileType
      }
      content
      createdAt
      type
      sender {
        id
        username
      }
    }
  }
`;

export const TYPING_USERS_SUBSCRIPTION = gql`
  subscription TypingUser($groupId: ID!) {
    typingUser(groupId: $groupId)
  }
`;

// --- Typing User Subscription Component ---
export function TypingUserSubscription({ groupId, onTypingUser }: {
  groupId: string,
  onTypingUser: (typingUsers: string[]) => void
}) {
  useSubscription(TYPING_USERS_SUBSCRIPTION, {
    variables: { groupId },
    onData: ({ data }) => {
      console.log("Typing Subscription data:", data);
      if (data?.data?.typingUser) {
        onTypingUser(data.data.typingUser); // array of userIds/usernames
      }
    },
    onError: (error) => {
      console.error("Typing Subscription error:", error);
    }
  });

  return null;
}

// --- Message Subscription Component ---
export default function MessageSubscription({ groupId, onNewMessage }:{
  groupId: string,
  onNewMessage: (newMessage: messageType) => void
}) {
  useSubscription(MESSAGE_SUBSCRIPTION, {
    variables: { groupId },
    onData: ({ data }) => {
      console.log("Message Subscription data:", data);
      if (data?.data?.messageSent) {
        onNewMessage(data.data.messageSent);
      }
    },
    onError: (error) => {
      console.error("Message Subscription error:", error);
    }
  });

  return null;
}
