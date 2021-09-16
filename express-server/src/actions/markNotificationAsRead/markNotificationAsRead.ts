import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../../enums";
import client from '../../gql_client'
import { ActionResult, markNotificationAsReadArgs } from "../../types";

export async function markNotificationAsReadHandler(userId: string, notificationId: string): Promise<ActionResult> {
    try {
        // mark notification as read
        const resp = await client().request(markNotificationAsReadMutation, { notificationId: parseInt(notificationId) })
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
            id: null
        }
    }
}

const markNotificationAsReadMutation = gql`
    mutation MarkNotificationAsRead($notificationId: Int!) {
        update_notifications_by_pk(pk_columns: {id: $notificationId}, _set: {status: read}) {
            id
        }
    }
`

export const markNotificationAsReadController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: markNotificationAsReadArgs = req.body.input
    console.log('marking notification as read')
    const result = await markNotificationAsReadHandler(userId, params.notificationId)
    return res.json(result)
}