import { Router } from "express";
import { validate } from "express-validation";
import { checkPermission, verifyToken } from "../../middlewares/user.middleware.js";
import {
    createTask,
    deleteTask,
    getActivityLog,
    getProjectTasks,
    getSearchedTasks,
    getSingleProjectTask,
    getTlTasks,
    updateTask,
} from "./tasks.controller.js";
import {
    createTaskSchema,
    deleteTaskSchema,
    getProjectTasksSchema,
    getSingleProjectTaskSchema,
    updateTaskSchema,
    getSearchedTasksSchema
} from "./tasks.schema.js";

const router = Router({ mergeParams: true });


//!Path - /projects/:id/tasks

/**
* @swagger
*
* /projects/{id}/tasks:
*  get:
*    description: Get all tasks of the current project
*    tags:
*      - Task
*    produces:
*      - application/json
*    parameters:
*      - in: path
*        name: id
*        description: Project id
*        required: true
*        schema:
*          type: string
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*           $ref: 'contracts/task.json#/getProjectTasksResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  post:
*    description: Post a task to the project
*    tags:
*      - Task
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: path
*        name: id of project
*        description: id of the project
*        schema:
*          type: string
*        required: true
*      - in: body
*        name: createTask
*        description: create task details
*        schema:
*          $ref: 'contracts/definitions.json#/task'
*    responses:
*      '200':
*          description: POST request successful
*          type: object
*          schema:
*             $ref: 'contracts/definitions.json#/taskResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/")
    .get(verifyToken, validate(getProjectTasksSchema, { keyByField: true }), getProjectTasks)
    .post(verifyToken, checkPermission(["ADMIN", "TL"]), validate(createTaskSchema, { keyByField: true }), createTask);

router
    .route("/get-tl-tasks")
    .get(verifyToken, validate(getProjectTasksSchema, { keyByField: true }), getTlTasks);


/**
* @swagger
*
* /projects/{id}/tasks/{task_id}:
*  get:
*    description: Get a single task of the project
*    tags:
*      - Task
*    produces:
*      - application/json
*    parameters:
*      - in: path
*        name: id
*        description: project id
*        schema:
*           type: string
*        required: true
*      - in: path
*        name: task_id
*        description: task id
*        schema:
*           type: string
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*             $ref: 'contracts/definitions.json#/userTasks'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  patch:
*    description: Patch a task of the project
*    tags:
*      - Task
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
*      - in: path
*        name: task_id
*        description: task id
*        schema:
*           type: string
*        required: true
*      - in: body
*        name: task details
*        description: task details
*        schema:
*          $ref: 'contracts/definitions.json#/task'
*    responses:
*      '200':
*          description: PATCH request successful
*          type: object
*          schema:
*             $ref: 'contracts/definitions.json#/taskResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  delete:
*    description: Delete a task of the project
*    tags:
*      - Task
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
*      - in: path
*        name: task_id
*        description: task id
*        schema:
*           type: string
*    responses:
*      '200':
*          description: delete request successful
*          type: object
*          schema:
*             type: string
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/:task_id")
    .get(verifyToken, validate(getSingleProjectTaskSchema, { keyByField: true }), getSingleProjectTask)
    .patch(verifyToken, checkPermission(["ADMIN", "TL"]), validate(updateTaskSchema, { keyByField: true }), updateTask)
    .delete(verifyToken, checkPermission(["ADMIN", "TL"]), validate(deleteTaskSchema, { keyByField: true }), deleteTask);

router
    .route("/:task_id/get-activity")
    .get(verifyToken, validate(getSingleProjectTaskSchema, { keyByField: true }), getActivityLog);

export default router;