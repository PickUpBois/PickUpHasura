import { makeExecutableSchema } from 'graphql-tools';
import {scheduledJobs, scheduleJob} from 'node-schedule';
import { getAttendees, getEvent, getOpenEvents, setEventMvp } from '../../models/event';
import { startEventHandler } from '../startEvent';

export async function eventCreatedHandler(payload: EventCreatedPayload) {
    const eventId = payload.eventId
    const jobId = `start:${eventId}`
    const event = await getEvent(eventId)
    if (event.startDate <= new Date()) {
        console.log('starting event instantly')
        await startEventHandler(eventId)
    } else {
        console.log(`scheduled event to start at ${event.startDate}`)
        scheduleJob(jobId, event.startDate, async () => {
            await startEventHandler(eventId)
        })
    }
}

export async function votedForMvpHandler(payload: VoteForMvpPayload) {
    const { eventId } = payload
    const attendees = await getAttendees(eventId)
    const nonVotedAttendees = attendees.filter(attendee => !attendee.voted)
    if (nonVotedAttendees.length == 0) {
        const sortedAttendeesByVoteCount = [...attendees].sort((n1, n2) => n1.voteCount - n2.voteCount)
        const maxAttendee = sortedAttendeesByVoteCount[sortedAttendeesByVoteCount.length - 1]
        const maxVote = maxAttendee.voteCount
        const maxAttendees = attendees.filter(attendee => attendee.voteCount == maxVote)
        const mvp = attendees[getRandomInt(maxAttendees.length)]
        await setEventMvp(eventId, mvp.userId)
    } 
}

export async function eventDeletedHandler(payload: EventDeletedPayload) {
    const eventId = payload.eventId
    const jobId = `start:${eventId}`
    const job = scheduledJobs[jobId]
    if (job) {
        job[jobId].cancel()
    }
}

export async function startOpenEvents() {
    const events = await getOpenEvents()
    events.forEach((event) => {
        const jobId = `start:${event.id}`
        const start = event.startDate
        scheduleJob(jobId, event.startDate, async () => {
            await startEventHandler(event.id)
        })
    })
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

