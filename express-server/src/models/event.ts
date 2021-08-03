import { gql } from "graphql-request";
import { EventAttendeeStatus } from "../enums";
import client from "../gql_client";
import { EventAttendee, EventInfo, EventTeam } from "./eventTypes"

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

const getOpenEventsQuery = gql`
    query OpenEvents {
        events(where: {status: {_eq: open}, deleted: {_eq: false}}) {
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
        event_attendees_by_pk(eventId: $eventId, id: $userId) {
            id,
            eventId,
            status,
            voteCount,
            voted
        }
    }
`

const getEventOwnerQuery = gql`
    query GetEventOwner($eventId: Int!) {
        event_attendees(where: {status: {_eq: owner}, eventId: {_eq: $eventId}}) {
            id
        }
    }
`

const setEventMvpMutation = gql`
    mutation SetEventMvp($eventId: Int!, $mvpId: String!, $payload: jsonb!) {
        update_events_by_pk(pk_columns: {id: $eventId}, _set: {mvpId: $mvpId}) {
            id
        }
        insert_domain_events_one(object: {type: USER_SELECTED_MVP, payload: $payload}) {
            id
        }
    }
`

const getAttendeesQuery = gql`
    query GetEventAttendees($eventId: Int!) {
        event_attendees(where: {eventId: {_eq: $eventId}}) {
            id,
            voteCount,
            status,
            eventId,
            voted
        }
    }  
`

const getEventTeamQuery = gql`
    query GetEventTeam($teamId: Int!) {
    event_teams_by_pk(id: $teamId) {
        id,
        eventId,
        scores
    }
    }
`

export async function getEvent(eventId: string): Promise<EventInfo> {
    try {
        const data = await client().request(getEventQuery, { eventId: parseInt(eventId) })
        const event: EventInfo = data.events_by_pk
        event.startDate = new Date(event.startDate)
        if (event.endDate) {
            event.endDate = new Date(event.endDate)
        }
        return event
    } catch(e) {
        console.log(e)
        return null
    }
}

export async function fetchEventTeam(teamId: string): Promise<EventTeam> {
    console.log(`getting event team with id ${teamId}`)
    try {
        const data = await client().request(getEventTeamQuery, { teamId: parseInt(teamId) })
        const info = data.event_teams_by_pk
        const team: EventTeam = {
            id: info.id,
            eventId: info.eventId,
            scores: info.scores.scores
        }
        console.log(team)
        return team
    } catch(e) {
        console.log(e)
        return null
    }
}

// gets a single event attendee of an event
export async function getEventAttendee(eventId: string, userId: string): Promise<EventAttendee | null> {
    try {
        const data = await client().request(getEventAttendeeQuery, { eventId: parseInt(eventId), userId })
        const attendee = data.event_attendees_by_pk
        if (!attendee) return null
        const status: string = attendee.status
        return {
            userId: attendee.id,
            eventId: attendee.eventId,
            status: (<any>EventAttendeeStatus)[status],
            voteCount: attendee.voteCount,
            voted: attendee.voted
        }
    } catch(e) {
        console.log(e)
        return null
    }
}

// gets the owner of an event
export async function getEventOwnerId(eventId: string): Promise<string | null> {
    try {
        const data = await client().request(getEventOwnerQuery, { eventId: parseInt(eventId) })
        if (data.event_attendees.length == 0) {
            return null
        }
        // return userId of owner
        return data.event_attendees[0].id
    } catch(e) {
        console.log(e)
        return null
    }
}

export async function getOpenEvents(): Promise<EventInfo[]> {
    try {
        const data = await client().request(getOpenEventsQuery)
        if (data.events.length == 0) {
            return []
        }
        return data.events.map ((event: EventInfo) => {
            event.startDate = new Date(event.startDate)
            event.endDate = new Date(event.endDate)
            return event
        })
    } catch(e) {
        console.log(e)
        return []
    }
}

// gets the ids of the attendees of an event
export async function getAttendees(eventId: string): Promise<EventAttendee[]> {
    try {
        const data = await client().request(getAttendeesQuery, { eventId: parseInt(eventId) })
        if (data.event_attendees.length == 0) {
            return null
        }
        // return userId of owner
        const attendees: EventAttendee[] = data.event_attendees.map((attendee: { [x: string]: any; }) => {
            const result: EventAttendee = {
                userId: attendee.id,
                eventId: attendee.eventId,
                status: (<any>EventAttendeeStatus)[attendee.status],
                voteCount: attendee.voteCount,
                voted: attendee.voted
            }
            return result
        })
        return attendees
    } catch(e) {
        console.log(e)
        return []
    }
}

export async function setEventMvp(eventId: string, mvpId: string) {
    try {
        const data = await client().request(setEventMvpMutation, { 
            eventId: parseInt(eventId),
            mvpId: mvpId,
            payload: {
                eventId: eventId,
                userId: mvpId
            }
        })
    } catch(e) {
        console.log(e)
    }
}

