import  User from "../models/user.js"

const createService = (body) => User.create(body);

const findAllService = () => User.find()

const findByIdService = (idUser) => User.findById(idUser)

const updateService = (
    id,
    name,
    username, 
    email, 
    password, 
    avatar, 
    background
) => 
 User.findOneAndUpdate(
    {_id: id},
    { name, username, email, password, avatar, background }
);
export default {
    createService,
    findAllService,
    findByIdService,
    updateService,
};