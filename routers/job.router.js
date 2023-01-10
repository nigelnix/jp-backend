import express from 'express';
import { addNewJob, getAllJobs } from '../controllers/job.controller.js';
import { protectRoute, restrictTo } from '../util/validations/protect_route.js';
const router = express.Router();


router.route('/')
    .get(protectRoute, restrictTo('admin'), getAllJobs)
    .post(protectRoute, restrictTo('admin'), addNewJob);






export default router;