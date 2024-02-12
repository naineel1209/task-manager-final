import CustomError from "../../errors/CustomError";

class TasksDal {

    /**
     * get the project info and the team info - inner join
     * @param {*} client 
     * @param {*} project_id 
     * @returns {Promise<any>}
     */
    async getProjectTeamDetails(client, project_id) {
        //get the project info and the team info - 
        try {
            const projectTeamDetailsSql = "SELECT p.id as project_id, p.*, t.* FROM projects p JOIN teams t ON p.team_id = t.id WHERE p.id = $1";
            const projectTeamDetailsValues = [project_id];
            const projectTeamDetails = await client.query(projectTeamDetailsSql, projectTeamDetailsValues);

            return projectTeamDetails.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        }
    }

    /**
     * creates the task in the database for the mentioned project
     * @param {*} client 
     * @param {*} project_id 
     * @param {*} data 
     */
    async createTask(client, project_id, { title, description, categories, assignedTo, dueDate }) {
        try {
            const createTaskSql = "INSERT INTO tasks (title, description, categories, assigned_to_id, project_id, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
            const createTaskValues = [title, description, JSON.stringify(categories), assignedTo, project_id, dueDate];

            const task = await client.query(createTaskSql, createTaskValues);

            return task.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        }
    }


    /**
     * Get all the tasks of the project
     * @param {*} client 
     * @param {*} project_id 
     * @returns 
     */
    async getProjectTasks(client, project_id) {
        try {
            const getProjectTasksSql = "SELECT * FROM tasks WHERE project_id = $1";
            const getProjectTasksValues = [project_id];

            const projectTasks = await client.query(getProjectTasksSql, getProjectTasksValues);

            return projectTasks.rows;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        }
    }

    /**
     * get the task details
     * @param {*} client 
     * @param {*} project_id 
     * @param {*} task_id 
     * @returns 
     */
    async getTaskDetails(client, project_id, task_id) {
        try {
            const getTaskDetailsSql = "SELECT * FROM tasks WHERE project_id = $1 AND id = $2";
            const getTaskDetailsValues = [project_id, task_id];

            const taskDetails = await client.query(getTaskDetailsSql, getTaskDetailsValues);

            return taskDetails.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        }
    }

    /**
     * update the task
     * @param {*} client 
     * @param {*} project_id 
     * @param {*} task_id 
     * @param {*} data 
     * @returns 
     */
    async updateTask(client, project_id, task_id, data) {
        try {
            let updateTaskSql = "UPDATE tasks SET"
            let updateTaskValues = [];
            let count = 1;

            for (let key in data) {
                updateTaskSql += ` ${key} = $${count}, `;

                if (key === "categories") {
                    data[key] = JSON.stringify(data[key]); //convert the categories array to string
                    updateTaskValues.push(data[key]);
                } else {
                    updateTaskValues.push(data[key]);
                }
                count++;
            }

            updateTaskSql = updateTaskSql.slice(0, -2); //remove the last comma
            updateTaskSql += ` WHERE project_id = $${count++} AND id = $${count++} RETURNING *`; //add the where clause
            updateTaskValues.push(project_id, task_id); //add the project_id and task_id to the values array

            const task = await client.query(updateTaskSql, updateTaskValues); //execute the query

            return task.rows[0]; //return the updated task
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        }
    }

    /**
     * 
     * @param {*} client 
     * @param {*} project_id 
     * @param {*} task_id 
     * @returns 
     */
    async deleteTask(client, project_id, task_id) {
        try {
            const deleteTaskSql = "DELETE FROM tasks WHERE project_id = $1 AND id = $2 RETURNING *";
            const deleteTaskValues = [project_id, task_id];

            const task = await client.query(deleteTaskSql, deleteTaskValues);

            return task.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Internal Server Error", err.message);
            }
        }
    }

    async getUserTasks(client, user_id) {
        try {
            const getUserTasksSql = "SELECT * FROM tasks WHERE assigned_to_id = $1;";
            const getUserTasksValues = [user_id];

            const tasks = await client.query(getUserTasksSql, getUserTasksValues);

            return tasks.rows;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        }
    }
}

export default new TasksDal();