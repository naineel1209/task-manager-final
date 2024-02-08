import statusCodes from "http-status-codes";
import teamsServices from "./teams.services.js";

/**
 * Controller function for creating a team
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
const createTeam = async (req, res) => {
    const { name, tl_id } = req.body;

    const createdTeam = await teamsServices.createTeam(name, tl_id, req.user.id);

    return res.status(statusCodes.CREATED).send({ team_id: createdTeam.id });
}


const deleteTeam = async (req, res) => {
    const { team_id } = req.body;

    const deletedTeam = await teamsServices.deleteTeam(team_id, req.user.id, req.user.role);

    return res.status(statusCodes.OK).send(deletedTeam);
}

const getTeams = async (req, res) => {
    const teams = await teamsServices.getTeams();

    return res.status(statusCodes.OK).send(teams);
}

const addMembersToTeam = async (req, res) => {
    const { team_id, user_id } = req.body;

    const addedMembers = await teamsServices.addMembersToTeam(team_id, user_id, req.user.id, req.user.role);

    return res.status(statusCodes.CREATED).send(addedMembers);
}

const removeMemberFromTeam = async (req, res) => {
    const { team_id, user_id } = req.body;

    const removedMember = await teamsServices.removeMembersFromTeam(team_id, user_id, req.user.id, req.user.role);

    return res.status(statusCodes.OK).send(removedMember);
}

const getSingleTeam = async (req, res) => {
    const team = await teamsServices.getSingleTeam(req.params.id);

    return res.status(statusCodes.OK).send(team);
}

export {
    createTeam,
    deleteTeam,
    getTeams,
    addMembersToTeam,
    removeMemberFromTeam,
    getSingleTeam,
}