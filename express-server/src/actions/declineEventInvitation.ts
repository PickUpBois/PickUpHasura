import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";
import { declineEventInvitationArgs } from "../types";

export function declineEventInvitationHandler(userId: string) {
    // check if event invitation exists
    try {

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
    const userId: string = req.header('X-Hasura-User-Id')
}