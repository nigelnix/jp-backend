import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
mongoose.set('strictQuery', true);
export const conToDB = async() => {
    try {
        await mongoose.connect(process.env.DBURI);
        console.log('Connection has been established 🌻');

      
    } catch (error) {
        console.error(error.message);
    }
};
