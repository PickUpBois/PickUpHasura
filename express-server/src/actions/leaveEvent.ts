import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus } from "../enums";
import { client } from "../gql_client";
import { getEvent, getEventAttendee } from "../models/event";
import { EventAttendee, EventInfo } from "../models/eventTypes";
import { ActionResult, leaveEventArgs } from "../types";

export async function leaveEventHandler(userId: string, eventId: string): Promise<ActionResult> {
    // check if event exists

    // check if user is not already in event
    try {
        const event: EventInfo = await getEvent(eventId)
        if (!event) {
            return {
                status: ActionStatus.ERROR,
                reason: 'event does not exist',
                id: null
            }
        }
        const attendee: EventAttendee = await getEventAttendee(eventId, userId)
        if (!attendee || attendee.status != EventAttendeeStatus.ok) {
            return {
                status: ActionStatus.ERROR,
                reason: 'you have not joined this event',
                id: null
            }
        }

        const variables = {
            eventId: parseInt(eventId),
            userId: userId,
            payload: {
                userId: userId,
                eventId: eventId
            }
        }
        const resp = await client.request(leaveEventMutation, variables)
        return {
            status: ActionStatus.SUCCESS,
            reason: null,
            id: null
        }
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e,
            id: null
        }
    }
}

export const leaveEventMutation = gql`
    mutation LeaveEvent($eventId: Int!, $userId: String!, $payload: jsonb) {
        delete_event_attendees_by_pk(eventId: $eventId, id: $userId) {
            id
        }
        insert_domain_events_one(object: {type: USER_LEFT_EVENT, payload: $payload}) {
            id
        }
    }
`



export const leaveEventController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: leaveEventArgs = req.body.input
    const result = await leaveEventHandler(userId, params.eventId)
    return res.json(result)
}