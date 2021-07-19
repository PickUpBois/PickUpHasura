import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus } from "../enums";
import { client } from "../gql_client";
import { getEventAttendee } from "../models/event";
import { EventAttendee } from "../models/eventTypes";
import { acceptEventInvitationArgs, ActionResult } from "../types";

const acceptEventInvitationMutation = gql`
    mutation AcceptEventInvitation($eventId: Int!, $userId: String!) {
        update_event_attendees_by_pk(pk_columns: {eventId: $eventId, id: $userId}, _set: {status: invited}) {
            id
        }
    }
`

export async function acceptEventInvitationHandler(userId: string, eventId: string): Promise<ActionResult> {
    // check if event invitation exists
    try {
        const attendee: EventAttendee = await getEventAttendee(eventId, userId);
        if (attendee.status != EventAttendeeStatus.invited) {
            return {
                status: ActionStatus.ERROR,
                reason: 'event invitation already exists'
            }
        }
        // accept event invitation
        await client.request(acceptEventInvitationMutation, { userId, eventId })
        return {
            status: ActionStatus.SUCCESS,
            reason: null
        }
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
        }
    }
}

export const acceptEventInvitationController = async (req: Request, res: Response) => {
    const params: acceptEventInvitationArgs = req.body.input;
    const userId: string = req.header('X-Hasura-User-Id');
}