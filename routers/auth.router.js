import express from 'express';
import { signin, signup } from '../controllers/auth.controller.js';
import { userValidation } from '../util/validations/auth.validation.js';
const router = express.Router();


// sign-up
router
    .route('/signup')
    .post(userValidation, signup);


// sign-in
router.route('/signin')
    .post(signin);





export default router;