import { Router } from "express";

import { validate } from "express-validation";
import {
    checkPermission,
    verifyToken
} from "../../middlewares/user.middleware.js";
import tasksRoutes from "../tasks/tasks.routes.js";
import {
    createProject,
    deleteProject,
    getAllProjects,
    getDummyAdminProject,
    getProject,
    updateProject
} from "./projects.controller.js";
import {
    createProjectSchema,
    deleteProjectSchema,
    updateProjectSchema
} from "./projects.schema.js";

//!Projects

const router = Router();

//!Path - /projects

/**
* @swagger
*
* /projects/:
*  get:
*    description: Get all projects
*    tags:
*      - Project
*    produces:
*      - application/json
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*           type: array
*           items: 
*             $ref: 'contracts/definitions.json#/project'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  post:
*    description: Post a project
*    tags:
*      - Project
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: createProject
*        description: create project details
*        schema:
*          $ref: 'contracts/project.json#/createProject'
*    responses:
*      '200':
*          description: POST request successful
*          type: object
*          schema:
*             $ref: 'contracts/definitions.json#/project'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/")
    .get(verifyToken, getAllProjects)
    .post(verifyToken, checkPermission(["ADMIN"]), validate(createProjectSchema, { keyByField: true }), createProject)


router
    .route("/get-dummy-project")
    .get(verifyToken, checkPermission(["ADMIN"]), getDummyAdminProject)


/**
* @swagger
*
* /projects/{id}:
*  get:
*    description: Get all projects
*    tags:
*      - Project
*    produces:
*      - application/json
*    parameters:
*      - in: path
*        name: id
*        description: project id
*        schema:
*           type: string
*        required: true
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*           type: array
*           items: 
*             $ref: 'contracts/definitions.json#/project'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  delete:
*    description: Delete a project
*    tags:
*      - Project
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: path
*        name: id
*        description: project id
*        schema:
*           type: string
*        required: true
*    responses:
*      '200':
*          description: POST request successful
*          type: object
*          schema:
*             $ref: 'contracts/definitions.json#/project'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  patch:
*    description: Patch a project
*    tags:
*      - Project
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: createProject
*        description: create project details
*        schema:
*          $ref: 'contracts/project.json#/updateProject'
*      - in: path
*        name: id
*        description: project id
*        schema:
*           type: string
*        required: true
*    responses:
*      '200':
*          description: PATCH request successful
*          type: object
*          schema:
*             $ref: 'contracts/definitions.json#/project'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/:id")
    .get(verifyToken, validate(deleteProjectSchema, { keyByField: true }), getProject)
    .delete(verifyToken, checkPermission(["ADMIN"]), validate(deleteProjectSchema, { keyByField: true }), deleteProject)
    .patch(verifyToken, checkPermission(["ADMIN"]), validate(updateProjectSchema, { keyByField: true }), updateProject);

router.use("/:id/tasks", tasksRoutes);

export default router;