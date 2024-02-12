import { Router } from "express";

import { validate } from "express-validation";
import {
    checkPermission,
    verifyToken
} from "../../middlewares/user.middleware.js";
import {
    createProject,
    deleteProject,
    getAllProjects,
    getProject,
    updateProject
} from "./projects.controller.js";
import {
    createProjectSchema,
    deleteProjectSchema,
    updateProjectSchema
} from "./projects.schema.js";
import tasksRoutes from "../tasks/tasks.routes.js";

//!Projects

const router = Router();

router
    .route("/")
    .get(verifyToken, getAllProjects) //TODO:  Add inner joins to all the get requests
    .post(verifyToken, checkPermission(["ADMIN"]), validate(createProjectSchema, { keyByField: true }), createProject)


router
    .route("/:id")
    .get(verifyToken, validate(deleteProjectSchema, { keyByField: true }), getProject)
    .delete(verifyToken, checkPermission(["ADMIN"]), validate(deleteProjectSchema, { keyByField: true }), deleteProject)
    .patch(verifyToken, checkPermission(["ADMIN"]), validate(updateProjectSchema, { keyByField: true }), updateProject);

router.use("/:id/tasks", tasksRoutes);

export default router;