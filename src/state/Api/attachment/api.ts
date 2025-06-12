import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
type AttachmentResponse = {
  _id: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  tags: string[];
  uploadedAt: Date;
  uploadedBy: {
    _id: string;
    username: string;
    profileImageUrl?: string;
  };
  Att_group: {
    name: string;
    totalMembers: number;
    sampleMembers: {
      _id: string;
      username: string;
      profileImageUrl?: string;
    }[];
  } | null; // in case group is optional
};
interface GetAttachmentsByUser{
  data:{
    getAttachments:AttachmentResponse[]
  }
}
const Backend_url=process.env.NEXT_PUBLIC_BACKEND_URL
export const graphqlattachment = createApi({
  reducerPath: 'graphqlattachment',
  baseQuery: fetchBaseQuery({
     baseUrl: `${Backend_url}`,
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getAttachmentByUser: builder.query<GetAttachmentsByUser,string>({
      query: (userId: string) => ({
        url: "",
        method: "POST",
        body: {
          query: `
                query getAttachments($userId: ID!) {
                  getAttachments(userId: $userId) {
                    _id
                    fileUrl
                    fileName
                    fileType
                    tags
                    uploadedAt
                    uploadedBy {
                      _id
                      username
                      profileImageUrl
                    }
                    Att_group {
                      name
                      totalMembers
                      sampleMembers {
                        _id
                        username
                        profileImageUrl
                      }
                    }
                  }
                }
              `,
          variables: {
            userId,
          },
        },
      }),
    }),
    }),
});

export const {
useGetAttachmentByUserQuery
} = graphqlattachment;
