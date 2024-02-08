


import pool from '../../../config/db.config.js';
import mainDal from '../main/main.dal.js';
import teamsDal from './teams.dal.js';
import CustomError from '../../errors/CustomError.js';
import statusCodes from "http-status-codes";

class TeamsServices {


    /**
     * service to create a new team
     * @date 2/8/2024 - 10:38:52 AM
     *
     * @async
     * @param {string} name
     * @param {string} tl_id
     * @param {string} admin_id
     * @returns {Promise<any> | CustomError}
     */
    async createTeam(name, tl_id, admin_id) {
        const client = await pool.connect();
        try {
            //check if team lead exists in the database
            const tlExists = await mainDal.checkUserExistsById(client, tl_id);

            if (!tlExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Team Lead does not exist", "Team Lead does not exist in the database.");
            }

            //check if tl has roles of tl
            if (tlExists.roles !== "TL") {
                throw new CustomError(statusCodes.BAD_REQUEST, "Team Lead is not a Team Lead", "Team Lead is not a Team Lead.");
            }

            //check if the tl already has a team
            const tlHasTeam = await teamsDal.checkIfUserHasTeam(client, tl_id);

            if (tlHasTeam) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Team Lead already has a team", "Team Lead already has a team.");
            }

            //admin exists in the database - because the permissions will handle non-admin and non-login
            //create the team
            const createdTeam = await teamsDal.createTeam(client, name, tl_id, admin_id);

            return createdTeam;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        } finally {
            client.release();
        }
    }

    /**
     * Service to add members to the team
     * @param {string} team_id 
     * @param {string | string[]} user_id 
     * @param {string} creator_id 
     * @param {string} creator_role 
     */
    async addMembersToTeam(team_id, user_id, creator_id, creator_role) {
        console.log(creator_role)
        const client = await pool.connect();
        try {
            //check if the team exists
            const teamExists = await teamsDal.checkIfTeamExists(client, team_id);

            if (!teamExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Team does not exist", "Team does not exist in the database.");
            }

            //throw error if the creator is not the admin or the tl of the team
            if (!(creator_role === "ADMIN" || creator_id === teamExists.tl_id)) {
                throw new CustomError(statusCodes.UNAUTHORIZED, "Unauthorized", "You are not authorized to add members to the team.");
            }

            //all users exist in the database and the creator is the admin or the tl of the team
            //add the members to the team
            const addedMembers = await teamsDal.addMemberToTeam(client, team_id, user_id, Array.isArray(user_id));

            return addedMembers;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        } finally {
            client.release();
        }
    }

    /**
     * GET service to get all the teams
     * @returns {Promise<any> | CustomError}
     */
    async getTeams() {
        const client = await pool.connect();
        try {
            const teams = await teamsDal.getTeams(client);
            return teams;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }


}

export default new TeamsServices();