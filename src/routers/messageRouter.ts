import { Router } from 'express';
import { sendMessage, getMessages, markAsRead, deleteMessage } from '#controllers';
import { authenticate } from '#middlewares';

const messageRouter = Router();

messageRouter.get('/', authenticate, getMessages);
messageRouter.post('/', authenticate, sendMessage);
messageRouter.post('/read/:postId', authenticate, markAsRead);
messageRouter.delete('/:id', authenticate, deleteMessage);

export default messageRouter;