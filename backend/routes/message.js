const messageRouter = require('express').Router();
const messageController = require('../controllers/messageController');
const auth = require('../middlewares/auth');

messageRouter.get('/:roomId',auth, messageController.getAllmessages);


module.exports = messageRouter;