import statusCodes from "http-status-codes";
import CustomError from "../../errors/CustomError.js";
import { cli } from "winston/lib/winston/config/index.js";

class ProjectsDal {

    /**
     * 
     * @param {*} client 
     * @param {*} title 
     * @param {*} description 
     * @param {*} team_id 
     * @param {*} admin_id 
     * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
     */
    async createProject(client, title, description, team_id, admin_id) {
        try {
            const createProjectSql = "INSERT INTO projects (title, description, team_id, admin_id) VALUES ($1, $2, $3, $4) RETURNING *;";
            const createProjectValues = [title, description, team_id, admin_id];

            const result = await client.query(createProjectSql, createProjectValues);

            return result.rows[0];
        } catch (err) {
            throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * 
     * @param {*} client 
     * @param {*} project_id 
     * @param {*} data 
     * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
     */
    async updateProject(client, project_id, data) {
        try {
            let updateProjectSql = "UPDATE projects SET ";
            let updateProjectValues = [];
            let i = 1;

            for (let key in data) {
                updateProjectSql += `${key} = $${i++}, `;
                updateProjectValues.push(data[key]);
            }

            updateProjectSql = updateProjectSql.slice(0, -2);
            updateProjectSql += ` WHERE id = $${i} RETURNING *`;
            updateProjectValues.push(project_id);

            const result = await client.query(updateProjectSql, updateProjectValues);

            return result.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            }
            else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        }
    }

    async updateProjectAdmin(client, admin_id) {
        try {
            const updateProjectAdminSql = `update projects set admin_id = $1 where admin_id = $2 returning *;`;
            const updateProjectAdminValues = ["7fff170e-c08b-43b1-a094-e006ea21d347", admin_id];

            const result = await client.query(updateProjectAdminSql, updateProjectAdminValues);

            return result.rows;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            }
            else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        }
    }

    async deleteProject(client, project_id) {
        try {
            const deleteProjectSql = "UPDATE projects SET is_deleted = true WHERE id = $1 RETURNING *";
            const deleteProjectValues = [project_id];

            const result = await client.query(deleteProjectSql, deleteProjectValues);

            return result.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            }
            else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        }
    }

    async deleteProjectTasks(client, project_id) {
        try {
            const deleteProjectTasksSql = "UPDATE tasks SET is_deleted = true WHERE project_id = $1 RETURNING *;"
            const deleteProjectTasksValues = [project_id];

            const result = await client.query(deleteProjectTasksSql, deleteProjectTasksValues);

            return result.rows;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        }
    }

    async deleteTasksComments(client, tasks) {
        try {
            const tasks_id = tasks.map(task => task.id);

            const deleteProjectTasksSql = "UPDATE comments SET is_deleted = true WHERE task_id = ANY($1) RETURNING *;"
            const deleteProjectTasksValues = [tasks_id]; s

            const result = await client.query(deleteProjectTasksSql, deleteProjectTasksValues);

            return result.rows;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        }
    }

    async getProject(client, project_id) {
        try {
            const getProjectSql = `
            select 
            p.*, 
            t."name" as team_name, 
            u1.first_name as admin_first_name, 
            u1.last_name as admin_last_name, 
            u1.username as admin_username 
            from 
            projects p 
            inner join 
            teams t 
            on p.team_id = t.id 
            inner join 
            users u1 
            on p.admin_id = u1.id 
            WHERE p.id = $1`;
            const getProjectValues = [project_id];

            const result = await client.query(getProjectSql, getProjectValues);

            return result.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            }
            else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        }
    }

    async getAllProjects(client) {
        try {
            const getAllProjectsSql = `            
            select 
            p.*, 
            t."name" as team_name, 
            u1.first_name as admin_first_name, 
            u1.last_name as admin_last_name, 
            u1.username as admin_username 
            from 
            projects p 
            inner join 
            teams t 
            on p.team_id = t.id 
            inner join 
            users u1 
            on p.admin_id = u1.id`;
            const result = await client.query(getAllProjectsSql);

            return result.rows;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        }
    }
}

export default new ProjectsDal();