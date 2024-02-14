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

/**
 * @swagger
 *
 * /teams:
 *  get:
 *    description: Get all teams
 *    tags:
 *      - Team
 *    produces:
 *      - application/json
 *    consumes:
 *      - application/json
 *    responses:
 *      '200':
 *          description: GET request successful
 *          schema:
 *            $ref: 'contracts/team.json#/getTeams'
 *      '40X':
 *         description: Error in the request    
 *         schema:
 *          $ref: 'contracts/error.json#/errorResponse'
 */
router
    .route("/")
    .get(verifyToken, getTeams);

/**
* @swagger
*
* /teams/create:
*  post:
*    description: Create a Team
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: create-a-team request body
*        description: create a team
*        schema:
*          $ref: 'contracts/team.json#/createTeam'
*        required: true
*    responses:
*      '200':
*          description: POST request successful
*          schema:
*            $ref: 'contracts/team.json#/createTeamResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/create")
    .post(verifyToken, checkPermission(["ADMIN"]), validate(createTeamSchema, { keyByField: true }), createTeam);


/**
* @swagger
*
* /teams/delete:
*  delete:
*    description: Delete a Team
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: delete a team
*        description: delete a team
*        schema:
*          $ref: 'contracts/team.json#/deleteTeam'
*        required: true
*    responses:
*      '200':
*          description: DELETE request successful
*          schema:
*           type: object
*           properties:
*             message:
*               type: string
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/delete")
    .delete(verifyToken, checkPermission(["ADMIN"]), validate(deleteTeamSchema, { keyByField: true }), deleteTeam);

/**
* @swagger
*
* /teams/update:
*  patch:
*    description: Update a Team Details
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: update a team request body
*        description: update a team
*        schema:
*          $ref: 'contracts/team.json#/updateTeam'
*        required: true
*    responses:
*      '200':
*          description: PATCH request successful
*          schema:
*            $ref: 'contracts/team.json#/createTeamResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/update")
    .patch(verifyToken, checkPermission(["ADMIN", "TL"]), validate(updateTeamSchema, { keyByField: true }), updateTeam);

/**
* @swagger
*
* /teams/add-member:
*  post:
*    description: Add a team member
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: add a member request body
*        description: add a mmeber to a team
*        schema:
*          $ref: 'contracts/team.json#/addAmember'
*        required: true
*    responses:
*      '200':
*          description: POST request successful
*          schema:
*            $ref: 'contracts/team.json#/addAmemberResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/add-member")
    .post(verifyToken, checkPermission(["ADMIN", "TL"]), validate(addMembersToTeamSchema, { keyByField: true }), addMembersToTeam);

/**
* @swagger
*
* /teams/remove-member:
*  delete:
*    description: Remove a team member
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: body
*        name: remove a member request body
*        description: remove a team member
*        schema:
*          $ref: 'contracts/team.json#/addAmember'
*        required: true
*    responses:
*      '200':
*          description: DELETE request successful
*          schema:
*            $ref: 'contracts/team.json#/addAmemberResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/remove-member")
    .delete(verifyToken, checkPermission(["ADMIN", "TL"]), validate(removeMembersFromTeamSchema, { keyByField: true }), removeMemberFromTeam);



//below route is for getting team of current user

/**
* @swagger
*
* /teams/get-user-team:
*  get:
*    description: Get the team of the current user
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/definitions.json#/userTeam'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/get-user-team")
    .get(verifyToken, getUserTeam);

//below route is for getting all team members of the current user

/**
* @swagger
*
* /teams/get-team-members:
*  get:
*    description: Get the team members of the team of the current user
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/team.json#/getTeamMembersResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/get-team-members")
    .get(verifyToken, getTeamMembers);

//below route is for getting team member of a single team

/**
* @swagger
*
* /teams/{id}:
*  post:
*    description: Get a single team
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: path
*        name: id of team
*        description:
*        schema:
*          type: string
*        required: true
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/team.json#/getAsingleTeamResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/:id")
    .get(verifyToken, validate(getSingleTeamSchema), getSingleTeam)

//below route is for getting all projects of a single team

/**
* @swagger
*
* /teams/{id}/projects:
*  post:
*    description: Get a single team
*    tags:
*      - Team
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: path
*        name: id of team
*        description:
*        schema:
*          type: string
*        required: true
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*            $ref: 'contracts/team.json#/getTeamProjects'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/:id/projects")
    .get(verifyToken, validate(teamProjectsSchema), getTeamProjects);

export default router;