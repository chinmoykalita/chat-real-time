import express from 'express';

const ChatRouter = express.Router({ mergeParams: true });

import { ChatHandler } from '../crud_handler';

ChatRouter.get("/health_check", ChatHandler.healthCheck)

export default ChatRouter;