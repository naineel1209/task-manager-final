import statusCodes from "http-status-codes";
import commentsServices from "./comments.services";

export const getComments = async (req, res) => {
    const comments = await commentsServices.getComments(req.params.task_id);

    return res.status(statusCodes.OK).send(comments);
}

export const createComment = async (req, res) => {
    const comment = await commentsServices.createComment(req.body, req.user.id, req.params.task_id);

    return res.status(statusCodes.OK).send(comment);
};

export const patchComment = async (req, res) => {
    const updatedComment = await commentsServices.patchComment(req.body, req.user.id, req.params.comment_id);


    return res.status(statusCodes.OK).send(updatedComment);
}

export const deleteComment = async (req, res) => {
    const deletedComment = await commentsServices.deleteComment(req.params.comment_id, req.user.role);

    return res.status(statusCodes.OK).send({ message: deleteComment });
}