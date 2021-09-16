import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../../enums";
import client from "../../gql_client";
import { ActionResult, removeDeviceTokenArgs } from "../../types";

export async function removeDeviceTokenHandler(userId: string, token: string): Promise<ActionResult> {
    // remove device token if it doesn't already exist
    try {
        const resp = await client().request(removeDeviceTokenMutation, { userId: userId, token: token })
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

const removeDeviceTokenMutation = gql`
    mutation RemoveDeviceToken($userId: String!, $token: String!) {
        delete_device_tokens_by_pk(user_id: $userId, token: $token) {
            token
        }
    }
`

export const removeDeviceTokenController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: removeDeviceTokenArgs = req.body.input
    const result = await removeDeviceTokenHandler(userId, params.token)
    return res.json(result)
}