import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus, EventStatus } from "../../enums";
import client from "../../gql_client";
import { getEvent, getEventAttendee } from "../../models/event";
import { ActionResult, endEventArgs, EndEventInput } from "../../types";

export async function endEventHandler(userId: string, input: EndEventInput): Promise<ActionResult> {
    // check if event exists and is in progress
    const event = await getEvent(input.eventId)
    if (!event || (event.status != EventStatus.ip)) {
        return {
            status: ActionStatus.ERROR,
            reason: 'event does not exist',
            id: 'na'
        }
    }
    // if event owner does not exist or is not an owner, return error
    const attendee = await getEventAttendee(input.eventId, userId)
    if (!attendee || (attendee.status != EventAttendeeStatus.owner)) {
        return {
            status: ActionStatus.ERROR,
            reason: 'you are not the owner of this event',
            id: 'na'
        }
    }
    // convert array inputs to strings that are usable with postgres arrays
    const team1_members_string = `{${input.team1_members.toString()}}`
    const team2_members_string = `{${input.team2_members.toString()}}`
    const team1_scores_string = `{${input.team1_scores.toString()}}`
    const team2_scores_string = `{${input.team2_scores.toString()}}`
    try {
        // end event
        const variables = {
            eventId: parseInt(input.eventId),
            team1_members: team1_members_string,
            team2_members: team2_members_string,
            team1_scores: team1_scores_string,
            team2_scores: team2_scores_string,
            team1_win: input.team1_win,
            payload: {
                eventId: input.eventId    
            }
        }
        const resp = await client().request(endEventMutation, variables)
        return {
            status: ActionStatus.SUCCESS,
            reason: 'na',
            id: 'na'
        }
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: JSON.stringify(e),
            id: 'na'
        }
    }
}

const endEventMutation = gql`
    mutation EndEvent($eventId: Int!, $team1_members: _text!, $team2_members: _text!, $team1_win: Boolean!, $team1_scores: _int4!, $team2_scores: _int4, $payload: jsonb) {
        end_event(args: {event_id: $eventId, team1_members: $team1_members, team2_members: $team2_members, team1_win: $team1_win, team1_scores: $team1_scores, team2_scores: $team2_scores}) {
            id
        }
        insert_domain_events_one(object: {type: EVENT_FINISHED, payload: $payload}) {
            id
        }
    }
`

export const endEventController = async (req: Request, res: Response) => {
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: endEventArgs = req.body.input
    const result = await endEventHandler(userId, params.input)
    return res.json(result)
}