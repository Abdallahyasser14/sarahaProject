import {Router} from 'express';
import * as messagesService from './Services/messages.service.js';
const messageRouter = Router();

messageRouter.post('/sendMessage',messagesService.sendMessageService);
messageRouter.get('/getMessages',messagesService.getMessagesService);









export default messageRouter;