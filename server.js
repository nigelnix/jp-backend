import express from 'express';
import {validationResult} from 'express-validator';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routers/auth.router.js';
import jobRouter from './routers/job.router.js'
import { conToDB } from './util/validations/db_config.js';
//to read the cookie from request
import cookieParser from 'cookie-parser';


dotenv.config();

/** CREATE THE APP */
const app = express();


/** CONNECT TO DB */
conToDB();

/** CORE MIDDLEWARES */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


/** CUSTOM/THIRD-PARTY MIDDLEWARES */
app.use(cors());



/** ROUTERS */
app.use('/auth', authRouter);
app.use('/jobs', jobRouter);

/** ERROR HANDLER 404 */
app.use((req, res, next) => {
    const error = new Error('Route Not Found! 😞');
    error.status = 404;
    next(error);
});

/** MAIN ERROR HANDLER */
app.use((error, req, res, next) => { 
    if (error) {
        res.status(error.status || 500).json({msg:error.message})
    }
 })

/** DEFINE PORT */
const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is up and running on port ${port} 👻`));