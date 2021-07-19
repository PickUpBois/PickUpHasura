import { GraphQLClient } from 'graphql-request';

// export const client = new GraphQLClient(HASURA_GRAPHQL_URL, { headers: {} });
export let client: GraphQLClient;

export const initGraphqlClient = () => {
    console.log(process.env.HASURA_GRAPHQL_URL);
  client = new GraphQLClient(process.env.HASURA_GRAPHQL_URL, { headers: {} });
}