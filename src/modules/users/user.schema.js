import { Joi } from "express-validation";

const registerSchema = {
    body: Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().required(),
        password: Joi.string().min(8).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required()
    })
};

const loginSchema = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
}

const logoutSchema = {
    cookies: Joi.object({
        accessToken: Joi.string().required()
    })
}

const changeUserRoleSchema = {
    body: Joi.object({
        id: Joi.string().required(),
        role: Joi.string().required().valid("ADMIN", "DEV", "TL")
    })
}

const getSingleUserSchema = {
    params: Joi.object({
        id: Joi.string().required()
    })
}

const updateUserSchema = {
    //optional validation for the user to update the user details
    body: Joi.object().keys({
        email: Joi.string().email(),
        first_name: Joi.string(),
        last_name: Joi.string()
    })
}

const changePasswordSchema = {
    body: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).required(),
        confirmedNewPassword: Joi.valid(Joi.ref('newPassword')).required() // Validate against the value of 'field1'
            .messages({
                'any.only': 'confirmedNewPassword must have the same value as newPassword',
            }),
    }),
}

export {
    changePasswordSchema, changeUserRoleSchema,
    getSingleUserSchema, loginSchema,
    logoutSchema, registerSchema, updateUserSchema
};

