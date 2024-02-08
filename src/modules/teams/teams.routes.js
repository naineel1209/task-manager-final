import { Router } from "express";
import { validate } from "express-validation";
import { checkPermission, verifyToken } from "../../middlewares/user.middleware.js";
import {
    addMembersToTeam,
    createTeam,
    deleteTeam,
    getSingleTeam,
    getTeams,
    removeMemberFromTeam
} from "./teams.controller.js";
import {
    addMembersToTeamSchema,
    createTeamSchema,
    getSingleTeamSchema,
    removeMembersFromTeamSchema,
    deleteTeamSchema,
} from "./teams.schema.js";
const router = Router({ mergeParams: true });

//!PATH - /teams

router
    .route("/")
    .get(verifyToken, getTeams);

router
    .route("/create")
    .post(verifyToken, checkPermission(["ADMIN"]), validate(createTeamSchema, { keyByField: true }), createTeam);

router
    .route("/delete")
    .delete(verifyToken, checkPermission(["ADMIN"]), validate(deleteTeamSchema, { keyByField: true }), deleteTeam);

//TODO - update the teams
router
    .route("/add-member")
    .post(verifyToken, checkPermission(["ADMIN", "TL"]), validate(addMembersToTeamSchema, { keyByField: true }), addMembersToTeam);

router
    .route("/remove-member")
    .delete(verifyToken, checkPermission(["ADMIN", "TL"]), validate(removeMembersFromTeamSchema, { keyByField: true }), removeMemberFromTeam);



//TODO: Add a route to get all team members of current user

router
    .route("/:id")
    .get(verifyToken, validate(getSingleTeamSchema), getSingleTeam)

export default router;