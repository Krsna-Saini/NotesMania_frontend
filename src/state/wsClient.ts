// src/graphql/apolloClient.ts
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
const Backend_url=process.env.NEXT_PUBLIC_BACKEND_URL
const ws_url=process.env.NEXT_PUBLIC_WS_URL
const httpLink = new HttpLink({
  uri: `${Backend_url}/graphql`,
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${ws_url}`,
  })
);

// Split links: use WebSocket for subscription, HTTP for others
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
