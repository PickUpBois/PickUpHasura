import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus } from "../enums";
import { client } from "../gql_client";
import { getEventAttendee } from "../models/event";
import { EventAttendee } from "../models/eventTypes";
import { declineEventInvitationArgs } from "../types";

export async function declineEventInvitationHandler(userId: string, eventId: string) {
    // check if event invitation exists
    try {
        const attendee: EventAttendee = await getEventAttendee(eventId, userId)
        if (!attendee || attendee.status != EventAttendeeStatus.invited) {
            return {
                status: ActionStatus.ERROR,
                reason: 'invitation does not exist'
            }
        }
        await client.request(removeEventInvitationMutation, { eventId: parseInt(eventId), userId })
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

const removeEventInvitationMutation = gql`
    mutation CancelEventInvitation($eventId: Int!, $userId: String!) {
        delete_event_attendees_by_pk(eventId: $eventId, id: $userId) {
            id
        }
    }
`

export const declineEventInvitationController = async (req: Request, res: Response) => {
    const params: declineEventInvitationArgs = req.body.input;
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const result = await declineEventInvitationHandler(userId, params.eventId)
    return res.json(result)
}