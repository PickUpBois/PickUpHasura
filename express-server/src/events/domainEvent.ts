import { Request, Response } from "express";
import eventEmitter from './eventEmitter';

export const domainEventController = async (req: Request, res: Response) => {
    const data = req.body.event.data.new
    const type = data.type
    const payload = data.payload
    eventEmitter.emit(type, payload)
    return res.sendStatus(500)
}