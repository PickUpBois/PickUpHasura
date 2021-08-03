type UserCreatedPayload = {
    userId: string
}

type UserLeftEventPayload = {
    userId: string
    eventId: string
}

type UserJoinedEventPayload = {
    userId: string
    eventId: string
}

type UserInvitedToEventPayload = {
    userId: string
    eventId: string
}

type UserAcceptFriendRequestPayload = {
    senderId: string
    sendeeId: string
}

type UserRejectFriendRequestPayload = {
    senderId: string
    sendeeId: string
}

type UserSelectedMvpPayload = {
    userId: string
    eventId: string
}

type UserSentFriendRequestPayload = {
    senderId: string
    sendeeId: string
}

type EventStartedPayload = {
    eventId: string
}

type EventDeletedPayload = {
    eventId: string
}

type EventFinishedPayload = {
    eventId: string
}

type EventCreatedPayload = {
    eventId: string
}

type VoteForMvpPayload = {
    eventId: string
    voterId: string
    voteeId: string
}




