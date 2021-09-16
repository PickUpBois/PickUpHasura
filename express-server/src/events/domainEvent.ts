import { Request, Response } from "express";
import eventEmitter from './eventEmitter';

// controller that responds to domain events in the postgres database and uses the event emitter to emit events that nodejs event
// handlers can respond to
export const domainEventController = async (req: Request, res: Response) => {
    const data = req.body.event.data.new
    const type = data.type
    const payload = data.payload
    eventEmitter.emit(type, payload)
    return res.sendStatus(500)
}