import { gql } from "graphql-request";
import { NotificationType } from "../enums";
import client from "../gql_client";
import * as admin from 'firebase-admin'

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

const getDeviceTokensQuery = gql`
    query GetDeviceTokens($userId: String!) {
        device_tokens(where: {user_id: {_eq: $userId}}) {
            token
        }
    }
`

async function getDeviceTokens(userId: string): Promise<string[]> {
    try {
        const data = await client().request(getDeviceTokensQuery, { userId })
        const tokens = data.device_tokens.map(info => info.token)
        return tokens

    } catch(e) {
        console.log(e)
        return []
    }
}

export async function sendNotification(
    userId: string,
    messageTitle: string,
    messageText: string,
  ) {
    const devices = await getDeviceTokens(userId);
    if (devices.length == 0) {
      return;
    }
    const message = {
      data: {
        message: messageText,
      },
      notification: {
        title: messageTitle,
        body: messageText,
      },
      tokens: devices,
    };
    admin.messaging()
      .sendMulticast(message)
      .then(async (res) => {
        console.log('notification successful');
        if (res.failureCount > 0) {
          console.log(`invalidating ${res.failureCount} device tokens`);
          res.responses.forEach(async (resp, idx) => {
            if (!resp.success) {
              const token = devices[idx];
              await this.notificationRepo.removeDeviceToken(userId, token);
            }
          });
        }
      })
      .catch((e) => {
        console.log(e.message);
      });
  }