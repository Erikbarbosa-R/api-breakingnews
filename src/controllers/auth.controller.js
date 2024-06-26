import bcrypt from 'bcrypt'
import { loginService, generateToken  } from '../services/auth.service.js';
 
const login = async (req, res) => {
     const { email, password } = req.body;

     try {
          const user =  await loginService(email);

          if (!user) {
              return  res.status(400).json({message: "User or Password not found"})
          }

           const passwordIsValid = bcrypt.compareSync(password, user.password)

          if(!passwordIsValid){
               return  res.status(404).json({message: "User or Password not found "})
          }

          const token = generateToken(user.id)
     
       res.send({token});
     } catch (err) {
       res.status(500).json(err.message);
     }
};

export { login };


