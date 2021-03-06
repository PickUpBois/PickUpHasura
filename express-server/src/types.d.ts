import { ActionStatus } from './enums'

type Maybe<T> = T | null

type timestamptz = string

type CreateUserInput = {
  firstName: string
  lastName: string
  username: string
  college?: Maybe<string>
}

type UpdateUserInput = {
  firstName?: Maybe<string>
  lastName?: Maybe<string>
  username?: Maybe<string>
  photoUrl?: Maybe<string>
  college?: Maybe<string>
}

type CreateEventInput = {
  name: string
  info: string
  startDate: timestamptz
  capacity: number
  type: string
  status: string
}

type EndEventInput = {
  eventId: string
  team1_members: Array<string>
  team2_members: Array<string>
  team1_scores: Array<number>
  team2_scores: Array<number>
  team1_win: boolean
}

type SampleInput = {
  username: string
  password: string
}

type ActionResult = {
  id: Maybe<string>
  status: ActionStatus
  reason?: Maybe<string>
}

type SampleOutput = {
  accessToken: string
}

type Mutation = {
  acceptEventInvitation: ActionResult
  acceptFriendRequest: ActionResult
  cancelEventInvitation: ActionResult
  createEvent: ActionResult
  createUser: ActionResult
  declineEventInvitation: ActionResult
  deleteEvent: ActionResult
  endEvent: ActionResult
  inviteUserToEvent: ActionResult
  joinEvent?: Maybe<ActionResult>
  leaveEvent: ActionResult
  markNotificationAsRead: ActionResult
  putDeviceToken: ActionResult
  rejectFriendRequest: ActionResult
  removeDeviceToken: ActionResult
  removeFriend: ActionResult
  sendFriendRequest: ActionResult
  updateUser: ActionResult
  voteForMvp: ActionResult
}

type acceptEventInvitationArgs = {
  eventId: string
}

type acceptFriendRequestArgs = {
  friendId: string
}

type cancelEventInvitationArgs = {
  userId: string
  eventId: string
}

type createEventArgs = {
  arg1: CreateEventInput
}

type createUserArgs = {
  arg1: CreateUserInput
}

type declineEventInvitationArgs = {
  eventId: string
}

type deleteEventArgs = {
  eventId: string
}

type endEventArgs = {
  input: EndEventInput
}

type inviteUserToEventArgs = {
  userId: string
  eventId: string
}

type joinEventArgs = {
  eventId: string
}

type leaveEventArgs = {
  eventId: string
}

type markNotificationAsReadArgs = {
  notificationId: string
}

type putDeviceTokenArgs = {
  token: string
}

type rejectFriendRequestArgs = {
  friendId: string
}

type removeDeviceTokenArgs = {
  token: string
}

type removeFriendArgs = {
  friendId: string
}

type sendFriendRequestArgs = {
  friendId: string
}

type updateUserArgs = {
  arg1: UpdateUserInput
}

type voteForMvpArgs = {
  eventId: string
  userId: string
}

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