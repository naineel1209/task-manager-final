import pool from "../../../config/db.config.js";
import CustomError from "../../errors/CustomError.js";
import projectsDal from "./projects.dal.js";

class ProjectServices {

    /**
     * Service to create a project
     * @param {*} title 
     * @param {*} description 
     * @param {*} team_id 
     * @param {*} admin_id 
     * @returns Promise<import("pg").QueryResult<any> | CustomError>
     */
    async createProject(title, description, team_id, admin_id) {
        const client = await pool.connect();
        try {
            const createProject = await projectsDal.createProject(client, title, description, team_id, admin_id);

            return createProject;
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
     *  
     * @param {*} project_id 
     * @param {*} data 
     * @returns 
     */
    async updateProject(project_id, data) {
        const client = await pool.connect();
        try {
            const updateProject = await projectsDal.updateProject(client, project_id, data);

            return updateProject;
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
     * Delete a project service
     * @date 2/9/2024 - 3:42:31 PM
     *
     * @async
     * @param {*} project_id
     * @returns {*}
     */
    async deleteProject(project_id) {
        const client = await pool.connect();
        try {
            const deleteProject = await projectsDal.deleteProject(client, project_id);

            return deleteProject;
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
     * Service for deleting a project
     * @param {*} project_id 
     * @returns 
     */
    async getProject(project_id) {
        const client = await pool.connect();
        try {
            const project = await projectsDal.getProject(client, project_id);

            return project;
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

    async getAllProjects() {
        const client = await pool.connect();
        try {
            const projects = await projectsDal.getAllProjects(client);

            return projects;
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

export default new ProjectServices();