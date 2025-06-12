import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AttachmentType, groupType, messageType } from '@/lib/utils';
interface GetAttachments {
  data: {
    getAttachments: AttachmentType[]
  }
}
interface searchGroups {
  data: {
    searchGroups: groupType[]
  }
}
interface MessageType {
  message: messageType;
};
interface getChatById {
  data: {
    getGroup: {
      messages: MessageType[]
    }
  }
}
const Backend_url=process.env.NEXT_PUBLIC_BACKEND_URL
export const graphqlGroupApi = createApi({
  reducerPath: 'graphqlGroupApi',
  tagTypes: ['Group', 'Attachments'], // Add this line
  baseQuery: fetchBaseQuery({
     baseUrl: `${Backend_url}/graphql`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createGroup: builder.mutation({
      query: ({ name, leader }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation createGroup($name:String!,$leader:String!){
              createGroup(name:$name,leader:$leader){
                name
              }
            }
          `,
          variables: {
            leader,
            name
          }
        }
      }),
      invalidatesTags: [{ type: 'Group', id: 'LIST' }],
    }),
    getGroups: builder.query({
      query: () => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              listGroups { id name description leader { id username email } createdAt }
              }
          `,
        },
      }),
      providesTags: (result) =>
        result
          ? [{ type: 'Group', id: 'LIST' }]
          : [],
    }),
    getGroupById: builder.query({
      query: (groupId) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
            query {
              getGroup(groupId:"${groupId}")  {id name description leader { id username email } members { member { id username email } joinedAt status } links{ link id} inviteRequests {user {username email id profilePicture} status invitedAt} createdAt }
            }
          `,
        },
      }),
      // Add this line
    }),
    addMember: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation AddMember($input: IAddMemberInput!) {
              addMember(input: $input) {
                id
                name
                members {
                  member {
                    id
                    username
                  }
                  status
                  joinedAt
                }
              }
            }
          `,
          variables: {
            input: {
              groupId,
              userId,
            },
          },
        },
      }),
    }),
    searchGroups: builder.mutation<searchGroups, { groupName: string }>({
      query: ({ groupName }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation searchGroups($groupName:String!){
              searchGroups(groupName:$groupName){
                name 
                profilePicture 
                description 
                id
              }
            }
          `,
          variables: {
            groupName
          }
        }
      })
    }),
    inviteRequest: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation handleInviteRequest($groupId:String!,$userId:String!){
              handleInviteRequest(groupId:$groupId,userId:$userId)
            }
          `,
          variables: {
            groupId,
            userId
          }
        }
      })
    }),
    acceptInviteRequest: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
        mutation acceptInviteRequest($groupId: String!, $userId: String!) {
          acceptInviteRequest(groupId: $groupId, userId: $userId)
        }
      `,
          variables: {
            groupId,
            userId,
          },
        },
      }),
    }),
    rejectInviteRequest: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
        mutation rejectInviteRequest($groupId: String!, $userId: String!) {
          rejectInviteRequest(groupId: $groupId, userId: $userId)
        }
      `,
          variables: {
            groupId,
            userId,
          },
        },
      }),
    }),
    promoteAdmin: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation PromoteAdmin($groupId: String!, $userId: String!) {
              promoteAdmin(groupId: $groupId, userId: $userId) {
                id
                admins {
                  admin {
                    id
                    username
                  }
                  promotedAt
                }
              }
            }
          `,
          variables: {
            groupId,
            userId,
          },
        },
      }),
    }),
    demoteAdmin: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation DemoteAdmin($groupId: String!, $userId: String!) {
              demoteAdmin(groupId: $groupId, userId: $userId) {
                id
                admins {
                  admin {
                    id
                    username
                  }
                }
              }
            }
          `,
          variables: {
            groupId,
            userId,
          },
        },
      }),
    }),
    removeMember: builder.mutation({
      query: ({ groupId, userId }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation RemoveMember($groupId: String!, $userId: String!) {
              removeMember(groupId: $groupId, userId: $userId) {
                id
                members {
                  member {
                    id
                    username
                  }
                }
              }
            }
          `,
          variables: {
            groupId,
            userId,
          },
        },
      }),
    }),
    getMessagesById: builder.query<getChatById, { groupId: string }>({
      query: ({ groupId }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
        query {
          getGroup(groupId: "${groupId}") {
            messages {
              message {
                content
                createdAt
                type
                attachments { fileUrl fileName fileType }
                sender { id username email }
              }
            }
          }
        }
      `,
        },
      }),
    }),
    getAttachments: builder.query<GetAttachments, { groupId: string }>({
      query: ({ groupId }) => ({
        url: '',
        method: 'POST',
        body: JSON.stringify({
          query: `
          mutation GetAttachments($groupId: ID!) {
            getAttachments(groupId: $groupId) {
            fileUrl
            fileName
            fileType
            uploadedAt
            user {
              id
              username
              email
            }
            }
          }
          `,
          variables: { groupId }
        })
      }),
      providesTags: (result, error, { groupId }) =>
        result ? [{ type: 'Group', id: groupId }] : [],
    }),
    sendMessage: builder.mutation({
      query: ({ senderId, groupId, content, type, attachments }) => ({
        url: '',
        method: 'POST',
        body: {
          query: `
          mutation {
            sendMessage(senderId:"${senderId}", groupId:"${groupId}", content:"${content}", type:"${type}", attachments:"${attachments}") {
            _id content type createdAt
            }
          }
          `,
        },
      }),

      invalidatesTags: (result, error, arg) => [
        { type: 'Group', id: arg.groupId }
      ],
    }),
  }),
});

export const {
  useCreateGroupMutation,
  useGetGroupsQuery,
  useGetGroupByIdQuery,
  useSendMessageMutation,
  useGetAttachmentsQuery,
  useGetMessagesByIdQuery,
  useAddMemberMutation,
  useDemoteAdminMutation,
  usePromoteAdminMutation,
  useRemoveMemberMutation,
  useSearchGroupsMutation,
  useInviteRequestMutation,
  useRejectInviteRequestMutation,
  useAcceptInviteRequestMutation
} = graphqlGroupApi;
