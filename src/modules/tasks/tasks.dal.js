import CustomError from "../../errors/CustomError.js";

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
            const projectTeamDetailsSql = `
            SELECT 
            p.id as project_id, 
            p.*, t.* 
            FROM 
            projects p 
            JOIN 
            teams t 
            ON p.team_id = t.id 
            WHERE p.id = $1`;
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
            const getProjectTasksSql = `
            select ts.*, 
            u2.first_name as "assigned_to_first_name",
            u2.last_name as "assigned_to_last_name", 
            u2.username as "assigned_to_username", 
            p.title as "project_title", 
            p.description as "project_description", 
            t."name" as team_name, 
            u1.first_name as admin_first_name, 
            u1.last_name as admin_last_name, 
            u1.username as admin_username 
            from 
            tasks ts 
            inner join 
            projects p 
            inner join
            teams t 
            on p.team_id = t.id
            inner join 
            users u1 on p.admin_id = u1.id
            on ts.project_id = p.id 
            inner join 
            users u2 
            on ts.assigned_to_id = u2.id 
            WHERE ts.project_id = $1`;
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
            const getTaskDetailsSql = `            
            select 
			t.*, 
            u2.first_name as "assigned_to_first_name",
            u2.last_name as "assigned_to_last_name",
            u2.username as "assigned_to_username",
            p.title as "project_title",
            p.description as "project_description",
            t2."name" as team_name,
			u.first_name as admin_first_name,
			u.last_name as admin_last_name,
			u.username as admin_username
            from 
            tasks t 
            join projects p on p.id = t.project_id 
            join teams t2 ON t2.id = p.team_id 
            join users u on u.id = p.admin_id 
            join users u2 on u2.id = t.assigned_to_id
            WHERE t.project_id = $1 AND t.id = $2`;
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
            const getUserTasksSql = `            
            select 
			t.*, 
            u2.first_name as "assigned_to_first_name",
            u2.last_name as "assigned_to_last_name",
            u2.username as "assigned_to_username",
            p.title as "project_title",
            p.description as "project_description",
            t2."name" as team_name,
			u.first_name as admin_first_name,
			u.last_name as admin_last_name,
			u.username as admin_username
            from 
            tasks t 
            join projects p on p.id = t.project_id 
            join teams t2 ON t2.id = p.team_id 
            join users u on u.id = p.admin_id 
            join users u2 on u2.id = t.assigned_to_id
            WHERE t.assigned_to_id = $1;`;
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