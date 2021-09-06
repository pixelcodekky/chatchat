const bp = require('body-parser')
const userRouter = require('./routes/user');
const chatroomRouter = require('./routes/chatroom');
const messageRouter = require('./routes/message');

const express = require('express');
const app = express();


// app.use(express.json());
// app.use(express.urlencoded({extended : true}));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

app.use(require('cors')());

//Routers
app.use('/api/user', userRouter);
app.use('/api/chatroom', chatroomRouter);
app.use('/api/message', messageRouter);

module.exports = app;