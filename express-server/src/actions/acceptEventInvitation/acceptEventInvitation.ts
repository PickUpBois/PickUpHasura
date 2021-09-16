import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus } from "../../enums";
import client from "../../gql_client";
import { getEventAttendee } from "../../models/event";
import { EventAttendee } from "../../models/eventTypes";
import { acceptEventInvitationArgs, ActionResult } from "../../types";

const acceptEventInvitationMutation = gql`
    mutation AcceptEventInvitation($eventId: Int!, $userId: String!) {
        update_event_attendees_by_pk(pk_columns: {eventId: $eventId, id: $userId}, _set: {status: ok}) {
            id
        }
    }
`

export async function acceptEventInvitationHandler(userId: string, eventId: string): Promise<ActionResult> {
    try {
        // check if event invitation exists

        // if attendee does not exist or is not invited, return an error
        const attendee: EventAttendee = await getEventAttendee(eventId, userId);
        if (!attendee || attendee.status != EventAttendeeStatus.invited) {
            return {
                status: ActionStatus.ERROR,
                reason: 'event invitation already exists',
                id: 'na',
            }
        }
        // accept event invitation
        await client().request(acceptEventInvitationMutation, { userId, eventId: parseInt(eventId) })
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

export const acceptEventInvitationController = async (req: Request, res: Response) => {
    const params: acceptEventInvitationArgs = req.body.input;
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const result = await acceptEventInvitationHandler(userId, params.eventId)
    return res.json(result)
}