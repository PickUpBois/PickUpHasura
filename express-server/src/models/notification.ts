import { gql } from "graphql-request";
import { NotificationType } from "../enums";
import client from "../gql_client";

const getNotificationQuery = gql`
    query GetNotification($notificationId: Int!) {
        notifications_by_pk(id: $notificationId) {
            id,
            type,
            eventId,
            actorId,
            createdAt
        }
    }
`

type Notification = {
    userId: string
    eventId: string | null
    actorId: string | null
    timestamp: Date
    type: NotificationType
}

export async function getNotification(id: string): Promise<Notification | null> {
    try {
        const data = await client().request(getNotificationQuery, { notificationId: id })
        const notification = data.notifications_by_pk
        return {
            userId: notification.userId,
            eventId: notification.eventId,
            actorId: notification.actorId,
            timestamp: new Date(notification.createdAt),
            type: (<any>NotificationType)[notification.type]
        }
    } catch(e) {
        console.log(e)
        return null
    }
}