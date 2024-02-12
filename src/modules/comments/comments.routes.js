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

router
    .route("/:task_id/comments")
    .get(verifyToken, validate(getCommentsSchema, { keyByField: true }), getComments)
    .post(verifyToken, validate(postCommentsSchema, { keyByField: true }), createComment);


router
    .route("/:task_id/comments/:comment_id")
    .patch(verifyToken, validate(patchCommentsSchema, { keyByField: true }), patchComment)
    .delete(verifyToken, validate(deleteCommentsSchema, { keyByField: true }), deleteComment);

export default router;

