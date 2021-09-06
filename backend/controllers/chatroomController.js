const mongoose = require('mongoose');
const ChatRoom = mongoose.model('chatrooms');
const sha256 = require('js-sha256');
const jwt = require('jwt-then');
//const ChatRoom = require('../models/Chatroom');


exports.createChatRoom = async (req, res) => {
    try {
        const { name } = req.body;
        
        if( name === undefined){
            res.status(400).json({
                message: 'name undefined, please check!'
            })
        }

        const chatroomExist = await ChatRoom.findOne({ name });
        if  (chatroomExist){
            return res.status(400).json({message:'chat room name already exist!'});
        }

        const chatroom = new ChatRoom({
            name
        });
        const newchatroom = await chatroom.save();
        
        return res.status(200).json(newchatroom);
    } catch (error) {
        return res.status(400).json(error);
    }
}

exports.getAllChatRooms = async (req, res) => {
    try {
        
        const chatrooms = await ChatRoom.find({});
        console.log('return rooms:' + chatrooms)
        return res.status(200).json(chatrooms);    
    } catch (error) {
        //console.log(error);
        return res.status(400).json(error);
    }
    
}

exports.getchatroom = async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const chatRoom = await ChatRoom.findOne({_id: roomId});

        return res.status(200).json(chatRoom);

    } catch (error) {
        console.log(error);
    }
}