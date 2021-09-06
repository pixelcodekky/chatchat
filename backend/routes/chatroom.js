const chatroomRouter = require('express').Router();
const chatroomController = require('../controllers/chatroomController');
const auth = require('../middlewares/auth');

chatroomRouter.post('/',auth, chatroomController.createChatRoom);
chatroomRouter.get('/',auth, chatroomController.getAllChatRooms);
chatroomRouter.get('/:roomId',auth, chatroomController.getchatroom);


module.exports = chatroomRouter;