import * as dotenv from 'dotenv';

export function initConfig() {
    dotenv.config()
}

export const { HASURA_GRAPHQL_URL } = process.env