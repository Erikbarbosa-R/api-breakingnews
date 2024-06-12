import  mongoose from 'mongoose';

const connetcDatabase = () => {
     console.log("Wait connectiong to the database")
     console.log(process.env)

     mongoose
     .connect( process.env.MONGODB_URI , 
       {
         useNewUrlParser: true,  
         useUnifiedTopology: true 
       }
    )
     .then(() => console.log ("MongoDB Atlas Connected"))
     .catch((error) => console.log ('Error connecting to MongoDB Atlas: ${err}'));
}
export default connetcDatabase;