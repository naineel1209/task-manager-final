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

//!Projects

const router = Router();

router
    .route("/")
    .get(verifyToken, checkPermission(["ADMIN"]), getAllProjects)
    .post(verifyToken, checkPermission(["ADMIN"]), validate(createProjectSchema, { keyByField: true }), createProject)


router
    .route("/:id")
    .get(verifyToken, validate(deleteProjectSchema, { keyByField: true }), getProject)
    .delete(verifyToken, checkPermission(["ADMIN"]), validate(deleteProjectSchema, { keyByField: true }), deleteProject)
    .patch(verifyToken, checkPermission(["ADMIN"]), validate(updateProjectSchema, { keyByField: true }), updateProject);

export default router;