import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../../enums";
import { client } from "../../gql_client";
import { checkFriendRequestExists } from "../../models/friend";
import { getUser } from "../../models/user";
import { UserInfo } from "../../models/userTypes";
import { ActionResult, sendFriendRequestArgs } from "../../types";

export async function sendFriendRequestHandler(userId: string, friendId: string): Promise<ActionResult> {
    // check if user exists

    // check if friend has not already sent a friend request

    // send friend request
    try {
        const friend: UserInfo = await getUser(friendId)
        if (!friend) {
            return {
                status: ActionStatus.ERROR,
                reason: 'friend does not exist',
                id: 'na'
            }
        }
        const exists = await checkFriendRequestExists(friendId, userId)
        if (exists) {
            return {
                status: ActionStatus.ERROR,
                reason: 'your friend has already sent a friend request',
                id: 'na'
            }
        }
        const variables = {
            userId: userId,
            friendId: friendId,
            payload: {
                senderId: userId,
                sendeeId: friendId
            }
        }
        const resp = await client.request(sendFriendRequestMutation, variables)
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
            id: 'na'
        }
    }
}

const sendFriendRequestMutation = gql`
    mutation SendFriendRequest($userId: String!, $friendId: String!, $payload: jsonb) {
        insert_relationships_one(object: { user_id: $userId, friend_id: $friendId, status: friend} ) {
            relationship_id
        }
        
        insert_domain_events_one(object: { type: USER_SENT_FRIEND_REQUEST, payload: $payload }) {
            id
        }
    }
`

export const sendFriendRequestController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: sendFriendRequestArgs = req.body.input
    const result = await sendFriendRequestHandler(userId, params.friendId)
    return res.json(result)
}