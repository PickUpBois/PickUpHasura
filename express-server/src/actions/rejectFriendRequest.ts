import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function rejectFriendRequestHandler(userId: string) {
    // check if friend request exists

    // reject friend request
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
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
    const userId: string = req.header('X-Hasura-User-Id')
}