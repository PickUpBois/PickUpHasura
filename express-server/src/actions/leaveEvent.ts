import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function leaveEventHandler(userId: string, eventId: string) {
    // check if event exists

    // check if user is not already in event
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
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
    const userId: string = req.header('X-Hasura-User-Id')
}