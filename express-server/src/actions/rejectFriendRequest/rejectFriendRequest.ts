import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../../enums";
import { client } from "../../gql_client";
import { checkFriendRequestExists } from "../../models/friend";
import { ActionResult, rejectFriendRequestArgs } from "../../types";

export async function rejectFriendRequestHandler(userId: string, friendId: string): Promise<ActionResult> {
    try {
        // check if friend request exists
        const exists = await checkFriendRequestExists(friendId, userId)
        if (!exists) {
            return {
                status: ActionStatus.ERROR,
                reason: 'na',
                id: 'na'
            }
        }
        const variables = {
            senderId: friendId,
            sendeeId: userId,
            payload: {
                senderId: friendId,
                sendeeId: userId
            }
        }
        // reject friend request
        const resp = await client.request(rejectFriendRequestMutation, variables)
        return {
            status: ActionStatus.SUCCESS,
            reason: 'na',
            id: 'na'
        }
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e,
            id: 'na'
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