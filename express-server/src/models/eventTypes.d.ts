/*
Model objects that hold the necessary properties of objects related to events
*/

import { EventAttendeeStatus, EventStatus, EventType } from "../enums";

export type EventInfo = {
    id: string,
    name: string,
    info: string,
    capacity: string,
    startDate: Date,
    endDate: Date | null,
    type: EventType,
    status: EventStatus,
    mvpId: string,
    winnerId: string
    deleted: boolean
}

export type EventAttendee = {
    userId: string,
    eventId: string,
    voteCount: number,
    voted: boolean,
    status: EventAttendeeStatus
}

export type EventTeam = {
    id: string
    eventId: string
    scores: number[]
}