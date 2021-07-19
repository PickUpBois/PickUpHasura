import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";
import { deleteEventArgs } from "../types";

export function deleteEventHandler(userId: string) {
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

const deleteEventMutation = gql`
    mutation DeleteEvent($eventId: Int!, $payload: jsonb) {
        update_events_by_pk(pk_columns: {id: $eventId}, _set: {deleted: true}) {
            id
        }
        
        insert_domain_events_one(object: { type: USER_DELETED_EVENT, payload: $payload }) {
            id 
        }
    }
`

export const deleteEventController = async (req: Request, res: Response) => {
    const params: deleteEventArgs = req.body.input;
    const userId: string = req.header('X-Hasura-User-Id')
}