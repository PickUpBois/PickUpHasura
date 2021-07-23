import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus } from "../enums";
import { client } from "../gql_client";
import { getEvent, getEventAttendee } from "../models/event";
import { EventAttendee, EventInfo } from "../models/eventTypes";
import { ActionResult, deleteEventArgs } from "../types";

export async function deleteEventHandler(userId: string, eventId: string): Promise<ActionResult> {
    // check if event exists
    try {
        const attendee: EventAttendee = await getEventAttendee(eventId, userId)
        if (!attendee || attendee.status != EventAttendeeStatus.owner) {
            return {
                status: ActionStatus.ERROR,
                reason: 'only event owners can delete their events',
                id: null
            }
        }
        const event: EventInfo = await getEvent(eventId)
        if (event.deleted == true) {
            return {
                status: ActionStatus.ERROR,
                reason: 'event has already been deleted',
                id: null
            }
        }
        await client.request(deleteEventMutation, { eventId: parseInt(eventId) })
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

const deleteEventMutation = gql`
    mutation DeleteEvent($eventId: Int!) {
        update_events_by_pk(pk_columns: {id: $eventId}, _set: {deleted: true}) {
            id
        }
        insert_domain_events_one(object: {type: EVENT_DELETED, event_id: $eventId}) {
            id
        }
    }
`

export const deleteEventController = async (req: Request, res: Response) => {
    const params: deleteEventArgs = req.body.input;
    const userId: string = req.body.session_variables['x-hasura-user-id']
    const result = await deleteEventHandler(userId, params.eventId)
    return res.json(result)
}