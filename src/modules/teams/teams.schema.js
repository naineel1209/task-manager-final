import { Joi } from "express-validation";

const createTeamSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        tl_id: Joi.string().required(),
    })
};

const deleteTeamSchema = {
    body: Joi.object({
        team_id: Joi.string().required()
    })
}

const addMembersToTeamSchema = {
    body: Joi.object({
        team_id: Joi.string().required(),
        user_id: Joi.alternatives().try(
            Joi.string().required(), // Single string
            Joi.array().items(Joi.string().required()) // Array of strings
        ).required(),
    })
}

const removeMembersFromTeamSchema = {
    body: Joi.object({
        team_id: Joi.string().required(),
        user_id: Joi.alternatives().try(
            Joi.string().required(), // Single string
            Joi.array().items(Joi.string().required()) // Array of strings
        ).required(),
    })
}

const getSingleTeamSchema = {
    params: Joi.object({
        id: Joi.string().required()
    })
}

export {
    createTeamSchema,
    addMembersToTeamSchema,
    removeMembersFromTeamSchema,
    getSingleTeamSchema,
    deleteTeamSchema
}