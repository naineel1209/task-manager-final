import { Joi } from "express-validation";

const createTeamSchema = {
    body: Joi.object({
        name: Joi.string().required(),
        tl_id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
    })
};

const deleteTeamSchema = {
    body: Joi.object({
        team_id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
}

const updateTeamSchema = {
    body: Joi.object({
        team_id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    }).keys({
        name: Joi.string(),
        tl_id: Joi.string().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
}

const addMembersToTeamSchema = {
    body: Joi.object({
        team_id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        user_id: Joi.alternatives().try(
            Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), // Single string
            Joi.array().items(Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) // Array of strings
        ).required(),
    })
}

const removeMembersFromTeamSchema = {
    body: Joi.object({
        team_id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
        user_id: Joi.alternatives().try(
            Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i), // Single string
            Joi.array().items(Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) // Array of strings
        ).required(),
    })
}

const getSingleTeamSchema = {
    params: Joi.object({
        id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
}

const teamProjectsSchema = {
    params: Joi.object({
        id: Joi.string().required().regex(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
}

export {
    addMembersToTeamSchema, createTeamSchema,
    deleteTeamSchema, getSingleTeamSchema, removeMembersFromTeamSchema, teamProjectsSchema, updateTeamSchema
};
