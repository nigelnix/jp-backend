import { Schema, model } from 'mongoose';
import bcrypt from "bcrypt";


// User Schema
const userSchema = new Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required.'],

    },

    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [5, 'Password is too short'],
        select: false
    },
    
    confirm: {
        type: String,
        minlength: [5, 'Confirm Password is too short'],
        validate: {
            validator: function (confirm) {
                return confirm === this.password
            },
            message: 'Passwords are not match.'
        }
    },

    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },

    passChangeDate: {
        type: Date
    },

    active: {
        type: Boolean,
        default: false
    }

})





// hashPass + reset confirm
userSchema.pre("save", async function (next) {
    try {
        console.log('first')
        if (!this.isModified('password')) return next();

        this.password = await bcrypt.hash(this.password, 12);
        this.confirm = undefined;

        next();

    } catch (error) {
        next(error)
    }
});


export const User = model('User', userSchema); 