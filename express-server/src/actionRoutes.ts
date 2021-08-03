import { Router } from "express";
import { acceptEventInvitationController } from "./actions/acceptEventInvitation/acceptEventInvitation";
import { acceptFriendRequestController } from "./actions/acceptFriendRequest/acceptFriendRequest";
import { cancelEventInvitationController } from "./actions/cancelEventInvitation/cancelEventInvitation";
import { createEventController } from "./actions/createEvent/createEvent";
import { createUserController } from "./actions/createUser/createUser";
import { declineEventInvitationController, declineEventInvitationHandler } from "./actions/declineEventInvitation/declineEventInvitation";
import { deleteEventController } from "./actions/deleteEvent/deleteEvent";
import { endEventController } from "./actions/endEvent/endEvent";
import { inviteUserToEventController } from "./actions/inviteUserToEvent/inviteUserToEvent";
import { joinEventController } from "./actions/joinEvent/joinEvent";
import { leaveEventController } from "./actions/leaveEvent/leaveEvent";
import { markNotificationAsReadController } from "./actions/markNotificationAsRead/markNotificationAsRead";
import { rejectFriendRequestController } from "./actions/rejectFriendRequest/rejectFriendRequest";
import { removeFriendController } from "./actions/removeFriend/removeFriend";
import { sendFriendRequestController } from "./actions/sendFriendRequest/sendFriendRequest";
import { updateUserController } from "./actions/updateUser/updateUser";
import { voteForMvpController } from "./actions/voteForMvp/voteForMvp";

const router = Router();

// tested
router.post('/createUser', createUserController)

// tested
router.post('/updateUser', updateUserController)

// tested
router.post('/sendFriendRequest', sendFriendRequestController)

// tested
router.post('/acceptFriendRequest', acceptFriendRequestController)

// tested
router.post('/rejectFriendRequest', rejectFriendRequestController)

// tested
router.post('/removeFriend', removeFriendController)

router.post('/putDeviceToken')

router.post('/markNotificationAsRead', markNotificationAsReadController)

// tested
router.post('/createEvent', createEventController)

// tested
router.post('/deleteEvent', deleteEventController)

// tested
router.post('/joinEvent', joinEventController)

// tested
router.post('/leaveEvent', leaveEventController)

router.post('/endEvent', endEventController)

// tested
router.post('/inviteUserToEvent', inviteUserToEventController)

// tested
router.post('/cancelEventInvitation', cancelEventInvitationController)

// tested
router.post('/acceptEventInvitation', acceptEventInvitationController)

// tested
router.post('/declineEventInvitation', declineEventInvitationController)

router.post('/uploadEventFiles')

router.post('/voteForMvp', voteForMvpController)

export default router;