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
     * delete team service
     * @date 2/9/2024 - 10:31:17 AM
     *
     * @async
     * @param {*} team_id
     * @returns {unknown}
     */
    async deleteTeam(team_id) {
        const client = await pool.connect();
        try {
            //check if the team exists
            const teamExists = await teamsDal.checkIfTeamExists(client, team_id);

            if (!teamExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Team does not exist", "Team does not exist in the database.");
            }

            //delete the team
            const deletedTeam = await teamsDal.deleteTeam(client, team_id);

            return (deletedTeam) ? "Team deleted successfully" : "Team could not be deleted. Please try again later.";
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
     * 
     * @param {*} team_id 
     * @param {*} data 
     * @param {*} admin_id 
     * @param {*} admin_role 
     * @returns object
     */
    async updateTeam(team_id, data, admin_id, admin_role) {
        const client = await pool.connect();
        try {
            //check if the team exists
            const teamExists = await teamsDal.checkIfTeamExists(client, team_id);

            if (!teamExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Team does not exist", "Team does not exist in the database.");
            }

            //throw error if the creator is not the admin or the tl of the team
            if (!(admin_role === "ADMIN" || admin_id === teamExists.tl_id)) {
                throw new CustomError(statusCodes.UNAUTHORIZED, "Unauthorized", "You are not authorized to update the team.");
            }

            //update the team
            const updatedTeam = await teamsDal.updateTeam(client, team_id, data);

            return updatedTeam;
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

            //check if all users/user exist in the database and if the user is in any team or not
            if (Array.isArray(user_id)) {
                for (let item of user_id) {
                    const userExists = await mainDal.checkUserExistsById(client, item);
                    if (!userExists) {
                        throw new CustomError(statusCodes.BAD_REQUEST, "User does not exist", "User does not exist in the database.");
                    }

                    const userIsInAnyTeam = await teamsDal.checkIfUserIsInAnyTeam(client, item);
                    if (userIsInAnyTeam) {
                        throw new CustomError(statusCodes.BAD_REQUEST, "User is in a team", "User is already in a team.");
                    }
                }
            } else {
                const userExists = await mainDal.checkUserExistsById(client, user_id);
                if (!userExists) {
                    throw new CustomError(statusCodes.BAD_REQUEST, "User does not exist", "User does not exist in the database.");
                }

                const userIsInAnyTeam = await teamsDal.checkIfUserIsInAnyTeam(client, user_id);
                if (userIsInAnyTeam) {
                    throw new CustomError(statusCodes.BAD_REQUEST, "User is in a team", "User is already in a team.");
                }
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
    * Service to remove members to the team
    * @param {string} team_id 
    * @param {string | string[]} user_id 
    * @param {string} creator_id 
    * @param {string} creator_role 
    */
    async removeMembersFromTeam(team_id, user_id, creator_id, creator_role) {
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

            //check if all users/user exist in the database
            let usersExist;
            if (Array.isArray(user_id)) {
                for (let item of user_id) {
                    usersExist = await teamsDal.checkIfUsersExistInTeam(client, team_id, item);

                    if (!usersExist) {
                        throw new CustomError(statusCodes.BAD_REQUEST, "User doesn't exist", "User does not exist in the database");
                    }
                }
            } else {
                usersExist = await teamsDal.checkIfUsersExistInTeam(client, team_id, user_id);
            }

            if (!usersExist) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User does not exist", "User does not exist in the database.");
            }

            //all users exist in the database and the creator is the admin or the tl of the team
            //remove the members to the team
            const removeMembers = await teamsDal.removeMemberFromTeam(client, team_id, user_id, Array.isArray(user_id));

            return removeMembers;
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
        } finally {
            client.release();
        }
    }

    /**
     * GET service to get the team of the current user
     * @param {*} user_id 
     * @returns 
     */
    async getUserTeam(user_id) {
        const client = await pool.connect();
        try {
            const teamExists = await teamsDal.checkIfUserIsInAnyTeam(client, user_id);

            return teamExists;
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
     * Service to get the team by id
     * @param {string} team_id 
     * @returns {Promise<any> | CustomError}
     */
    async getSingleTeam(team_id) {
        const client = await pool.connect();
        try {
            const teamExists = await teamsDal.checkIfTeamExists(client, team_id);

            if (!teamExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Team does not exist", "Team does not exist in the database.");
            }

            const userExists = await mainDal.checkUserExistsById(client, teamExists.tl_id);

            if (!userExists) {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", "Something went wrong while fetching the team lead. Please try again later.");
            }

            const team = await teamsDal.getSingleTeam(client, team_id);

            return { team, ...teamExists, tl_username: userExists.username, tl_first_name: userExists.first_name, tl_last_name: userExists.last_name };
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
     * Returns the team members of the current user
     * @param {string} user_id 
     * @returns {Promise<any> | CustomError}
     */
    async getTeamMembers(user_id) {
        const client = await pool.connect();
        try {
            const teamExists = await teamsDal.checkIfUserIsInAnyTeam(client, user_id);

            if (!teamExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User does not belong to any team", "User does not belong to any team.");
            }

            const teamMembers = await teamsDal.getSingleTeam(client, teamExists.team_id);

            return { teamMembers };
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
     * GET teams - projects
     * @param {*} team_id 
     * @returns 
     */
    async getTeamProjects(team_id) {
        const client = await pool.connect();
        try {
            const teamExists = await teamsDal.checkIfTeamExists(client, team_id);

            if (!teamExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Team does not exist", "Team does not exist in the database.");
            }

            const projects = await teamsDal.getTeamProjects(client, team_id);

            return projects;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        } finally {
            client.release();
        }
    }
}

export default new TeamsServices();