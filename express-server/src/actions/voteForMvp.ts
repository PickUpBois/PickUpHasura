import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function voteForMvpHandler(userId: string, voteeId: string, eventId: string) {
    // check if votee is in event

    // vote for mvp
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
        }
    }
}

const voteForMvpMutation = gql`
    mutation VoteEventMvp($voterId: String!, $voteeId: String!, $eventId: Int!, $payload: jsonb) {
        voterSet: update_event_attendees_by_pk(pk_columns: {eventId: $eventId, id: $voterId}, _set: {voted: true}) {
            id
        }
        voteeSet: update_event_attendees_by_pk(pk_columns: {eventId: $eventId, id: $voteeId}, _inc: { voteCount: 1 }) {
            id
        }
    }
`

export const voteForMvpController = async (req: Request, res: Response) => {
    const userId: string = req.header('X-Hasura-User-Id')
}