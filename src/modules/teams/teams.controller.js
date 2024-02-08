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

const getTeams = async (req, res) => {
    const teams = await teamsServices.getTeams();

    return res.status(statusCodes.OK).send(teams);
}

const addMembersToTeam = async (req, res) => {
    const { team_id, user_id } = req.body;

    const addedMembers = await teamsServices.addMembersToTeam(team_id, user_id, req.user.id, req.user.role);

    return res.status(statusCodes.CREATED).send(addedMembers);
}

export {
    createTeam,
    getTeams,
    addMembersToTeam
}