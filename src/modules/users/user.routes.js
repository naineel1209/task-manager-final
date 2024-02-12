import { Router } from 'express';
import { validate } from 'express-validation';
import {
    checkPermission,
    verifyToken,
} from '../../middlewares/user.middleware.js';
import {
    changeUserRole,
    getSingleUser,
    loginUser,
    logoutUser,
    registerUser,
    updateUser,
    deleteUser,
} from './user.controller.js';
import {
    getUserTasks
} from '../tasks/tasks.controller.js';
import {
    changeUserRoleSchema,
    getSingleUserSchema,
    loginSchema,
    logoutSchema,
    registerSchema,
    updateUserSchema,
} from './user.schema.js';

const router = Router({ mergeParams: true });

//!PATH - /user

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

router
    .route("/:id")
    .get(verifyToken, validate(getSingleUserSchema, { keyByField: true }), getSingleUser)
    .patch(verifyToken, validate(updateUserSchema, { keyByField: true }), updateUser)
    .delete(verifyToken, checkPermission(["ADMIN"]), validate(getSingleUserSchema, { keyByField: true }), deleteUser);




//TODO: Add the route for user to change the password


export default router;