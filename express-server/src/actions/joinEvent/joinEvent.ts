import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus } from "../../enums";
import client from "../../gql_client";
import { getEvent, getEventAttendee } from "../../models/event";
import { EventAttendee, EventInfo } from "../../models/eventTypes";
import { ActionResult, joinEventArgs } from "../../types";

export async function joinEventHandler(userId: string, eventId: string): Promise<ActionResult> {
    try {
        // check if event exists
        const event: EventInfo = await getEvent(eventId)
        if (!event) {
            return {
                status: ActionStatus.ERROR,
                reason: 'event does not exist',
                id: null
            }
        }

        // check if user is not already in event
        const attendee: EventAttendee = await getEventAttendee(eventId, userId)
        if (attendee && attendee.status == EventAttendeeStatus.ok) {
            return {
                status: ActionStatus.ERROR,
                reason: 'you have already joined this event',
                id: null
            }
        }

        // join event
        const variables = {
            eventId: parseInt(eventId),
            userId: userId,
            timestamp: new Date().toISOString(),
            payload: {
                userId: userId,
                eventId: eventId
            }
        }
        const resp = await client().request(joinEventMutation, variables)
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

const joinEventMutation = gql`
    mutation JoinEventMutation($eventId: Int!, $userId: String!, $timestamp: timestamptz, $payload: jsonb) {
        insert_event_attendees_one(object: { eventId: $eventId, id: $userId, joinedAt: $timestamp, status: ok}) {
            id,
        }
        insert_domain_events_one(object: {type: USER_JOINED_EVENT, payload: $payload}) {
            id
        }
    }
`

export const joinEventController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: joinEventArgs = req.body.input
    const result = await joinEventHandler(userId, params.eventId)
    return res.json(result)
}