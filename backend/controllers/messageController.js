const Message = require('../models/Message');
const User = require('../models/User');

exports.getAllmessages = async (req, res) => {
    try {
        const chatroomId = req.params.roomId;
        const messages = await Message.find({chatroom: chatroomId}).sort({createdAt: 1});   

        return res.status(200).json(messages);     
    } catch (error) {
        return res.status(400).json(error)
    }
}