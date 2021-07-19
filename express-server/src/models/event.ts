import { gql } from "graphql-request";
import { EventAttendeeStatus } from "../enums";
import { client } from "../gql_client";
import { EventAttendee, EventInfo } from "./eventTypes"

const getEventQuery = gql`
    query GetEvent($eventId: Int!) {
        events_by_pk(id: $eventId) {
            capacity
            endDate
            deleted
            id
            info
            mvpId
            name
            startDate
            status
            type
            winnerId
        }
    }
`

const getEventAttendeeQuery = gql`
    query GetEventAttendee($eventId: Int!, $userId: String!) {
        event_attendees(where: {id: {_eq: $userId}, eventId: {_eq: $eventId}}) {
            id,
            eventId,
            status,
        }
    }
`

export async function getEvent(eventId: string): Promise<EventInfo> {
    try {
        const data = await client.request(getEventQuery, { eventId: parseInt(eventId) })
        const event: EventInfo = data.events_by_pk
        return event
    } catch(e) {
        console.log(e)
        return null
    }
}

export async function getEventAttendee(eventId: string, userId: string): Promise<EventAttendee | null> {
    try {
        const data = await client.request(getEventAttendeeQuery, { eventId: parseInt(eventId), userId })
        const attendee = data.events_by_pk
        const status: string = attendee.status
        return {
            userId: attendee.id,
            eventId: attendee.eventId,
            status: (<any>EventAttendeeStatus)[status]
        }
    } catch(e) {
        console.log(e)
        return null
    }
}