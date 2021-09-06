const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatroom: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'Chatroom is required!',
        ref: 'chatrooms'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: 'User is required!',
        ref: 'users'
    },
    message: {
        type: String,
        required: 'Message is required!'
    }
},{
    timestamps: true
});

module.exports = mongoose.model('message', messageSchema);