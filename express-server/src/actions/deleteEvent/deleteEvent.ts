import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus, EventAttendeeStatus } from "../../enums";
import client from "../../gql_client";
import { getEvent, getEventAttendee } from "../../models/event";
import { EventAttendee, EventInfo } from "../../models/eventTypes";
import { ActionResult, deleteEventArgs } from "../../types";

export async function deleteEventHandler(userId: string, eventId: string): Promise<ActionResult> {
    try {
        // if event owner does not exist or is not the owner, return error
        const attendee: EventAttendee = await getEventAttendee(eventId, userId)
        if (!attendee || attendee.status != EventAttendeeStatus.owner) {
            return {
                status: ActionStatus.ERROR,
                reason: 'only event owners can delete their events',
                id: 'na'
            }
        }
        // if event is already deleted, returne error
        const event: EventInfo = await getEvent(eventId)
        if (event.deleted == true) {
            return {
                status: ActionStatus.ERROR,
                reason: 'event has already been deleted',
                id: 'na'
            }
        }
        // delete event
        await client().request(deleteEventMutation, { eventId: parseInt(eventId) })
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