import statusCodes from "http-status-codes";
import tasksServices from "./tasks.services.js";

const createTask = async (req, res) => {
    const createdTask = await tasksServices.createTask(req.params.id, req.user.id, req.user.role, req.body);

    return res.status(statusCodes.CREATED).send(createdTask);
};

const getProjectTasks = async (req, res) => {
    const tasks = await tasksServices.getProjectTasks(req.params.id);

    return res.status(statusCodes.OK).send(tasks);
}

const updateTask = async (req, res) => {
    const updatedTask = await tasksServices.updateTask(req.params.id, req.params.task_id, req.body, req.user.id, req.user.role);


    return res.status(statusCodes.OK).send(updatedTask);
}

const deleteTask = async (req, res) => {
    const deletedTask = await tasksServices.deleteTask(req.params.id, req.params.task_id, req.user.id, req.user.role);

    return res.status(statusCodes.OK).send(deletedTask);
}

const getSingleProjectTask = async (req, res) => {
    const task = await tasksServices.getSingleProjectTask(req.params.id, req.params.task_id);

    return res.status(statusCodes.OK).send(task);

}

const getUserTasks = async (req, res) => {
    const userTasks = await tasksServices.getUserTasks(req.user.id)

    return res.status(statusCodes.OK).send(userTasks);
}

export {
    createTask, deleteTask, getProjectTasks, getSingleProjectTask, getUserTasks, updateTask
};

