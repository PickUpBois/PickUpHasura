import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function removeDeviceTokenHandler(userId: string, token: string) {
    // remove device token
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
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
    const userId: string = req.header('X-Hasura-User-Id')
}