import { cli } from "winston/lib/winston/config";
import pool from "../../../config/db.config";
import CustomError from "../../errors/CustomError";
import commentsDal from "./comments.dal";

class CommentsServices {

    /**
     * get comments
     * @param {*} task_id 
     * @returns 
     */
    async getComments(task_id) {
        const client = await pool.connect();
        try {
            const comments = await commentsDal.getComments(client, task_id);

            return comments;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        } finally {
            client.release();
        }
    }

    /**
     * create a comment for the task
     * @param {*} task_id 
     */
    async createComment(data, user_id, task_id) {
        const client = await pool.connect();
        try {
            const { title, description } = data;

            const comment = await commentsDal.createComment(client, title, description, user_id, task_id);

            return comment;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        } finally {
            client.release();
        }
    }

    /**
     * update the comment by the comment_id
     * @param {*} data 
     * @param {*} user_id 
     * @param {*} comment_id 
     */
    async patchComment(data, user_id, comment_id) {
        const client = await pool.connect();

        try {
            //get the comment
            const commentDetails = await commentsDal.getCommentById(client, comment_id);

            if (!commentDetails) {
                throw new CustomError(404, "Not found", "Comment not found");
            }

            // check if the comment_creator and current user is the same
            if (user_id !== commentDetails.user_id) {
                throw new CustomError(404, "Unauthorized", "You are not authorized to update the comment");
            }

            const updateComment = await commentsDal.updateComment(client, data, comment_id);

            return updateComment;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        } finally {
            client.release();
        }
    }


    async deleteComment(comment_id, user_role) {
        const client = await pool.connect();

        try {
            //get the comment
            const commentDetails = await commentsDal.getCommentById(client, comment_id);

            if (!commentDetails) {
                throw new CustomError(404, "Not found", "Comment not found");
            }

            // check if the comment_creator and current user is the same
            if (user_id !== commentDetails.user_id && user_role !== "ADMIN") {
                throw new CustomError(401, "Unauthorized", "You are not authorized to update the comment");
            }

            await commentsDal.deleteComment(client, comment_id);

            return "Comment Successfully Deleted!!";
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        } finally {
            client.release();
        }
    }
}

export default new CommentsServices();