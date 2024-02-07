import { Router } from 'express';
import { validate } from 'express-validation';
import {
    checkPermission,
    verifyToken,
} from '../../middlewares/user.middleware.js';
import {
    loginUser,
    logoutUser,
    registerUser,
    changeUserRole,
} from './user.controller.js';
import {
    changeUserRoleSchema,
    loginSchema,
    logoutSchema,
    registerSchema,
} from './user.schema.js';

const router = Router({ mergeParams: true });

//!PATH - /auth

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
    .get(verifyToken, checkPermission(["ADMIN"]), validate(changeUserRoleSchema, { keyByField: true }), changeUserRole)

export default router;