import { Joi } from "express-validation";

const createTaskSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        categories: Joi.array().items(Joi.string()).required(),
        // status: Joi.string().required().valid("TODO", "INPROGRESS", "DONE", "TESTING", "REOPEN"),
        assignedTo: Joi.string().required(),
        dueDate: Joi.date().required(),
    }),
    params: Joi.object({
        id: Joi.string().required(),
    })
}

const updateTaskSchema = {
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
        categories: Joi.array().items(Joi.string()),
        status: Joi.string().valid("TODO", "INPROGRESS", "DONE", "TESTING", "REOPEN"),
        assigned_to_id: Joi.string(),
        due_date: Joi.date(),
    }),
    params: Joi.object({
        id: Joi.string().required(),
        task_id: Joi.string().required(),
    })
}

const getProjectTasksSchema = {
    params: Joi.object({
        id: Joi.string().required(),
    })
}

const deleteTaskSchema = {
    params: Joi.object({
        id: Joi.string().required(),
        task_id: Joi.string().required(),
    })
}

const getSingleProjectTaskSchema = {
    params: Joi.object({
        id: Joi.string().required(),
        task_id: Joi.string().required(),
    })
}

export {
    createTaskSchema, deleteTaskSchema, getProjectTasksSchema, getSingleProjectTaskSchema, updateTaskSchema
};

