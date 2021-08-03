import { GraphQLClient } from 'graphql-request';

// export const client = new GraphQLClient(HASURA_GRAPHQL_URL, { headers: {} });
export let client: GraphQLClient = null

export const getClient = () => {
  if (client) return client;
  else {
    client = new GraphQLClient(process.env.HASURA_GRAPHQL_URL, { headers: {} });
    return client
  }
}

export default getClient;