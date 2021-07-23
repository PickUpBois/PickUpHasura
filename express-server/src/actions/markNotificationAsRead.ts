import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function markNotificationAsReadHandler(userId: string) {
    // check if notification exists and is not already read

    // mark notification as read
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
        }
    }
}

const markNotificationAsReadMutation = gql`
    mutation MarkNotificationAsRead($notificationId: Int!) {
        update_info_notifications_by_pk(pk_columns: {notification_id: $notificationId}, _set: {status: read}) {
            notification_id
        }
    }
`

export const markNotificationAsReadController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
}