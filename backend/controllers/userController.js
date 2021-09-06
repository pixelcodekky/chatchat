const mongoose = require('mongoose');
const User = mongoose.model("users");
const sha256 = require('js-sha256');
const jwt = require('jwt-then');


exports.login = async (req, res) => {
    
    const {email, password} = req.body;

    const user = await User.findOne({email, password: sha256(password + process.env.SALT)});

    if(!user){
        return res.status(400).json({message: 'User Cannot find'})
    }

    const token = await jwt.sign({id: user._id}, process.env.SECRET);

    return res.status(200).json({
        payload: user,
        token
    });


};

exports.getuser = async (req, res) => {
    try {
        
        const userId = req.params.userId;
        const user = await User.findOne({_id: userId});
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json(error);
    }
}

exports.getAllUser = async (req,res) => {
    try {
        const users = await User.find({});
        return res.status(200).json(users);
    } catch (error) {
        return res.status(400).json(error)
    }
}

exports.register = async (req, res) => {
    try{
        const {username, email, password } = req.body;

        const emailRegex = /[@gmail.com|@outlook.com]$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({mesage:'Email format not correct'})
        }
        if(password.length < 6){
            return res.status(400).json({message: 'Password must be at least 6 characters'});
        }
    
        const userExist = await User.findOne({email});
        if(userExist){
            return res.status(400).json({message: 'user already exist'});
        }

        const newUser = new User({username,email,password: sha256(password + process.env.SALT)});
    
        const createdUser = await newUser.save();
        return res.status(200).json(createdUser);

    }catch(err){
        console.log(err);
    }
};