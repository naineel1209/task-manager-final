import { Router } from "express";
import { checkPermission, verifyToken } from "../../middlewares/user.middleware.js";
import statusCodes from "http-status-codes";
import { validate } from "express-validation";
import { createTeamSchema, addMembersToTeamSchema } from "./teams.schema.js";
import { createTeam, getTeams, addMembersToTeam } from "./teams.controller.js";
import { add } from "date-fns";
const router = Router({ mergeParams: true });

//!PATH - /teams

router
    .route("/")
    .get(verifyToken, getTeams);

router
    .route("/create")
    .post(verifyToken, checkPermission(["ADMIN"]), validate(createTeamSchema, { keyByField: true }), createTeam);

router
    .route("/add-member")
    .post(verifyToken, checkPermission(["ADMIN", "TL"]), validate(addMembersToTeamSchema, { keyByField: true }), addMembersToTeam);

export default router;