/*
Defines all enums used by the postgres database
*/

export enum ActionStatus {
    SUCCESS = "SUCCESS",
    ERROR = "ERROR",
    USERNAME_ALREADY_EXISTS = "USERNAME_ALREADY_EXISTS"
}

export enum EventType {
    tennis = "tennis",
    basketball = "basketball"
}

export enum EventStatus {
    open = "open",
    closed = "closed",
    ip = "ip"
}

export enum EventAttendeeStatus {
    owner = "owner",
    invited = "invited",
    ok = "ok",
    conflict = "conflict"
}

export enum FriendStatus {
    friend = "friend"
}

export enum DomainEventType {
    USER_CREATED = 'USER_CREATED',
    USER_LEFT_EVENT = 'USER_LEFT_EVENT',
    USER_JOINED_EVENT = 'USER_JOINED_EVENT',
    USER_INVITED_TO_EVENT = 'USER_INVITED_TO_EVENT',
    USER_ACCEPT_FRIEND_REQUEST = 'USER_ACCEPT_FRIEND_REQUEST',
    USER_REJECTED_FRIEND_REQUEST = 'USER_REJECTED_FRIEND_REQUEST',
    USER_SELECTED_MVP = 'USER_SELECTED_MVP',
    USER_SENT_FRIEND_REQUEST = 'USER_SENT_FRIEND_REQUEST',
    EVENT_STARTED = 'EVENT_STARTED',
    EVENT_DELETED = 'EVENT_DELETED',
    EVENT_FINISHED = 'EVENT_FINISHED',
    EVENT_CREATED = 'EVENT_CREATED',
    USER_VOTED_FOR_MVP = 'USER_VOTED_FOR_MVP'
}

export enum NotificationType {
    friendRequestSend = 'friendRequestSend',
    friendRequestAccept = 'friendRequestAccept',
    friendRequestReject = 'friendRequestReject',
    eventInvitation = 'eventInvitation',
    finishEvent = 'finishEvent',
    voteForMvp = 'voteForMvp',
    selectedMvp = 'selectedMvp',
    leftEvent = 'leftEvent',
    joinedEvent = 'joinedEvent'
}