import { Router } from "express";
import { validate } from "express-validation";
import {
    checkPermission,
    verifyToken,
} from "../../middlewares/user.middleware.js";
import { getUserTasks } from "../tasks/tasks.controller.js";
import {
    changePassword,
    changeUserRole,
    deleteUser,
    getSingleUser,
    loginUser,
    logoutUser,
    registerUser,
    updateUser,
} from "./user.controller.js";
import {
    changePasswordSchema,
    changeUserRoleSchema,
    getSingleUserSchema,
    loginSchema,
    logoutSchema,
    registerSchema,
    updateUserSchema,
} from "./user.schema.js";

const router = Router({ mergeParams: true });

//!PATH - /user

/**
 * @swagger
 *
 * user/register:
 *  post:
 *    description: Register a user
 *    tags:
 *      - User
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: Request body
 *        description: User details
 *        schema:
 *          $ref: 'contracts/user.json#/registerUser'
 *        required: true
 *    responses:
 *      '200':
 *          description: GET request successful
 *          schema:
 *            $ref: 'contracts/user.json#/registerUserResponse'
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
    .get(
        verifyToken,
        checkPermission(["ADMIN"]),
        validate(changeUserRoleSchema, { keyByField: true }),
        changeUserRole
    );

router.route("/get-tasks").get(verifyToken, getUserTasks);

router
    .route("/change-password")
    .patch(
        verifyToken,
        validate(changePasswordSchema, { keyByField: true }),
        changePassword
    );

router
    .route("/:id")
    .get(
        verifyToken,
        validate(getSingleUserSchema, { keyByField: true }),
        getSingleUser
    )
    .patch(
        verifyToken,
        validate(updateUserSchema, { keyByField: true }),
        updateUser
    )
    .delete(
        verifyToken,
        checkPermission(["ADMIN"]),
        validate(getSingleUserSchema, { keyByField: true }),
        deleteUser
    );

export default router;
