import CustomError from "../../errors/CustomError";

class CommentsDal {

    /**
     * Get comments
     * @param {*} client 
     * @param {*} task_id 
     */
    async getComments(client, task_id) {
        try {
            const getCommentsSql = `select c.*, u.first_name as first_name, u.last_name as last_name, u.username as username, u.email as user_email from comments c inner join users u on c.user_id = u.id WHERE c.task_id = $1;`;
            const getCommentsValues = [task_id];

            const comments = await client.query(getCommentsSql, getCommentsValues);

            return comments.rows;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        }
    }

    /**
     * create a comment - dal
     * @param {*} client 
     * @param {*} task_id 
     */
    async createComment(client, title, description, user_id, task_id) {
        try {
            const createCommentSql = "INSERT INTO comments (title, description, user_id, task_id) VALUES ($1, $2, $3, $4) RETURNING *; ";
            const createCommentValues = [title, description, user_id, task_id];

            const comment = await client.query(createCommentSql, createCommentValues);

            return comment.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        }
    }

    /**
     * update comment by id
     * @param {*} client 
     * @param {*} data 
     * @param {*} comment_id 
     * @returns 
     */
    async updateComment(client, data, comment_id) {
        try {
            let updateCommentSql = "UPDATE comments SET "
            let updateCommentValues = [];
            let count = 1;

            for (let key in data) {
                updateCommentSql += ` ${key} = $${count++}, `;
                updateCommentValues.push(data[key]);
            }

            updateCommentSql = updateCommentSql.slice(0, -2);
            updateCommentSql += ` WHERE id = $${count++} RETURNING *;`;
            updateCommentValues.push(comment_id);

            const updatedComment = await client.query(updateCommentSql, updateCommentValues);

            return updatedComment.rows[0];

        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        }
    }

    async deleteComment(client, comment_id) {
        try {
            const deleteCommentSql = "DELETE FROM comments WHERE id = $1";
            const deleteCommentValues = [comment_id];

            const deletedComment = await client.query(deleteCommentSql, deleteCommentValues);

            return deletedComment;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong!!", err.message);
            }
        }
    }

    /**
     * getting comment by id
     * @param {*} client 
     * @param {*} comment_id 
     */
    async getCommentById(client, comment_id) {
        try {
            const getCommentByIdSql = "SELECT * FROM comments WHERE id = $1;";
            const getCommentByIdValues = [comment_id];

            const comment = await client.query(getCommentByIdSql, getCommentByIdValues);

            return comment.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        }
    }
}

export default new CommentsDal();