import { Router } from 'express';
import { validate } from 'express-validation';
import {
    checkPermission,
    verifyToken,
} from '../../middlewares/user.middleware.js';
import {
    getUserTasks
} from '../tasks/tasks.controller.js';
import {
    changePassword,
    changeUserRole,
    deleteUser,
    getSingleUser,
    loginUser,
    logoutUser,
    registerUser,
    updateUser
} from './user.controller.js';
import {
    changePasswordSchema,
    changeUserRoleSchema,
    getSingleUserSchema,
    loginSchema,
    logoutSchema,
    registerSchema,
    updateUserSchema,
} from './user.schema.js';

const router = Router({ mergeParams: true });

//!PATH - /user

/**
 * @swagger
 * /user/register:
 *  post:
 *   summary: Register a new user
 *   tags: [User]
 *   consumes:
 *    - application/json
 *   requestBody:
 *     required: true
 *     content:
 *      application/json:
 *     schema: 
 *      $ref: '
 *    
 */
router
    .route("/register")
    .post(validate(registerSchema, { keyByField: true }), registerUser);

router
    .route("/login")
    .post(validate(loginSchema, { keyByField: true }), loginUser);

router
    .route("/logout")
    .get(verifyToken, validate(logoutSchema, { keyByField: true }), logoutUser);

router
    .route("/change-user-role")
    .get(verifyToken, checkPermission(["ADMIN"]), validate(changeUserRoleSchema, { keyByField: true }), changeUserRole);

router
    .route("/get-tasks")
    .get(verifyToken, getUserTasks);

//TODO: Add the route for user to change the password
router
    .route("/change-password")
    .patch(verifyToken, validate(changePasswordSchema, { keyByField: true }), changePassword);

router
    .route("/:id")
    .get(verifyToken, validate(getSingleUserSchema, { keyByField: true }), getSingleUser)
    .patch(verifyToken, validate(updateUserSchema, { keyByField: true }), updateUser)
    .delete(verifyToken, checkPermission(["ADMIN"]), validate(getSingleUserSchema, { keyByField: true }), deleteUser);

export default router;