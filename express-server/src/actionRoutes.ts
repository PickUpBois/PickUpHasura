import { Router } from "express";
import { acceptEventInvitationController } from "./actions/acceptEventInvitation";
import { acceptFriendRequestController } from "./actions/acceptFriendRequest";
import { cancelEventInvitationController } from "./actions/cancelEventInvitation";
import { createEventController } from "./actions/createEvent";
import { createUserController } from "./actions/createUser";
import { declineEventInvitationController, declineEventInvitationHandler } from "./actions/declineEventInvitation";
import { deleteEventController } from "./actions/deleteEvent";
import { endEventController } from "./actions/endEvent";
import { inviteUserToEventController } from "./actions/inviteUserToEvent";
import { joinEventController } from "./actions/joinEvent";
import { leaveEventController } from "./actions/leaveEvent";
import { rejectFriendRequestController } from "./actions/rejectFriendRequest";
import { removeFriendController } from "./actions/removeFriend";
import { sendFriendRequestController } from "./actions/sendFriendRequest";
import { updateUserController } from "./actions/updateUser";

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

router.post('/markNotificationAsRead')

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

router.post('/voteForMvp')

export default router;