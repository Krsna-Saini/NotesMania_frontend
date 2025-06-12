import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}
interface AiResponse {
  id: string;
  name: string;
  User: string;
  Messages: Message[];
  createdAt?: string;
  updatedAt?: string;
}
interface AiResponseHistory {
  data: {
    getAiChatById: AiResponse
  }
}
interface AiResponseHistoryForId {
  data: {
    getAiHistoryByUser: AiResponse[]
  }
}
interface AiResponseForCreateNewChat {
  data: {
    addAiResponse: AiResponse
  }
}
interface AiResponseForDeleteChat {
  data: {
    deleteChat: AiResponse
  }
}
const Backend_url=process.env.NEXT_PUBLIC_BACKEND_URL
export const graphqlAi_AssitanceApi = createApi({
  reducerPath: 'graphqlAi_AssitanceApi',
  tagTypes: ['Group', 'Attachments'], // Add this line
  baseQuery: fetchBaseQuery({
    baseUrl: `${Backend_url}`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAiHistoryByUser: builder.query<AiResponseHistoryForId, { userId: string }>({
      query: ({ userId }) => ({
        url: '',
        method: 'POST',
        body: JSON.stringify({
          query: `
            query GetAiHistoryByUser($userId: String!) {
              getAiHistoryByUser(userId: $userId) {
                id
                name
                User
                createdAt
                updatedAt
              }
            }
          `,
          variables: { userId },
        }),
      }),
      providesTags: (result, error, { userId }) =>
        result ? [{ type: 'Group', id: `USER_${userId}` }] : [],
    }),
    

    // Fetch single chat by chat ID
    getAiChatById: builder.query<AiResponseHistory, { chatId: string }>({
      query: ({ chatId }) => ({
        url: '',
        method: 'POST',
        body: JSON.stringify({
          query: `
            query GetAiChatById($chatId: String!) {
              getAiChatById(chatId: $chatId) {
                id
                name
                User
                Messages {
                  role
                  content
                  selectedText
                  timestamp
                  error
                }
                createdAt
                updatedAt
              }
            }
          `,
          variables: { chatId },
        }),
      }),
      providesTags: (result, error, { chatId }) =>
        result ? [{ type: 'Group', id: chatId }] : [], 
    }),

    // Create new chat with messages
    addAiResponse: builder.mutation<AiResponseForCreateNewChat, { userId: string; name?: string }>({
      query: ({ userId, name = 'New chat'}) => ({
        url: '',
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation AddAiResponse($userId: String!, $name: String) {
              addAiResponse(userId: $userId, name: $name) {
                id
                name
                User
                createdAt
                updatedAt
              }
            }
          `,
          variables: { userId, name },
        }),
      }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Group', id: `USER_${userId}` }],
    }),
    

    // Update chat name
    updateChatName: builder.mutation<AiResponseHistory, { chatId: string; name: string , userId:string }>({
      query: ({ chatId, name }) => ({
        url: '',
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation UpdateChatName($chatId: String!, $name: String!) {
              updateChatName(chatId: $chatId, name: $name) {
                id
                name
              }
            }
          `,
          variables: { chatId, name },
        }),
        
      }),
      invalidatesTags: (result, error, { userId }) => [
      { type: 'Group', id: `USER_${userId}` },
      ],
    }),

    // Append a message to a chat
    appendMessage: builder.mutation<AiResponseHistory, { chatId: string; message: Message }>({
      query: ({ chatId, message }) => ({
        url: '',
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation AppendMessage($chatId: String!, $message: AiMessageInput!) {
              appendMessage(chatId: $chatId, message: $message) {
                id
                Messages {
                  role
                  content
                  timestamp
                }
              }
            }
          `,
          variables: { chatId, message },
        }),
      }),
    }),

    // Delete chat
    deleteChat: builder.mutation<AiResponseForDeleteChat, { chatId: string,userId:string }>({
      query: ({ chatId }) => ({
        url: '',
        method: 'POST',
        body: JSON.stringify({
          query: `
            mutation DeleteChat($chatId: String!) {
              deleteChat(chatId: $chatId)
            }
          `,
          variables: { chatId },
        }),
      }),
       invalidatesTags: (result, error, { userId }) => [
      { type: 'Group', id: `USER_${userId}` },
    ],
    }),
  }),
});

export const {
  useAddAiResponseMutation,
  useAppendMessageMutation,
  useDeleteChatMutation,
  useUpdateChatNameMutation,
  useGetAiHistoryByUserQuery,
  useGetAiChatByIdQuery,
  useLazyGetAiChatByIdQuery
} = graphqlAi_AssitanceApi;
