import statusCodes from "http-status-codes";
import CustomError from '../../errors/CustomError.js';

class TeamsDal {


    /**
     * DAL 
     * @date 2/8/2024 - 10:36:30 AM
     *
     * @async
     * @param {import('pg').PoolClient} client
     * @param {string} name
     * @param {string} tl_id
     * @param {string} admin_id
     * @returns {Promise<import('pg').QueryResult<any> | CustomError>}
     */
    async createTeam(client, name, tl_id, admin_id) {
        try {
            const createTeamSql = "INSERT INTO teams (name, tl_id, admin_id) VALUES ($1, $2, $3) RETURNING *;";
            const createTeamValues = [name, tl_id, admin_id];

            const createdTeam = await client.query(createTeamSql, createTeamValues);

            return createdTeam.rows[0];
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }


    /**
     * Check if user has a team
     * @date 2/8/2024 - 11:10:36 AM
     *
     * @async
     * @param {import("pg").PoolClient} client
     * @param {string} tl_id
     * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
     */
    async checkIfUserHasTeam(client, tl_id) {
        try {
            const checkIfUserHasTeamSql = "SELECT * FROM teams WHERE tl_id = $1";
            const checkIfUserHasTeamValues = [tl_id];

            const userHasTeam = await client.query(checkIfUserHasTeamSql, checkIfUserHasTeamValues);

            return userHasTeam.rows[0];
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * GET Teams DAL
     * @date 2/8/2024 - 11:19:32 AM
     *
     * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
     */
    async getTeams(client) {
        try {
            const getTeamsSql = "SELECT * FROM teams";
            const teams = await client.query(getTeamsSql);

            return teams.rows;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * Add Member to Team DAL
     * @async
     * @param {import("pg").PoolClient} client 
     * @param {string} team_id 
     * @param {string | string[]} user_id 
     * @param {boolean} multiple - if true, then user_id is an array of user_ids
     * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
     */
    async addMemberToTeam(client, team_id, user_id, multiple = false) {
        try {
            let addMemberToTeamSql = "INSERT INTO teamsusersmapping (user_id, team_id) VALUES ";
            let addMemberToTeamValues = [];
            if (multiple) {
                //user_id is an array of user_ids
                for (let i = 0, j = 1; i < user_id.length; i++) {
                    addMemberToTeamSql += `($${j++}, $${j++}) `;

                    if (i !== user_id.length - 1) {
                        addMemberToTeamSql += ", ";
                    }

                    addMemberToTeamValues.push(user_id[i]);
                    addMemberToTeamValues.push(team_id);
                }
            } else {
                //user_id is a single user_id
                addMemberToTeamSql += "VALUES ($1, $2)";
                addMemberToTeamValues.push(user_id);
                addMemberToTeamValues.push(team_id);
            };

            addMemberToTeamSql += " RETURNING *;";
            const result = await client.query(addMemberToTeamSql, addMemberToTeamValues);

            return result.rows;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * Check if Team Exists
     * @async
     * @param {import("pg").PoolClient} client 
     * @param {string} team_id 
     * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
     */
    async checkIfTeamExists(client, team_id) {
        try {
            const checkIfTeamExistsSql = "SELECT * FROM teams WHERE id = $1";
            const checkIfTeamExistsValues = [team_id];

            const teamExists = await client.query(checkIfTeamExistsSql, checkIfTeamExistsValues);

            return teamExists.rows[0];
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * check if user is in any team 
     * @param {import("pg").PoolClient} client 
     * @param {string} user_id 
     * @returns Promise<import("pg").QueryResult<any> | CustomError>
     */
    async checkIfUserIsInAnyTeam(client, user_id) {
        try {
            const checkIfUserIsInAnyTeamSql = "SELECT * FROM teamsusersmapping WHERE user_id = $1";
            const checkIfUserIsInAnyTeamValues = [user_id];

            const userIsInAnyTeam = await client.query(checkIfUserIsInAnyTeamSql, checkIfUserIsInAnyTeamValues);

            return userIsInAnyTeam.rows[0];
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }
}

export default new TeamsDal();