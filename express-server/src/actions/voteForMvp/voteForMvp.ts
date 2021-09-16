import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../../enums";
import { client } from "../../gql_client";
import { getEventAttendee } from "../../models/event";
import { ActionResult, voteForMvpArgs } from "../../types";

export async function voteForMvpHandler(userId: string, voteeId: string, eventId: string): Promise<ActionResult> {
    try {
        // check if votee is in event
        const attendee = getEventAttendee(eventId, voteeId)
        if (!attendee) {
            return {
                status: ActionStatus.ERROR,
                reason: 'attendee is not in event',
                id: 'na'
            }
        }
        // vote for mvp
        const variables = {
            voterId: userId,
            voteeId: voteeId,
            eventId: parseInt(eventId),
            payload: {
                voterId: userId,
                voteeId: voteeId,
                eventId: eventId
            }
        }
        const data = await client.request(voteForMvpMutation, variables)
        return {
            status: ActionStatus.SUCCESS,
            reason: 'na',
            id: 'na'
        }
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e,
            id: 'na'
        }
    }
}

const voteForMvpMutation = gql`
    mutation VoteEventMvp($voterId: String!, $voteeId: String!, $eventId: Int!, $payload: jsonb) {
        voterSet: update_event_attendees_by_pk(pk_columns: {eventId: $eventId, id: $voterId}, _set: {voted: true}) {
            id
        }
        voteeSet: update_event_attendees_by_pk(pk_columns: {eventId: $eventId, id: $voteeId}, _inc: {voteCount: 1}) {
            id
        }
        insert_domain_events_one(object: {type: USER_VOTED_FOR_MVP, payload: $payload}) {
            id
        }
    }
`

export const voteForMvpController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: voteForMvpArgs = req.body.input
    const result = await voteForMvpHandler(userId, params.userId, params.eventId)
    return res.json(result)
}