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
 * /user/register:
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
 *      '201':
 *          description: POST request successful
 *          schema:
 *            $ref: 'contracts/user.json#/registerUserResponse'
 *      '40X':
 *          description: Error in the request
 *          schema:
 *            $ref: 'contracts/error.json#/errorResponse'
 */
router
    .route("/register")
    .post(validate(registerSchema, { keyByField: true }), registerUser);

/**
* @swagger
*
* /user/login:
*  post:
*    description: Login a user
*    tags:
*      - User
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: login request body
*        description: User login details
*        schema:
*          $ref: 'contracts/user.json#/loginUser'
*        required: true
*    responses:
*      '201':
*          description: POST request successful
*          schema:
*            $ref: 'contracts/user.json#/registerUserResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/login")
    .post(validate(loginSchema, { keyByField: true }), loginUser);

/**
* @swagger
*
* /user/logout:
*  get:
*    description: Logout a logged in user
*    tags:
*      - User
*    produces:
*      - application/json
*    parameters:
*      - in: cookies
*        name: logout request body
*        description: User logout details
*        schema:
*          $ref: 'contracts/user.json#/logoutUser'
*        required: true
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/user.json#/logoutUserResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/logout")
    .get(verifyToken, validate(logoutSchema, { keyByField: true }), logoutUser);

/**
* @swagger
*
* /user/change-user-role:
*  get:
*    description: Change the role of a user
*    tags:
*      - User
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: change-user-role request body
*        description: change user role details
*        schema:
*          $ref: 'contracts/user.json#/changeUserRole'
*        required: true
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/user.json#/changeUserRoleResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/change-user-role")
    .get(
        verifyToken,
        checkPermission(["ADMIN"]),
        validate(changeUserRoleSchema, { keyByField: true }),
        changeUserRole
    );

/**
* @swagger
*
* /user/get-tasks:
*  get:
*    description: Get the tasks of the current user
*    tags:
*      - User
*    produces:
*      - application/json
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/user.json#/getUserTasksResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router.route("/get-tasks").get(verifyToken, getUserTasks);

/**
* @swagger
*
* /user/change-password:
*  patch:
*    description: Change the password of the current user
*    tags:
*      - User
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: change-password request body
*        description: change password details
*        schema:
*          $ref: 'contracts/user.json#/changePassword'
*        required: true
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/user.json#/changePasswordResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/change-password")
    .patch(
        verifyToken,
        validate(changePasswordSchema, { keyByField: true }),
        changePassword
    );

/**
* @swagger
*
* /user/{id}:
*  get:
*    description: get a user details
*    tags:
*      - User
*    produces:
*      - application/json
*    parameters:
*      - in: path
*        name: change-user-role request body
*        description: change user role details
*        schema:
*           type: string
*        required: true
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/definitions.json#/user'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  patch:
*    description: Update a user details
*    tags:
*      - User
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: path
*        name: id
*        description: user id
*        schema:
*          type: string
*        required: true
*      - in: body
*        name: user details
*        description: User details
*        schema:
*          $ref: 'contracts/user.json#/updateUser'
*        required: true
*    responses:
*      '200':
*          description: PATCH request successful
*          schema:
*            $ref: 'contracts/definitions.json#/user'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  delete:
*    description: Delete a user
*    tags:
*      - User
*    produces:
*      - application/json
*    parameters:
*      - in: path
*        name: id
*        description: user id
*        schema:
*          type: string
*        required: true
*    responses:
*      '200':
*          description: DELETE request successful
*          schema:
*            type: string
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
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
