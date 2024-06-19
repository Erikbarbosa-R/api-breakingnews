import  mongoose from 'mongoose';
import  dotenv from "dotenv"
dotenv.config();

const connectDatabase = () => {
     console.log("Wait connectiong to the database...");

     mongoose.connect( process.env.MONGODB_URI )
     .then(() => console.log ("MongoDB Atlas Connected"))
     .catch((err) => console.log (`Error connecting to MongoDB Atlas: ${err}`));
};
export default connectDatabase;
