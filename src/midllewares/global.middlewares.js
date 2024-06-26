import  mongoose from 'mongoose';
import UserService from "../services/user.service.js";

export const validId = (req, res, next) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }
    next();
};

export const validUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await UserService.findByIdService(id);

        if (!user) {
            return res.status(400).json({ 
            message: "User not found" 
         });
        }

        req.id = id;
        req.user = user;

        next();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
