import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";
import { client } from "../gql_client";
import { ActionResult } from "../types";

export async function startEventHandler(eventId: string): Promise<ActionResult> {
    console.log(`starting event ${eventId}`)
    try {
        const variables = {
            eventId: parseInt(eventId),
            payload: {
                eventId: eventId
            }
        }
        const resp = await client.request(startEventMutation, variables)
        return {
            status: ActionStatus.SUCCESS,
            reason: null,
            id: null
        }
    } catch(e) {
        return {
            status: ActionStatus.SUCCESS,
            reason: null,
            id: null
        }
    }
}

const startEventMutation = gql`
    mutation StartEvent($eventId: Int!, $payload: jsonb) {
        update_events_by_pk(pk_columns: {id: $eventId}, _set: {status: ip}) {
            id
        }
        insert_domain_events_one(object: {type: EVENT_STARTED, payload: $payload}) {
            id
        }
    }
`

export const startEventController = async (req: Request, res: Response) => {
    const eventId = req.body.payload.eventId
    const result = await startEventHandler(eventId)
    if (result.status == ActionStatus.ERROR) {
        return res.status(400).json({
            message: result.reason
        })
    }
    return res.json(result)
}