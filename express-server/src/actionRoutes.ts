import { Router } from "express";
import { createUserController } from "./actions/createUser";

const router = Router();

router.post('/createUser', createUserController)

router.post('/updateUser')

router.post('sendFriendRequest')

router.post('/acceptFriendRequest')

router.post('/rejectFriendRequest')

router.post('/removeFriend')

router.post('putDeviceToken')

router.post('/markNotificationAsRead')

router.post('/createEvent')

router.post('/deleteEvent')

router.post('/joinEvent')

router.post('/endEvent')

router.post('/inviteUserToEvent')

router.post('/cancelEventInvitation')

router.post('/acceptEventInvitation')

router.post('/declineEventInvitation')

router.post('/uploadEventFiles')

router.post('/voteForMvp')

export default router;