import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";
import { client } from "../gql_client";
import { checkFriendRequestExists } from "../models/friend";
import { ActionResult, rejectFriendRequestArgs } from "../types";

export async function rejectFriendRequestHandler(userId: string, friendId: string): Promise<ActionResult> {
    // check if friend request exists

    // reject friend request
    try {
        const exists = await checkFriendRequestExists(friendId, userId)
        if (!exists) {
            return {
                status: ActionStatus.ERROR,
                reason: null,
                id: null
            }
        }
        const variables = {
            senderId: friendId,
            sendeeId: userId,
            payload: {
                userId: userId,
                friendId: friendId
            }
        }
        const resp = await client.request(rejectFriendRequestMutation, variables)
        return {
            status: ActionStatus.SUCCESS,
            reason: null,
            id: null
        }
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e,
            id: null
        }
    }
}

const rejectFriendRequestMutation = gql`
    mutation RejectFriendRequest($senderId: String!, $sendeeId: String!, $payload: jsonb) {
        delete_relationships_by_pk(friend_id: $sendeeId, user_id: $senderId) {
            user_id
        }
        
        insert_domain_events_one(object: { type: USER_REJECTED_FRIEND_REQUEST, payload: $payload}) {
            id
        }
    }
`

export const rejectFriendRequestController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: rejectFriendRequestArgs = req.body.input
    const result = await rejectFriendRequestHandler(userId, params.friendId)
    return res.json(result)
}