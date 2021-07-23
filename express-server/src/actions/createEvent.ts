import { Request, response, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";
import { client } from "../gql_client";
import { ActionResult, createEventArgs, CreateEventInput } from "../types";

export async function createEventHandler(userId: string, createEventInput: CreateEventInput): Promise<ActionResult> {
    try {
        // create event
        const variables = {
            userId: userId,
            name: createEventInput.name,
            info: createEventInput.info,
            capacity: createEventInput.capacity,
            type: createEventInput.type,
            startDate: createEventInput.startDate,
            timestamp: new Date().toISOString(),
        }
        const resp = await client.request(createEventMutation, variables)
        const eventId = resp['insert_events_one']['id']
        return {
            status: ActionStatus.SUCCESS,
            reason: null,
            id: eventId
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

const createEventMutation = gql`
    mutation CreateEvent($userId: String!, $name: String!, $info: String!, $capacity: Int!, $type: event_type_enum!, $startDate: timestamptz, $timestamp: timestamptz) {
        insert_events_one(object: {capacity: $capacity, info: $info, name: $name, startDate: $startDate, type: $type, attendees: {data: {id: $userId, joinedAt: $timestamp, status: owner}}}) {
            id
        }
    }
`

const insertDomainEventsMutation = gql`
    mutation CreateDomainEvent($type: domain_event_type_enum!, $payload: jsonb!) {
        insert_domain_events_one(object: { type: $type, payload: $payload }) {
            id,
        }
    }
`

export const createEventController = async (req: Request, res: Response) => {
    const params: createEventArgs = req.body.input;

    const createEventInput: CreateEventInput = params.arg1

    const userId: string = req.body.session_variables['x-hasura-user-id']

    const result = await createEventHandler(userId, createEventInput)
    const eventId = result.id
    if (!eventId) return res.json(result)
    const variables = {
        type: 'EVENT_CREATED',
        payload: {
            eventId: eventId
        }
    }
    const resp = await client.request(insertDomainEventsMutation, variables)
    // add error handling here
    return res.json(result)
}