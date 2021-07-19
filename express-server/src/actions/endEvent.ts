import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";

export function endEventHandler(userId: string) {
    // check if event exists
    try {

    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
        }
    }
}

const endEventMutation = gql`
    mutation EndEvent($eventId: Int!, $team1_members: _text!, $team2_members: _text!, $team1_win: Boolean!, $team1_scores: _int4!, $team2_scores: _int4, $payload: jsonb) {
        end_event(args: {event_id: $eventId, team1_members: $team1_members, team2_members: $team2_members, team1_win: $team1_win, team1_scores: $team1_scores, team2_scores: $team2_scores}) {
            id
        }
        insert_domain_events_one(object: {type: USER_DELETED_EVENT, payload: $payload}) {
            id
        }
    }
`

export const endEventController = async (req: Request, res: Response) => {
    const userId: string = req.header('X-Hasura-User-Id')
}