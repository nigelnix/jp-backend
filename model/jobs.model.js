import { Schema, model } from 'mongoose';

// title, description, company, salary, tasks, qualification, deadline
const jobSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide title.']
    },

    employer: {
        type: String,
        required: [true, 'Please provide employer name.']
    },

    salary: {
        type: Number
    },

    tasks: [{
        type: String
    }],

    qualification: [{
        type: String
    }],

    description: {
        type: String
    }, 

    deadline: {
        type: Date,
        required: [true, 'Please provide the deadline for this job']
    }
});


export const Job = model('Job', jobSchema);