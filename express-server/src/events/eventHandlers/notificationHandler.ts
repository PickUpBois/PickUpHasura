import { gql } from "graphql-request";
import { NotificationType } from "../../enums";
import { client } from "../../gql_client";
import { getAttendees, getEventOwnerId } from "../../models/event";
import { EventDeletedPayload, EventStartedPayload, UserAcceptFriendRequestPayload, UserInvitedToEventPayload, UserJoinedEventPayload, UserLeftEventPayload, UserRejectFriendRequestPayload, UserSelectedMvpPayload, UserSentFriendRequestPayload, VoteForMvpPayload } from "../../types";

const addNotificationMutation = gql`
    mutation AddNotification($userId: String!, $type: notification_type_enum!, $actorId: String, $eventId: Int) {
        insert_notifications_one(object: {userId: $userId, eventId: $eventId, actorId: $actorId, type: $type}) {
            id
        }
    }
`

export async function addUserSentFriendRequestNotification(payload: UserSentFriendRequestPayload) {
    console.log(`adding notification ${NotificationType.friendRequestSend}`)
    const senderId = payload.senderId
    const sendeeId = payload.sendeeId
    const variables = {
        userId: sendeeId,
        type: NotificationType.friendRequestSend,
        actorId: senderId,
        eventId: null
    }
    try {
        const data = await client.request(addNotificationMutation, variables)
    } catch(e) {
        console.log(e)
    }
}

// sends an accepted friend request notification to the user who accepted this friend request
export async function addUserAcceptedFriendRequestNotification(payload: UserAcceptFriendRequestPayload) {
    console.log(`adding notification ${NotificationType.friendRequestAccept}`)
    const senderId = payload.senderId
    const sendeeId = payload.sendeeId
    const variables = {
        userId: senderId,
        type: NotificationType.friendRequestAccept,
        actorId: sendeeId,
        eventId: null
    }
    try {
        const data = await client.request(addNotificationMutation, variables)
    } catch(e) {
        console.log(e)
    }
}

export async function addUserRejectedFriendRequestNotification(payload: UserRejectFriendRequestPayload) {
    console.log(`adding notification ${NotificationType.friendRequestReject}`)
    const senderId = payload.senderId
    const sendeeId = payload.sendeeId
    const variables = {
        userId: senderId,
        type: NotificationType.friendRequestReject,
        actorId: sendeeId,
        eventId: null
    }
    try {
        const data = await client.request(addNotificationMutation, variables)
    } catch(e) {
        console.log(e)
    }

}

export async function addUserJoinedEventNotification(payload: UserJoinedEventPayload) {
    console.log(`adding notification ${NotificationType.joinedEvent}`)
    const userId = payload.userId
    const eventId = payload.eventId
    const ownerId = getEventOwnerId(eventId)
    const variables = {
        userId: ownerId,
        type: NotificationType.joinedEvent,
        actorId: userId,
        eventId: eventId
    }
    try {
        const data = await client.request(addNotificationMutation, variables)
    } catch(e) {
        console.log(e)
    }
}

export async function addUserLeftEventNotification(payload: UserLeftEventPayload) {
    console.log(`adding notification ${NotificationType.leftEvent}`)
    const userId = payload.userId
    const eventId = payload.eventId
    const ownerId = getEventOwnerId(eventId)
    const variables = {
        userId: ownerId,
        type: NotificationType.leftEvent,
        actorId: userId,
        eventId: eventId
    }
    try {
        const data = await client.request(addNotificationMutation, variables)
    } catch(e) {
        console.log(e)
    }
}

export async function addUserInvitedToEventNotification(payload: UserInvitedToEventPayload) {
    console.log(`adding notification ${NotificationType.eventInvitation}`)
    const userId = payload.userId
    const eventId = payload.eventId
    const ownerId = getEventOwnerId(eventId)
    const variables = {
        userId: userId,
        type: NotificationType.eventInvitation,
        actorId: ownerId,
        eventId: eventId
    }
    try {
        const data = await client.request(addNotificationMutation, variables)
    } catch(e) {
        console.log(e)
    }
}

export async function addUserSelectedMvpNotification(payload: UserSelectedMvpPayload) {
    console.log(`adding notification ${NotificationType.selectedMvp}`)
    const userId = payload.userId
    const eventId = payload.eventId
    const variables = {
        userId: userId,
        type: NotificationType.selectedMvp,
        actorId: null,
        eventId: eventId
    }
    try {
        const data = await client.request(addNotificationMutation, variables)
    } catch(e) {
        console.log(e)
    }
}

export async function addFinishEventNotification(payload: EventStartedPayload) {
    console.log(`adding notification ${NotificationType.finishEvent}`)
    const eventId = payload.eventId
    const ownerId = await getEventOwnerId(payload.eventId)
    const variables = {
        userId: ownerId,
        type: NotificationType.finishEvent,
        actorId: null,
        eventId: eventId
    }
    try {
        const data = await client.request(addNotificationMutation, variables)
    } catch(e) {
        console.log(e)
    }
}

export async function addVoteForMvpNotification(payload: VoteForMvpPayload) {
    console.log(`adding notification ${NotificationType.voteForMvp}`)
    const eventId = payload.eventId
    const attendees = await getAttendees(eventId)
    const task = async (userId: string) => {
        try {
            const data = await client.request(addNotificationMutation, { userId, eventId, actorId: null, type: NotificationType.voteForMvp })
        } catch(e) {
            console.log(e)
        }
    }
    const tasks = attendees.map((attendee) => {
        return task(attendee.userId)
    })
    await Promise.all(tasks)
}

export async function addDeleteEventNotification(payload: EventDeletedPayload) {
    // add deleteEvent as notification type

}

