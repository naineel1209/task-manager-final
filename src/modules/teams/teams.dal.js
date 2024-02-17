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
     *  DELETE Team DAL 
     * @param {import("pg").PoolClient} client 
     * @param {string} team_id 
     * @returns {QueryResult<any> | CustomError}
     */
    async deleteTeam(client, team_id) {
        try {
            const deleteTeamSql = "DELETE FROM teams WHERE id = $1 RETURNING *;";
            const deleteTeamValues = [team_id];

            const deletedTeam = await client.query(deleteTeamSql, deleteTeamValues);

            return deletedTeam.rows[0];
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * 
     * @param {*} client 
     * @param {*} team_id 
     * @param {*} updateData 
     * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
     */
    async updateTeam(client, team_id, updateData) {
        try {
            let updateTeamSql = "UPDATE teams SET ";
            let updateTeamValues = [];

            let i = 1;

            for (let key in updateData) {
                updateTeamSql += `${key} = $${i++}, `;
                updateTeamValues.push(updateData[key]);
            }

            updateTeamSql = updateTeamSql.slice(0, -2); //remove the last comma and space
            updateTeamSql += ` WHERE id = $${i} RETURNING *;`;
            updateTeamValues.push(team_id);

            const updatedTeam = await client.query(updateTeamSql, updateTeamValues);

            return updatedTeam.rows[0];
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    async updateTeamTL_Admin(client, id, role) {
        try {
            let updateTeamTL_AdminSql = `update teams set `;
            let updateTeamTL_AdminValues = ["7fff170e-c08b-43b1-a094-e006ea21d347", id];

            if (role === "ADMIN") {
                updateTeamTL_AdminSql += `admin_id = $1 where admin_id = $2 returning *;`;
            } else {
                updateTeamTL_AdminSql += `tl_id = $1 where tl_id = $2 returning *;`;
            }

            const result = await client.query(updateTeamTL_AdminSql, updateTeamTL_AdminValues);

            return result.rows;
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
            const getTeamsSql = `select 
            t.id as team_id,
            t.name as team_name,
            t.tl_id, t.admin_id, 
            u1.first_name as tl_first_name,
            u1.last_name as tl_last_name, 
            u1.username as tl_username, 
            u2.first_name as admin_first_name,
            u2.last_name as admin_last_name,
            u2.username as admin_username 
            from 
            teams t 
            inner join 
            users u1 
            on t.tl_id = u1.id
            inner join 
            users u2 
            on t.admin_id = u2.id;`;
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
    * GET Teams DAL
    * @date 2/8/2024 - 11:19:32 AM
    *
    * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
    */
    async getSingleTeam(client, team_id) {
        try {

            let getSingleTeamSql = "SELECT u.* FROM teamsusersmapping tum INNER JOIN users u ON tum.user_id = u.id WHERE tum.team_id = $1";
            const getSingleTeamValues = [team_id];
            const teams = await client.query(getSingleTeamSql, getSingleTeamValues);

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
                addMemberToTeamSql += "($1, $2)";
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
    * Remove Member from Team - DAL
    * @async
    * @param {import("pg").PoolClient} client 
    * @param {string} team_id 
    * @param {string | string[]} user_id 
    * @param {boolean} multiple - if true, then user_id is an array of user_ids
    * @returns {Promise<import("pg").QueryResult<any> | CustomError>}
    */
    async removeMemberFromTeam(client, team_id, user_id, multiple = false) {
        try {
            let removeMembersFromTeamSql = "DELETE FROM teamsusersmapping WHERE team_id = $1 AND user_id = ";

            if (multiple) {
                removeMembersFromTeamSql += "ANY($2) RETURNING *";
            } else {
                removeMembersFromTeamSql += "$2 RETURNING *";
            }

            let removeMemberFromTeamValues = [team_id, user_id];
            const result = await client.query(removeMembersFromTeamSql, removeMemberFromTeamValues);

            return result.rows;
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
            const checkIfUserIsInAnyTeamSql = `
            select
            tum.*, u3.first_name as first_name, u3.last_name as last_name, u3.username as username,
            t.name as team_name, t.tl_id, t.admin_id, u1.first_name as tl_first_name, u1.last_name as tl_last_name,
            u1.username as tl_username, u2.first_name as admin_first_name, u2.last_name as admin_last_name, u2.username as admin_username
            from
            teamsusersmapping tum
            inner join
            teams t
            on tum.team_id = t.id
            inner join
            users u1
            on t.tl_id = u1.id
            inner join
            users u2
            on t.admin_id = u2.id
            inner join
            users u3
            on tum.user_id = u3.id
            WHERE tum.user_id = $1`;
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

    async getTeamFromUserId(client, user_id) {
        try {
            const getTeamFromUserIdSql = `
            select t.*, u.*
            from
            teams t
            inner join
            teamsusersmapping tum 
            on
            t.id = tum.team_id
            inner join
            users u 
            on tum.user_id = u.id
            where tum.user_id = $1;
            `

            const getTeamFromUserIdValues = [user_id];

            const result = await client.query(getTeamFromUserIdSql, getTeamFromUserIdValues);

            return result.rows[0];
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        }
    }

    /**
     * DAL for checking if users exist in the team
     * @param {import("pg").PoolClient} client 
     * @param {string} team_id 
     * @param {string} user_id 
     * @returns QueryResult<any> | CustomError
     */
    async checkIfUsersExistInTeam(client, team_id, user_id, multiple) {
        try {
            let checkIfUsersExistInTeamSql = "SELECT * FROM teamsusersmapping WHERE team_id = $1 AND user_id = $2";
            let checkIfUsersExistInTeamValues = [team_id, user_id];

            const usersExist = await client.query(checkIfUsersExistInTeamSql, checkIfUsersExistInTeamValues);

            return usersExist.rows[0];
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * returns the team projects
     * @param {*} client 
     * @param {*} team_id 
     * @returns 
     */
    async getTeamProjects(client, team_id) {
        try {
            const getTeamProjectsSql = `
            select 
            p.*,
            t."name" as team_name,
            u.first_name as admin_first_name,
            u.last_name as admin_last_name,
            u.username as admin_username
            from
            projects p
            inner join
            teams t
            on p.team_id = t.id 
            inner join
            users u
            on p.admin_id = u.id 
            WHERE p.team_id = $1`;
            const getTeamProjectsValues = [team_id];

            const teamProjects = await client.query(getTeamProjectsSql, getTeamProjectsValues);

            return teamProjects.rows;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }
}

export default new TeamsDal();