import { Router } from "express";
import { startEventController } from "./events/startEvent";

const router = Router()

router.post('/startEvent', startEventController)

export default router