import { ActionStatus, EventAttendeeStatus } from '../../enums';
import client from '../../gql_client'
import mockFunction from '../../jestHelpers';
import * as eventModel from '../../models/event'
import { EventAttendee } from '../../models/eventTypes';
import { acceptEventInvitationHandler } from './acceptEventInvitation'

jest.mock('../../gql_client')
jest.mock('../../models/event')

test('baseline test for accept event invitation handler', async () => {
    const attendee: EventAttendee = {
        userId: '1',
        eventId: '2',
        status: EventAttendeeStatus.invited,
        voteCount: 0,
        voted: false
    }
    mockFunction(eventModel.getEventAttendee).mockResolvedValue(attendee)
    mockFunction(client().request).mockResolvedValue({
        update_event_attendees_by_pk: {
            id: '1'
        }
    })
    const result = await acceptEventInvitationHandler('1', '2')
    expect(result.status).toBe(ActionStatus.SUCCESS)
})