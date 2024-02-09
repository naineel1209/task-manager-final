import statusCodes from "http-status-codes";
import CustomError from "../../errors/CustomError";

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
            const createProjectSql = "INSERT INTO projects (title, description, team_id, admin_id) VALUES ($1, $2, $3, $4) RETURNING *";
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

    async deleteProject(client, project_id) {
        try {
            const deleteProjectSql = "DELETE FROM projects WHERE id = $1 RETURNING *";
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

    async getProject(client, project_id) {
        try {
            const getProjectSql = "SELECT * FROM projects WHERE id = $1";
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
            const getAllProjectsSql = "SELECT * FROM projects";
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