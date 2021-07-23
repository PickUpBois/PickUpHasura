import { gql } from "graphql-request";
import { ActionResult, updateUserArgs, UpdateUserInput } from "../types"
import { ActionStatus } from "../enums";
import { Response, Request } from "express";
import { client } from "../gql_client";

const updateUserMutation = gql`
    mutation UpdateUser($userId: String!, $firstName: String, $lastName: String, $username: String, $college: String, $photoUrl: String) {
        update_users_by_pk(pk_columns: {id: $userId}, _set: {college: $college, firstName: $firstName, lastName: $lastName, photoUrl: $photoUrl, username: $username}) {
            id
        }
    }
`

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

const mergeFields = (old: UpdateUserInput, curr: UpdateUserInput): UpdateUserInput => {
  return {
    firstName: curr.firstName || old.firstName,
    lastName: curr.lastName || old.lastName,
    username: curr.username || old.username,
    photoUrl: curr.photoUrl || old.photoUrl,
    college: curr.college || old.college
  }
}

async function updateUserHandler(userId: string, args: updateUserArgs): Promise<ActionResult> {
    const updateUserInput: UpdateUserInput = args.arg1;
    try {
      const userData = await client.request(getUserQuery, { userId })
      const user: UpdateUserInput = userData.user
      const newUser: UpdateUserInput = mergeFields(user, updateUserInput)
      const variables = {
        userId: userId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        college: newUser.college,
        photoUrl: newUser.photoUrl
      }
      await client.request(updateUserMutation, variables)
      return {
        status: ActionStatus.SUCCESS,
        reason: null,
        id: null
      }
    } catch(error) {
      return {
        status: ActionStatus.ERROR,
        reason: error,
        id: null
      }
    }
  }

export const updateUserController =  async (req: Request, res: Response) => {
    // get request input
  const params: updateUserArgs = req.body.input
  const userId: string = req.body.session_variables['x-hasura-user-id']
  // run some business logic
  const result = await updateUserHandler(userId, params)

  // success
  return res.json(result);
}
