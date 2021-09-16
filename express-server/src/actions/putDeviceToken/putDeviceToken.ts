import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../../enums";
import client from "../../gql_client";
import { ActionResult, putDeviceTokenArgs } from "../../types";

export async function putDeviceTokenHandler(userId: string, token: string): Promise<ActionResult> {
    // inserts a device token if it doesn't already exist, otherwise has no effect
    try {
        const resp = await client().request(putDeviceTokenMutation, { userId: userId, token: token })
        return {
            status: ActionStatus.SUCCESS,
            reason: null,
            id: null
        }
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: JSON.stringify(e),
            id: null
        }
    }
}

const putDeviceTokenMutation = gql`
    mutation PutDeviceToken($userId: String!, $token: String!) {
        insert_device_tokens_one(object: {user_id: $userId, token: $token}, on_conflict: {constraint: device_tokens_pkey}) {
            user_id,
            token
        }
    }
`

export const putDeviceTokenController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: putDeviceTokenArgs = req.body.input
    const result = await putDeviceTokenHandler(userId, params.token)
    return res.json(result)
}