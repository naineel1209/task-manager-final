import { Joi } from "express-validation";

const getCommentsSchema = {
    params: Joi.object({
        task_id: Joi.string().required(),
    })
}

const postCommentsSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
    }),
    params: Joi.object({
        task_id: Joi.string().required(),
    })
}

const patchCommentsSchema = {
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string()
    })
}

const deleteCommentsSchema = {
    params: Joi.object({
        task_id: Joi.string().required(),
        comment_i: Joi.string().required(),
    })
}

export { deleteCommentsSchema, getCommentsSchema, patchCommentsSchema, postCommentsSchema };

