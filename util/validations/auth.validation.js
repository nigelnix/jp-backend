import { body } from 'express-validator';
import { User } from '../../model/auth.model.js';


export const userValidation = [
    // body('fullname')
    //     .not().isEmpty().withMessage('Fullname is required.')
    //     .isAlpha().withMessage('Fullname should contains alphabets only.'),
    
    body('email')
        .not().isEmpty().withMessage('Email is required.')
        .isEmail().withMessage('Please enter a valid email.')
        .custom(async(email, { req }) => { 
            const user = await User.findOne({ email });
            if (user) {
                return Promise.reject("This email already in user.")
            }
            return true;
         })
    ,
    
    body('password')
        .not().isEmpty().withMessage('Password is required.')
        .isLength({ min: 5 }).withMessage('Password is too short.'),
        
    body('confirm')
        .not().isEmpty().withMessage('Confirm Password is required.')
        .custom((value, { req }) => {

            if (value !== req.body.password) {
                return Promise.reject('Confirm Password not matched.')
            }
            return true;
        })
]