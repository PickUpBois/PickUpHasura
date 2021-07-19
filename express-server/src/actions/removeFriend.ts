import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function removeFriendHandler(userId: string, friendId: string) {
    // check if user is friends

    // remove friend
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
        }
    }
}

const removeFriendMutation = gql`
    mutation RemoveFriend($userId: String!, $friendId: String!) {
        r1: delete_relationships_by_pk(user_id: $userId, friend_id: $friendId) {
            relationship_id
        }
        
        r2: delete_relationships_by_pk(user_id: $friendId, friend_id: $userId) {
            relationship_id
        }
    }
`

export const removeFriendController = async (req: Request, res: Response) => {
    const userId: string = req.header('X-Hasura-User-Id')
}