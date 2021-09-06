const userRouter = require('express').Router();
const userController = require('../controllers/userController');

userRouter.post('/login', userController.login);

userRouter.post('/register', userController.register);
userRouter.get('/:userId', userController.getuser);
userRouter.get('/', userController.getAllUser);

module.exports = userRouter;