import createError from 'http-errors';
import { Job } from "../model/jobs.model.js";


//list of all jobs
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find();

    if (!jobs.length) {
      return next(
        createError(204, "There is no job on this api at the moment.")
      );
    }

    res.send({ status: "success", data: jobs });
  } catch (error) {
    next(error);
  }
};


//add a new job
export const addNewJob = async (req, res, next) => {
  try {
    const {
      title,
      employer,
      deadline,
      salary,
      tasks,
      qualification,
      description,
    } = req.body;

    if (!title || !employer || !deadline) {
      return next(
        createError(
          400,
          "Please provide title, employer and deadline for the job."
        )
      );
    }

    const newJob = await Job.create({
      title,
      employer,
      deadline,
      salary,
      tasks,
      qualification,
      description,
    });
      

      res.send({ status: 'success', data: newJob });
  } catch (error) {
    next(error);
  }
};
