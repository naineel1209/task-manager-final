import { Router } from "express";
import { validate } from "express-validation";
import { checkPermission, verifyToken } from "../../middlewares/user.middleware.js";
import {
    addMembersToTeam,
    createTeam,
    deleteTeam,
    getSingleTeam,
    getTeamMembers,
    getTeamProjects,
    getTeams,
    getUserTeam,
    removeMemberFromTeam,
    updateTeam
} from "./teams.controller.js";
import {
    addMembersToTeamSchema,
    createTeamSchema,
    deleteTeamSchema,
    getSingleTeamSchema,
    removeMembersFromTeamSchema,
    teamProjectsSchema,
    updateTeamSchema
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

router
    .route("/update")
    .patch(verifyToken, checkPermission(["ADMIN", "TL"]), validate(updateTeamSchema, { keyByField: true }), updateTeam);

router
    .route("/add-member")
    .post(verifyToken, checkPermission(["ADMIN", "TL"]), validate(addMembersToTeamSchema, { keyByField: true }), addMembersToTeam);

router
    .route("/remove-member")
    .delete(verifyToken, checkPermission(["ADMIN", "TL"]), validate(removeMembersFromTeamSchema, { keyByField: true }), removeMemberFromTeam);



//below route is for getting team of current user
router
    .route("/get-user-team")
    .get(verifyToken, getUserTeam);

//below route is for getting all team members of the current user
router
    .route("/get-team-members")
    .get(verifyToken, getTeamMembers);

//below route is for getting team member of a single team
router
    .route("/:id")
    .get(verifyToken, validate(getSingleTeamSchema), getSingleTeam)

//below route is for getting all projects of a single team
router
    .route("/:id/projects")
    .get(verifyToken, validate(teamProjectsSchema), getTeamProjects);

export default router;