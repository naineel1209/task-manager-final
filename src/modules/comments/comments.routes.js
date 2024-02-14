import { Router } from "express";
import { validate } from "express-validation";
import { verifyToken } from "../../middlewares/user.middleware.js";
import {
    createComment,
    deleteComment,
    getComments,
    patchComment,
} from "./comments.controllers.js";
import {
    deleteCommentsSchema,
    getCommentsSchema,
    patchCommentsSchema,
    postCommentsSchema
} from "./comments.schemas.js";

const router = Router({ mergeParams: true });

//!PATH - /tasks/:task_id/comments

/**
* @swagger
*
* /tasks/{task_id}/comments:
*  get:
*    description: Get all comments of the current task
*    tags:
*      - Comment
*    produces:
*      - application/json
*    parameters:
*      - in: path
*        name: task_id
*        description: task id
*        required: true
*        schema:
*          type: string
*    responses:
*      '200':
*          description: GET request successful
*          schema:
*           $ref: 'contracts/comment.json#/commentsResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  post:
*    description: Post a comment to the task
*    tags:
*      - Comment
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: path
*        name: id of task
*        description: id of the project
*        schema:
*          type: string
*        required: true
*      - in: body
*        name: create a comment
*        description: create comment details
*        schema:
*          $ref: 'contracts/definitions.json#/comment'
*    responses:
*      '200':
*          description: POST request successful
*          type: object
*          schema:
*             $ref: 'contracts/comment.json#/createCommentResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/:task_id/comments")
    .get(verifyToken, validate(getCommentsSchema, { keyByField: true }), getComments)
    .post(verifyToken, validate(postCommentsSchema, { keyByField: true }), createComment);

/**
* @swagger
*
* /tasks/{task_id}/comments/{comment_id}:
*  patch:
*    description: Edit comment of the task
*    tags:
*      - Comment
*    produces:
*      - application/json
*    parameters:
*      - in: path
*        name: task_id
*        description: task id
*        required: true
*        schema:
*          type: string
*      - in: path
*        name: comment_id
*        description: comment id
*        required: true
*        schema:
*          type: string
*      - in: body
*        name: edit a comment
*        description: edit comment details
*        schema:
*          $ref: 'contracts/definitions.json#/comment'
*    responses:
*      '200':
*          description: Patch request successful
*          schema:
*           $ref: 'contracts/comment.json#/createCommentResponse'
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*  delete:
*    description: Delete a comment to the task only by the owner or ADMIN
*    tags:
*      - Comment
*    produces:
*      - application/json
*    consumes:
*      - application/json
*    parameters:
*      - in: path
*        name: id of task
*        description: id of the task
*        schema:
*          type: string
*        required: true
*      - in: path
*        name: id of comment
*        description: id of the comment
*        schema:
*          type: string
*        required: true
*    responses:
*      '200':
*          description: Delete request successful
*          type: object
*          schema:
*             type: string
*      '40X':
*          description: Error in the request
*          schema:
*            $ref: 'contracts/error.json#/errorResponse'
*/
router
    .route("/:task_id/comments/:comment_id")
    .patch(verifyToken, validate(patchCommentsSchema, { keyByField: true }), patchComment)
    .delete(verifyToken, validate(deleteCommentsSchema, { keyByField: true }), deleteComment);

export default router;

