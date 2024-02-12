import { Router } from "express";
import { validate } from "express-validation";
import { checkPermission, verifyToken } from "../../middlewares/user.middleware";
import {
    createTask,
    deleteTask,
    getProjectTasks,
    getSingleProjectTask,
    updateTask,
} from "./tasks.controller.js";
import {
    createTaskSchema,
    deleteTaskSchema,
    getProjectTasksSchema,
    getSingleProjectTaskSchema,
    updateTaskSchema,
} from "./tasks.schema.js";

const router = Router({ mergeParams: true });


//!Path - /projects/:id/tasks


router
    .route("/")
    .get(verifyToken, validate(getProjectTasksSchema, { keyByField: true }), getProjectTasks)
    .post(verifyToken, checkPermission(["ADMIN", "TL"]), validate(createTaskSchema, { keyByField: true }), createTask);

router
    .route("/:task_id")
    .get(verifyToken, validate(getSingleProjectTaskSchema, { keyByField: true }), getSingleProjectTask)
    .patch(verifyToken, checkPermission(["ADMIN", "TL"]), validate(updateTaskSchema, { keyByField: true }), updateTask)
    .delete(verifyToken, checkPermission(["ADMIN", "TL"]), validate(deleteTaskSchema, { keyByField: true }), deleteTask);

export default router;