import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function inviteUserToEventHandler(userId: string, eventId: string) {
    // check if user exists

    // check if event exists

    // check if user has not already been invited
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
        }
    }
}

const inviteUserToEventMutation = gql`
    mutation InviteUserToEvent($ownerId: String!, $eventId: Int!, $userId: String!, $timestamp: timestamptz $payload: jsonb) {
        insert_event_attendees_one(object: { eventId: $eventId, id: $userId, invitedAt: $timestamp, invited_by: $ownerId, status: invited}) {
            id
        }
        insert_domain_events_one(object: {type: USER_INVITED_TO_EVENT, payload: $payload}) {
            id
        }
    }
`

export const inviteUserToEventController = async (req: Request, res: Response) => {
    const userId: string = req.header('X-Hasura-User-Id')
}