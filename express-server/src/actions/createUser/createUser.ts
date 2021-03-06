import { Request, Response } from 'express'
import { gql } from 'graphql-request';
import client from '../../gql_client';
import { ActionStatus } from '../../enums';
import { ActionResult, createUserArgs, CreateUserInput } from '../../types';

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
      insert_domain_events_one(object: {user_id: $id, payload: $payload, type: USER_CREATED}) {
        id
      }
  }
`

async function createUserHandler(userId: string, args: createUserArgs): Promise<ActionResult> {
  const createUserInput: CreateUserInput = args.arg1;
  const variables = {
    ... createUserInput,
    id: userId,
    payload: {
      userId
    }
  }
  // create user
  try {
    const resp = await client().request(createUserMutation, variables);
    return {
      status: ActionStatus.SUCCESS,
      reason: 'na',
      id: resp['insert_users_one']['id']
    }
  } catch (error) {
    return {
      status: ActionStatus.ERROR,
      reason: JSON.stringify(error),
      id: 'na'
    }
  }
}

// Request Handler
export const createUserController = async (req: Request, res: Response) => {
  // get request input
  const params: createUserArgs = req.body.input
  const userId: string = req.body.session_variables['x-hasura-user-id']
  // run some business logic
  const result = await createUserHandler(userId, params)
  console.log(result)
  // success
  return res.json(result)
}