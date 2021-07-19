import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function putDeviceTokenHandler(userId: string) {
    // put device token
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
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
    const userId: string = req.header('X-Hasura-User-Id')
}