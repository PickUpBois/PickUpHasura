import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function joinEventHandler(userId: string, eventId: string) {
    // check if event exists

    // check if user is not already in event

    // join event
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
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
    const userId: string = req.header('X-Hasura-User-Id')
}