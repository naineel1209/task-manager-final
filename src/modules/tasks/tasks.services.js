import { format, isAfter } from "date-fns";
import pool from "../../../config/db.config";
import CustomError from "../../errors/CustomError.js";
import teamsDal from "../teams/teams.dal.js";
import tasksDal from "./tasks.dal";
import activity_logsDal from "./activity_logs.dal.js";

class TasksServices {

    /**
     * Creates task in the database for the mentioned project
     * @param {*} data 
     * @returns {Promise<*>}
     */
    async createTask(project_id, creator_id, creator_role, data) {
        const client = await pool.connect();
        try {
            // Create task in the database
            //get the project info and the team info - 
            const projectTeamDetails = await tasksDal.getProjectTeamDetails(client, project_id);

            if (creator_id !== projectTeamDetails.tl_id && creator_role !== "ADMIN") {
                throw new CustomError(403, "Forbidden", "You are not allowed to create task in this project");
            }

            const userInTeam = await teamsDal.checkIfUsersExistInTeam(client, projectTeamDetails.team_id, [data.assignedTo]);

            if (!userInTeam) {
                throw new CustomError(400, "Bad Request", "User not in the team");
            }

            if (data.dueDate && !isAfter(new Date(data.dueDate), new Date())) {
                throw new CustomError(400, "Bad Request", "Due date should be after today");
            }

            data.dueDate = format(new Date(data.dueDate), "yyyy-MM-dd");

            const task = await tasksDal.createTask(client, project_id, data);
            console.log(task);

            //add the task to the activity log
            await activity_logsDal.addToLog(client, task.id, creator_id, new Date(), task.status);

            return task;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        } finally {
            client.release();
        }
    }

    /**
     * Get all the tasks of the project
     * @param {*} project_id 
     * @returns 
     */
    async getProjectTasks(project_id) {
        const client = await pool.connect();
        try {
            const projectTasks = await tasksDal.getProjectTasks(client, project_id);

            return projectTasks;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        } finally {
            client.release();
        }
    }

    /**
     * 
     * @param {*} project_id 
     * @param {*} task_id 
     * @param {*} data 
     * @param {*} updater_id 
     * @param {*} updater_role 
     * @returns 
     */
    async updateTask(project_id, task_id, data, updater_id, updater_role) {
        const client = await pool.connect();
        try {
            const projectTeamDetails = await tasksDal.getProjectTeamDetails(client, project_id);
            const taskDetails = await tasksDal.getTaskDetails(client, project_id, task_id);

            if (!taskDetails) {
                throw new CustomError(404, "Not Found", "Task not found");
            }

            if (taskDetails.assigned_to_id !== updater_id && updater_role !== "ADMIN" && updater_id !== projectTeamDetails.tl_id) {
                throw new CustomError(403, "Forbidden", "You are not allowed to update this task");
            }

            if (data.assignedTo) {
                const userInTeam = await teamsDal.checkIfUsersExistInTeam(client, projectTeamDetails.team_id, [data.assignedTo]);

                if (!userInTeam) {
                    throw new CustomError(400, "Bad Request", "User not in the team");
                }
            }

            if (data.due_date && !isAfter(new Date(data.due_date), new Date())) {
                throw new CustomError(400, "Bad Request", "Due date should be after today");
            }

            data.due_date = format(new Date(data.due_date), "yyyy-MM-dd");

            let statusUpdate = (data.status && data.status !== taskDetails.status) ? true : false;

            const task = await tasksDal.updateTask(client, project_id, task_id, data);

            console.log(statusUpdate);
            //add the details to the activity log
            if (statusUpdate) {
                await activity_logsDal.addToLog(client, task_id, updater_id, new Date(), task.status);
            }

            return task;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        } finally {
            client.release();
        }
    }

    /** 
     * delete the task
     * @param {*} project_id
     * @param {*} task_id
     * @param {*} deleter_id
     * @param {*} deleter_role
     */
    async deleteTask(project_id, task_id, deleter_id, deleter_role) {
        const client = await pool.connect();
        try {
            const projectTeamDetails = await tasksDal.getProjectTeamDetails(client, project_id);
            const taskDetails = await tasksDal.getTaskDetails(client, project_id, task_id);

            if (!taskDetails) {
                throw new CustomError(404, "Not Found", "Task not found");
            }

            if (deleter_role !== "ADMIN" && deleter_id !== projectTeamDetails.tl_id) {
                throw new CustomError(403, "Forbidden", "You are not allowed to delete this task");
            }

            await tasksDal.deleteTask(client, project_id, task_id);

            return "Task deleted successfully";
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        } finally {
            client.release();
        }
    }


    /**
     * get the single project task details
     * @param {*} project_id 
     * @param {*} task_id 
     * @returns 
     */
    async getSingleProjectTask(project_id, task_id) {
        const client = await pool.connect();

        try {
            const taskDetails = await tasksDal.getTaskDetails(client, project_id, task_id);

            if (!taskDetails) {
                throw new CustomError(404, "Not Found", "Task not found");
            }

            return taskDetails;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        } finally {
            client.release();
        }
    }

    /**
     * get the tasks of the user
     * @param {*} user_id 
     * @returns 
     */
    async getUserTasks(user_id) {
        const client = await pool.connect();
        try {
            console.log(user_id);
            const userTasks = await tasksDal.getUserTasks(client, user_id);

            return userTasks;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong!", err.message);
            }
        } finally {
            client.release();
        }
    }
}

export default new TasksServices();