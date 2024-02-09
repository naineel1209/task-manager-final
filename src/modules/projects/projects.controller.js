import statusCodes from "http-status-codes";
import projectsServices from "./projects.services";

const createProject = async (req, res) => {
    const { title, description, team_id } = req.body;

    const createProject = await projectsServices.createProject(title, description, team_id, req.user.id);

    res.status(statusCodes.CREATED).json({
        createProject
    });
}

const updateProject = async (req, res) => {
    const { id } = req.params;

    const updateProject = await projectsServices.updateProject(id, req.body);

    return res.status(statusCodes.OK).send(updateProject);
}

const deleteProject = async (req, res) => {
    const { id } = req.params;

    const deleteProject = await projectsServices.deleteProject(id);

    return res.status(statusCodes.OK).send(deleteProject);
}

const getProject = async (req, res) => {
    const { id } = req.params;

    const project = await projectsServices.getProject(id);

    return res.status(statusCodes.OK).send(project);
}

const getAllProjects = async (req, res) => {
    const projects = await projectsServices.getAllProjects();

    return res.status(statusCodes.OK).send(projects);
}

export {
    createProject, deleteProject, getAllProjects, getProject, updateProject
};

