import { Request, Response } from "express"

function healthCheck(req: Request, res:Response) {
    res.send({status: "OK", hostname: req.hostname})
};

export const ChatHandler = {
    healthCheck
}