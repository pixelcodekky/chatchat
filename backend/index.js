require('dotenv').config();

//Database Connection
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.connection.on('error', (err) => {
    console.log('Mongoose Error : ' + err.message);
});

mongoose.connection.once('open', () =>{
    console.log('DB Connected');
})

//Models
require('./models/User');
require('./models/Message');
require('./models/Chatroom');

const app = require('./app');

const server = app.listen(8800, () => {
    console.log('server listening on port : 8800');
});

const io = require('socket.io')(server,{cors: {}});
const jwt = require('jwt-then');

const Message = mongoose.model('message');
const User = mongoose.model('users');

// check authentication
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.query.token;
        const payload = await jwt.verify(token, process.env.SECRET);
        socket.userId = payload.id;

        next();
    } catch (error) {
         console.log(error);
    }

})

//from client
io.on('connection', (socket) => {
    //console.log('Connected : ' + socket.userId);

    socket.on('disconnect', () => {
        //console.log('Disconnected : ' + socket.userId);
    });

    socket.on('joinRoom', ({chatroomId}) => {
        socket.join(chatroomId);
        //console.log('User join group : ' + chatroomId);
    });

    socket.on('leaveRoom', ({chatroomId}) => {
        socket.leave(chatroomId);
        //console.log('User leave group : ' + chatroomId);
    });

    socket.on('chatroomMessage', async ({chatroomId, message}) => {
        if(message.trim().length > 0){
            const user = await User.findOne({_id: socket.userId });
            //console.log(user);
            const newMessage = new Message({chatroom: chatroomId, user: socket.userId, message});
            //console.log(newMessage);
            io.to(chatroomId).emit('newMessage', {
                message,
                name: user.username,
                userId: socket.userId
            });

            await newMessage.save();
        }
        
    });

});

