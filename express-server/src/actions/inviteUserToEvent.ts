import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";
import { client } from "../gql_client";
import { getEvent, getEventAttendee } from "../models/event";
import { EventAttendee, EventInfo } from "../models/eventTypes";
import { getUser } from "../models/user";
import { UserInfo } from "../models/userTypes";
import { ActionResult, inviteUserToEventArgs } from "../types";

export async function inviteUserToEventHandler(ownerId: string, userId: string, eventId: string): Promise<ActionResult> {
    // check if user exists

    // check if event exists

    // check if user has not already been invited
    try {
        const user: UserInfo = await getUser(userId)
        if (!user) return {
            status: ActionStatus.ERROR,
            reason: 'invited user does not exist',
            id: null
        }
        const event: EventInfo = await getEvent(eventId)
        if (!event) {
            return {
                status: ActionStatus.ERROR,
                reason: 'event does not exist',
                id: null
            }
        }
        const attendee: EventAttendee = await getEventAttendee(eventId, userId)
        if (attendee) {
            return {
                status: ActionStatus.ERROR,
                reason: 'invited user is already in event',
                id: null
            }
        }

        const variables = {
            ownerId: ownerId,
            eventId: parseInt(eventId),
            userId: userId,
            timestamp: new Date().toISOString(),
            payload: {
                eventId: eventId,
                userId: userId
            }
        }
        console.log(variables)
        const resp = await client.request(inviteUserToEventMutation, variables)
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
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const params: inviteUserToEventArgs = req.body.input
    const result = await inviteUserToEventHandler(userId, params.userId, params.eventId)
    return res.json(result)
}