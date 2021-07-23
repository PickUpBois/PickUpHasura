createUserMutation = """
    mutation CreateUser($input: CreateUserInput!) {
        createUser(arg1: $input) {
            status,
            reason,
            id,
        }
    }
"""

createEventMutation = """
mutation CreateEvent($input: CreateEventInput!) {
  createEvent(arg1: $input) {
    status,
    reason,
    id,
  }
}
"""

acceptEventInvitationMutation = """
mutation AcceptEventInvitation($eventId: Int!) {
  acceptEventInvitation(eventId: $eventId) {
    status,
    reason
  }
}
"""

declineEventInvitationMutation = """
mutation DeclineEventInvitation($eventId: Int!) {
  declineEventInvitation(eventId: $eventId) {
    status,
    reason
  }
}
"""

cancelEventInvitationMutation = """
mutation CancelEventInvitation($eventId: Int!, $userId: String!) {
  cancelEventInvitation(eventId: $eventId, userId: $userId) {
    status,
    reason
  }
}
"""

deleteEventMutation = """
mutation DeleteEvent($eventId: Int!) {
  deleteEvent(eventId: $eventId) {
    status,
    reason
  }
}
"""

endEventMutation = """
mutation EndEvent($eventId: Int!, $team1_members: [String!]!, $team2_members: [String!]!, $team1_win: Boolean!, $team1_scores: [Int!]!, $team2_scores: [Int!]!) {
  endEvent(eventId: $eventId, team1_members: $team1_members, team2_members: $team2_members, team1_scores: $team1_scores, team2_scores: $team2_scores, team1_win: $team1_win) {
    status,
    reason
  }
}
"""

inviteUserToEvent = """
mutation InviteUserToEvent($eventId: Int!, $userId: String!) {
  inviteUserToEvent(eventId: $eventId, userId: $userId) {
    reason,
    status
  }
}
"""

joinEventMutation = """
mutation JoinEvent($eventId: Int!) {
  joinEvent(eventId: $eventId) {
    reason,
    status
  }
}
"""

leaveEventMutation = """
mutation LeaveEvent($eventId: Int!) {
  leaveEvent(eventId: $eventId) {
    reason,
    status
  }
}
"""

markNotiticationAsReadMutation = """
mutation MarkNotificationAsRead($notificationId: Int!) {
  markNotificationAsRead(notificationId: $notificationId) {
    status,
    reason
  }
}
"""

rejectFriendRequestMutation = """
mutation RejectFriendRequest($userId: String!) {
  rejectFriendRequest(friendId: $userId) {
    status,
    reason
  }
}
"""

acceptFriendRequestMutation = """
mutation AcceptFriendRequest($userId: String!) {
  acceptFriendRequest(friendId: $userId) {
    status,
    reason
  }
}
"""

removeDeviceTokenMutation = """
mutation RemoveDeviceToken($token: String!) {
  removeDeviceToken(token: $token) {
    status,
    reason
  }
}
"""

removeFriendMutation = """
mutation RemoveFriend($userId: String!) {
  removeFriend(friendId: $userId) {
    status,
    reason
  }
}
"""

sendFriendRequestMutation = """
mutation SendFriendRequest($friendId: String!) {
  sendFriendRequest(friendId: $friendId) {
    status,
    reason
  }
}
"""

voteForMvp = """
mutation VoteForMvp($eventId: Int!, $userId: String!) {
  voteForMvp(eventId: $eventId, userId: $userId) {
    status,
    reason
  }
}
"""

updateUser = """
mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(arg1: $input) {
    status,
    reason
  }
}
"""