import { Request, Response } from "express";
import { gql } from "graphql-request";
import { resourceLimits } from "worker_threads";
import { ActionStatus } from "../enums";
import { client } from "../gql_client";
import { checkIsFriend } from "../models/friend";
import { ActionResult, removeFriendArgs } from "../types";

export async function removeFriendHandler(userId: string, friendId: string): Promise<ActionResult> {
    // check if user is friends

    // remove friend
    try {
        const status = await checkIsFriend(userId, friendId)
        if (!status) {
            return {
                status: ActionStatus.ERROR,
                reason: 'you are not friends with this user',
                id: null,
            }
        }
        const resp = await client.request(removeFriendMutation, { userId, friendId })
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
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: removeFriendArgs = req.body.input
    const result = await removeFriendHandler(userId, params.friendId)
    return res.json(result)
}