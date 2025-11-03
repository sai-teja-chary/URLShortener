import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


export const connectToDB = async () =>{
  try {
    await mongoose.connect(process.env.MONGO_URI)
    mongoose.set("debug", true)
    
  } catch (error) {
    console.error(error)
    process.exit()
  }
}