import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../../enums";
import client from "../../gql_client";
import { checkFriendRequestExists } from "../../models/friend";
import { acceptEventInvitationArgs, acceptFriendRequestArgs, ActionResult } from "../../types";

export async function acceptFriendRequestHandler(userId: string, friendId: string): Promise<ActionResult> {
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

        // accept friend request
        const variables = {
            senderId: friendId,
            sendeeId: userId,
            payload: {
                senderId: friendId,
                sendeeId: userId
            }
        }
        const resp = await client().request(acceptFriendRequestMutation, variables)
        return {
            status: ActionStatus.SUCCESS,
            reason: 'na',
            id: 'na'
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

const acceptFriendRequestMutation = gql`
    mutation AccepttFriendRequest($senderId: String!, $sendeeId: String!, $payload: jsonb) {
        insert_relationships_one(object: {friend_id: $senderId, user_id: $sendeeId, status: friend}) {
            user_id
        }
        
        insert_domain_events_one(object: { type: USER_ACCEPT_FRIEND_REQUEST, payload: $payload}) {
            id
        }
    }
`

// controller for accepting friend requests
export const acceptFriendRequestController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const input: acceptFriendRequestArgs = req.body.input
    const result = await acceptFriendRequestHandler(userId, input.friendId)
    return res.json(result)
}