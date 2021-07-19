import { Request, Response } from 'express'
import { gql } from 'graphql-request';
import { client } from '../gql_client';
import { ActionStatus } from '../enums';
import { ActionResult, createUserArgs, CreateUserInput } from '../types';

const findUserByUsernameQuery = gql`
  query FindUsersByUsername($username: String!) {
    users(where: {username: {_eq: $username}}) {
      id
    }
  }
`

const createUserMutation = gql`
  mutation CreateUser($id: String!, $firstName: String!, $lastName: String!, $username: String!, $college: String = null, $payload: jsonb) {
      insert_users_one(object: {id: $id, firstName: $firstName, lastName: $lastName, username: $username, college: $college}) {
        id
      }
      insert_domain_events_one(object: {payload: $payload, type: USER_CREATED}) {
        id
      }
  }
`

async function createUserHandler(userId: string, args: createUserArgs): Promise<ActionResult> {
  const createUserInput: CreateUserInput = args.arg1;
  const variables = {
    ... createUserInput,
    payload: {
      userId
    }
  }
  try {
    await client.request(createUserMutation, variables);
    return {
      status: ActionStatus.SUCCESS,
      reason: null
    }
  } catch (error) {
    return {
      status: ActionStatus.ERROR,
      reason: error
    }
  }
}

// Request Handler
export const createUserController = async (req: Request, res: Response) => {
  // get request input
  const params: createUserArgs = req.body.input
  const userId: string = req.header('X-Hasura-User-Id')
  // run some business logic
  const result = await createUserHandler(userId, params)

  // success
  return res.json(result)
}