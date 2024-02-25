import { Joi } from 'express-validation';

const createProjectSchema = {
    body: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        team_id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
    })
};

const updateProjectSchema = {
    body: Joi.object().keys({
        title: Joi.string(),
        description: Joi.string(),
        team_id: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
    }),
    params: Joi.object({
        id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
}

const deleteProjectSchema = {
    params: Joi.object({
        id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
}

export {
    createProjectSchema, deleteProjectSchema, updateProjectSchema
};

