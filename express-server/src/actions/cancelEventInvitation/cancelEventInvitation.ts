import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus } from "../../enums";
import client from "../../gql_client";
import { getEventAttendee } from "../../models/event";
import { ActionResult, cancelEventInvitationArgs } from "../../types";

export async function cancelEventInvitationHandler(ownerId: string, userId: string, eventId: string): Promise<ActionResult> {
    try {
        // check if event invitation exists
        const attendee = await getEventAttendee(eventId, userId)
        if (!attendee || attendee.status != EventAttendeeStatus.invited) {
            return {
                status: ActionStatus.ERROR,
                reason: 'invitation does not exist',
                id: 'na',
            }
        }
        // cancel event invitation
        await client().request(removeEventInvitationMutation, { eventId: parseInt(eventId), userId })
        return {
            status: ActionStatus.SUCCESS,
            reason: 'na',
            id: 'na',
        }
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e,
            id: 'na'
        }
    }
}

const removeEventInvitationMutation = gql`
    mutation CancelEventInvitation($eventId: Int!, $userId: String!) {
        delete_event_attendees_by_pk(eventId: $eventId, id: $userId) {
            id
        }
    }
`

export const cancelEventInvitationController = async (req: Request, res: Response) => {
    const params: cancelEventInvitationArgs = req.body.input;
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const result = await cancelEventInvitationHandler(userId, params.userId, params.eventId)
    return res.json(result)
}