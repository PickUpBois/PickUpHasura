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
    status: EventAttendeeStatus
}