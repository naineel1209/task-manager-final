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

const updateTeamSchema = {
    body: Joi.object({
        team_id: Joi.string().required()
    }).keys({
        name: Joi.string(),
        tl_id: Joi.string()
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

const teamProjectsSchema = {
    params: Joi.object({
        id: Joi.string().required()
    })
}

export {
    addMembersToTeamSchema, createTeamSchema,
    deleteTeamSchema, getSingleTeamSchema, removeMembersFromTeamSchema, teamProjectsSchema, updateTeamSchema
};
