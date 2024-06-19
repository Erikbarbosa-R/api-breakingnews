import jwt from "jsonwebtoken";
import UserService from "../services/user.service.js";
import dotenv from "dotenv";


dotenv.config();

export const authMiddleware=  (req, res, next) => {
try {
    const { authorization }= req.headers;
    
    if (! authorization ) {
       return  res.status(401).json({message: "Authorization is diferent"});
    }

    const parts = authorization.split(" ");

    // if (parts.lenght !== 2) {    
    //     res.status(401).json({message: "Authorization is lenght"});
    // }
    
    const [schema, token] = parts

    if (schema !== "Bearer") {    
        return res.status(401).json({message: "Authorization is diferent schema"});
    }

    // console.log(process.env.SECRET_JWT)

    jwt.verify(token, process.env.SECRET_JWT, async (error, decoded) => {
       if (error) {
        return res.status(401).json({message: "Token is invalid!"});
       }
       
     const user = await UserService.findByIdService(decoded.id);
     if (!user ||  !user.id) {    
         return  res.status(401).json({message: "invalid token!"});
     }      

     req.userId = user.id;
     return  next();
    });

    } catch (err) { 
       return   res.status(500).json({message: err.message});
    }
    
};
