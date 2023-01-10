import createError from 'http-errors';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { User } from '../../model/auth.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        
        let token;
        //extract token from request
        if (req.cookies.access_token) {
            token = req.cookies.access_token;
        }

        //if token doesn't exist
        if (!token) {
            return next(createError(401, 'You are not logged in. Please login first to get access.'));
        }


        //1. verify token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);

        //2. if user deleted the account after generating token
        const tokenOwner = await User.findById(decoded.userid);
        if (!tokenOwner) {
            return next(createError(401, 'This user already deleted! The token is not valid anymore'));
        }


        //3. if user updated the password after generating token
        if (tokenOwner.passChangeDate && (tokenOwner.passChangeDate.getTime()) / 1000 > decoded.iat) {
            return next(createError(401, 'The password of this user is changed recently. Please login again!'));
        }


        //grant access to protected route
        req.user = tokenOwner;
        next();

    } catch (error) {
        next(error)
    }
}


/// specify the accessibility level - middleware ///

export const restrictTo = (...allowedRoles) => {
    return (req, res, next) => { 
        if (!allowedRoles.includes(req.user.role)) {
            return next(createError(403, 'You have no permission to do this operation.'))
        }

        next();
     }
}


