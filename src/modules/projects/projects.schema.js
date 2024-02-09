import { Joi } from 'express-validation';

const createProjectSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        team_id: Joi.string().required(),
    })
};

const updateProjectSchema = {
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
        team_id: Joi.string(),
    }),
    params: Joi.object({
        id: Joi.string().required()
    })
}

const deleteProjectSchema = {
    params: Joi.object({
        id: Joi.string().required()
    })
}

export {
    createProjectSchema, deleteProjectSchema, updateProjectSchema
};

