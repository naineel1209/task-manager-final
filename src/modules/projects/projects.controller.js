import statusCodes from "http-status-codes";
import projectsServices from "./projects.services.js";

const createProject = async (req, res) => {
    const { title, description, team_id } = req.body;

    const createProject = await projectsServices.createProject(title, description, team_id, req.user.id);

    return res.status(statusCodes.CREATED).json({
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

const getDummyAdminProject = async (req, res) => {
    const admin = await projectsServices.getDummyAdminProject();

    return res.status(statusCodes.OK).send(admin);
}

export {
    createProject, deleteProject, getAllProjects, getDummyAdminProject, getProject, updateProject
};

