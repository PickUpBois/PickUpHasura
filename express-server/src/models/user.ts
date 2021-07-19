import { gql } from "graphql-request";
import { client } from "../gql_client";
import { UserInfo } from "./userTypes";

const getUserQuery = gql`
  query GetUser($userId: String!) {
    user(id: $userId) {
      college
      firstName
      id
      lastName
      photoUrl
      username
    }
  }
`

export async function getUser(userId: string): Promise<UserInfo | null> {
    try {
        const userData = await client.request(getUserQuery, { userId })
        const user: UserInfo = userData.user
        return user
    } catch(error) {
        return null
    }
}