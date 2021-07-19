import { Request, Response } from "express";
import { gql } from "graphql-request";
import { ActionStatus } from "../enums";
import { createEventArgs, CreateEventInput } from "../types";

export function createEventHandler(userId: string, createEventInput: CreateEventInput) {
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
    } catch(e) {
        console.log(e)
        return {
            status: ActionStatus.ERROR,
            reason: e
        }
    }
}

const createEventMutation = gql`
    mutation CreateEvent($userId: String!, $name: String!, $info: String!, $capacity: Int!, $type: event_type_enum!, $startDate: timestamptz, $timestamp: timestamptz) {
        insert_events_one(object: {capacity: $capacity, info: $info, name: $name, startDate: $startDate, type: $type, attendees: {data: {id: $userId, joinedAt: $timestamp, status: owner}}, domainEvents: {data: {type: USER_CREATED_EVENT}}}) {
            id
        }
    }
`

export const createEventController = async (req: Request, res: Response) => {
    const params: createEventArgs = req.body.input;

    const createEventInput: CreateEventInput = params.arg1
    
    const userId: string = req.header('X-Hasura-User-Id')
}