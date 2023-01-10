import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { User } from '../model/auth.model.js';

/* ---------------------------------------------------------------- */
/*                        SIGN-UP CONTROLLER                        */
/* ---------------------------------------------------------------- */
export const signup = async (req, res, next) => {
    try {

        // 0. validation with express-validator
        const validationErrors = validationResult(req);
        if (!validationErrors.isEmpty()) {
            return res.status(400).send({ status: 'validation errors', errors: validationErrors.array() });
        }
        const { fullname, email, password, confirm } = req.body;
        
        
        // 1. Does user data provided?
        if (!fullname || !email || !password || !confirm) {
            return next(createError(400, 'User data does not provided properly.'))
        }
        
        // 2. Password hashing is happening before saving document in DB (in model)
        
        // 3. Create user
        console.log(req.body)
        const newUser = await User.create({ fullname, email, password });


        // Generate jsonwebtoken
        let token;
        if (newUser) {
            token = jwt.sign(
                { userid: newUser._id },
                process.env.JWT_SECRET_KEY,
                { expiresIn: '30d' }
            );
            //remove password from newUser
            newUser.password = undefined;
        }

        // Response + cookie
        res
            .cookie('access_token', token, {
                httpOnly:true,
                expires: new Date(Date.now()+ 3600_000*24*30)
            })
            .send({
                message: 'Success',
                data: newUser
            });
        
    } catch (error) {
        next(error);
    }
}






/* ---------------------------------------------------------------- */
/*                        SIGN-IN CONTROLLER                        */
/* ---------------------------------------------------------------- */
export const signin = async (req, res, next) => {
    try {
        
        const { email, password } = req.body;

        if (!email || !password) {
            return next(createError(400, 'Please provide email and password for sign-in.'))
        }

        //1. find user by email
        const user = await User.findOne({ email }).select('+password');
        
        //2. compare passwords
        if (user && await bcrypt.compare(password, user.password)) {
            //3. create token
            const token = jwt.sign({ userid: user._id }, process.env.JWT_SECRET_KEY, {
                expiresIn: '30d'
            });

            user.password = undefined;  //remove pass

            res
                .cookie('access_token', token, {
                    httpOnly: true,
                    expires: new Date(Date.now()+3600_000 * 24*30)
                })
                .send({
                    status: 'success',
                    message: 'Logged In successfully!'
                })
        } else {
            res.status(401)
                .send({
                    status: 'Login failure',
                    message: 'Email or password is not valid.'
                })
        }


    } catch (error) {
        next(error);
    }
}