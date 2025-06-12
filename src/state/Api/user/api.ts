import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { UserType } from '@/lib/utils';
interface searchUser {
  data: {
    searchUser: UserType[]
  }
}
const Backend_url=process.env.NEXT_PUBLIC_BACKEND_URL
export const graphqlUserApi = createApi({
  reducerPath: 'graphqlUserApi',
  tagTypes: ['Group', 'Attachments'], // Add this line
  baseQuery: fetchBaseQuery({
     baseUrl: `${Backend_url}`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: ({ username, email, password }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
          mutation createUser($input: CreateUserInput!) {
            createUser(input: $input) {
              id
              username
              email
              profileImageUrl
              description
              createdAt
            }
          }
          `,
          variables: {
            input: {
              username,
              email,
              password
            }
          }
        }
      })
    }),
    Login: builder.mutation({
      query: ({ email, password }) => ({
        url: '',
        method: `POST`,
        body: {
          query: `
           mutation authenticateUser($email: String!, $password: String!) {
            authenticateUser(email: $email, password: $password) {
              id
              username
              email
              profileImageUrl
              description
              createdAt
            } 
          }
          `
          ,
          variables: {
            email,
            password
          }
        }
      })
    }),
    searchUser: builder.mutation<searchUser, { username: string }>({
      query: ({ username }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation searchUser($username:String!){
              searchUser(username:$username){
                username
                email
                profileImageUrl
                id
              }
            }
          `,
          variables: {
            username
          }
        }
      })
    }),
  // Update typing 
  UpdateTyping: builder.mutation({
    query: ({ userId, groupId }) => ({
      url: '',
      method: "POST",
      body: JSON.stringify({
        query: `
            mutation userTyping ($userId: ID! , $groupId:ID!){
              userTyping(userId:$userId,groupId:$groupId)
            }
          `,
        variables: { userId, groupId }
      })
    })
  }),
  // Update typing stoped
  UpdateStopTyping: builder.mutation({
    query: ({ userId, groupId }) => ({
      url: '',
      method: "POST",
      body: JSON.stringify({
        query: `
            mutation userStoppedTyping($userId: ID! , $groupId:ID!){
              userStoppedTyping(userId:$userId,groupId:$groupId)
            }
          `,
        variables: { userId, groupId }
      })
    })
  }),
  // Online User 
  OnlineUser: builder.mutation({
    query: ({ userId }) => ({
      url: '',
      method: "POST",
      body: JSON.stringify({
        query: `
            mutation userOnline($userId: ID!){
              userOnline(userId:$userId){
                id
              }
            }
          `,
        variables: { userId }
      })
    })
  }),
  // offline user
  OfflineUser: builder.mutation({
    query: ({ userId }) => ({
      url: '',
      method: "POST",
      body: JSON.stringify({
        query: `
            mutation userOffline($userId: ID!){
              userOffline(userId:$userId){
                id
              }
            }
          `,
        variables: { userId }
      })
    })
  }),
}),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useUpdateTypingMutation,
  useUpdateStopTypingMutation,
  useSearchUserMutation,
} = graphqlUserApi;
