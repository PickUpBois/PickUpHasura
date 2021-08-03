import events from 'events';
import { DomainEventType } from '../enums';
import { eventCreatedHandler, eventDeletedHandler, votedForMvpHandler } from './eventHandlers/eventHandler';
import { addFinishEventNotification, addUserAcceptedFriendRequestNotification, addUserInvitedToEventNotification, addUserJoinedEventNotification, addUserLeftEventNotification, addUserRejectedFriendRequestNotification, addUserSelectedMvpNotification, addUserSentFriendRequestNotification, addVoteForMvpNotification } from './eventHandlers/notificationHandler';

class EventEmitter extends events {

}

const eventEmitter = new EventEmitter();

export default eventEmitter;

// send join event notification to owner whenever user joins an event
eventEmitter.on(DomainEventType.USER_JOINED_EVENT, addUserJoinedEventNotification)

// send left event notification to owner whenever user leaves event
eventEmitter.on(DomainEventType.USER_LEFT_EVENT, addUserLeftEventNotification)

// send invited to event notification whenever a user is invited to an event
eventEmitter.on(DomainEventType.USER_INVITED_TO_EVENT, addUserInvitedToEventNotification)

// send accepted friend request notification whenever a user accepts a friend request
eventEmitter.on(DomainEventType.USER_ACCEPT_FRIEND_REQUEST, addUserAcceptedFriendRequestNotification)

// send rejected friend request notification whenever a user rejects a friend request
eventEmitter.on(DomainEventType.USER_REJECTED_FRIEND_REQUEST, addUserRejectedFriendRequestNotification)

// send selected mvp notification whenever a user has been selected mvp
eventEmitter.on(DomainEventType.USER_SELECTED_MVP, addUserSelectedMvpNotification)

// send user sent friend request notification whenever a user has sent a friend request
eventEmitter.on(DomainEventType.USER_SENT_FRIEND_REQUEST, addUserSentFriendRequestNotification)

// send a finish event notification to owner whenever the event has started
eventEmitter.on(DomainEventType.EVENT_STARTED, addFinishEventNotification)

// starts a scheduled task of starting an event based on events start date
eventEmitter.on(DomainEventType.EVENT_CREATED, eventCreatedHandler)

// deletes the task of starting the event becasue the event was deleted
eventEmitter.on(DomainEventType.EVENT_DELETED, eventDeletedHandler)

eventEmitter.on(DomainEventType.EVENT_FINISHED, addVoteForMvpNotification)

eventEmitter.on(DomainEventType.USER_VOTED_FOR_MVP, votedForMvpHandler)

// check if event has found an mvp whenever a user votes for mvp
