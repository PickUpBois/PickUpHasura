import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function sendFriendRequestHandler(userId: string, friendId: string) {
    // check if user exists

    // check if friend has not already sent a friend request

    // send friend request
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
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
    const userId: string = req.header('X-Hasura-User-Id')
}