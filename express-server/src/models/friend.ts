import { gql } from "graphql-request";
import { FriendStatus } from "../enums";
import { client } from "../gql_client";

const friendStatusQuery = gql`
    query CheckFriend($userId1: String!, $userId2: String!) {
        relationship1: relationships_by_pk(friend_id: $userId1, user_id: $userId2) {
            relationship_id,
            status
        },
        relationship2: relationships_by_pk(friend_id: $userId2, user_id: $userId1) {
            relationship_id,
            status
        }
    }
`

const friendRequestQuery = gql`
    query GetFriendRequest($senderId: String!, $sendeeId: String!) {
        relationships_by_pk(friend_id: $sendeeId, user_id: $senderId) {
            relationship_id,
            status
        },
    }
`

export async function checkIsFriend(userId1: string, userId2: string): Promise<boolean> {
    try {
        const data = await client.request(friendStatusQuery, { userId1, userId2 })
        const relationship1 = data.relationship1
        const relationship2 = data.relationship2
        return relationship1.status == FriendStatus.friend && relationship2.status == FriendStatus.friend
    } catch(e) {
        console.log(e)
        return false
    }
}

export async function checkFriendRequestExists(senderId: string, sendeeId: string): Promise<boolean> {
    try {
        const data = await client.request(friendRequestQuery, { senderId, sendeeId })
        return data.relationships_by_pk.status == FriendStatus.friend
    } catch(e) {
        console.log(e)
        return null
    }
}