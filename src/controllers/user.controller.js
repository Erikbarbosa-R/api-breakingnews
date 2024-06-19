
// import UserService from "../services/user.service.js";
import userService from "../services/user.service.js";
import mongoose from "mongoose";

const create = async (req, res) => {
   try {
    const {name, username, email, password, avatar, background} = req.body;

    if (!username || !name || !email || !password || !avatar || !background ) {
        res.status(400).json({message:"Submit all fields for registration"});
    }

    const user = await userService
    .createService(req.body)
    .catch((err) => console.log(err,message));

    if (!user) {
        return res.status(400).json({
            message: "Error creating User",
        });
    }
    // if (!user) {
    //     return res.status(400).send({ message: "Submit all fields for registration"});
    // }
    res.status(201).json({
        message: "User created successfully",
        user: {
            id: user._id,
            name,
            username,
            email,
            password,
            avatar,
            background,
        },
    });
} catch (err) {
    res.status(500).json({menssage: err.message})
}
};

const findAll = async (req, res) => {
  try {
    const users =  await userService.findAllService();

    if(users.length === 0) {
        return res.status(400).json({ message: "there are no registered users"})
    }
    res.send(users);} catch  (err) {
        res.status(500).json({message: err.message})
    }
};

const findById = async (req, res) => {
  try { 
    const user = req.user;

    res.send(user);} catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const update = async (req, res) => {
   try {
    const {name, username, email, password, avatar, background} = req.body;

    if (!name && !username && !email && !password && !avatar && !background) {
        res.status(400).json({message:" Submit at least one field for update"});
    }

    const {id, user} = req;


    
    await userService.updateService(
        id,
        name,
        username, 
        email, 
        password, 
        avatar, 
        background
    );

    res.sendStatus({message: "User successfully updated!"})} catch (err) {
        res.status(500).json({ message: err.message });
    }

};

export default  {create, findAll, findById, update };