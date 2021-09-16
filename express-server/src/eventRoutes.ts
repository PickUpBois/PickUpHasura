/*
Defines all misc routes not used by Hasura Actions
*/

import { Router } from "express";
import { domainEventController } from "./events/domainEvent";
import { startEventController } from "./events/startEvent";

const router = Router()

router.post('/startEvent', startEventController)

router.post('/domainEvent', domainEventController)

export default router