import CustomError from '../../errors/CustomError.js';
import statusCodes from "http-status-codes"

class UserDal {
    /**
     * Register DAL - This function is responsible for creating a new user in the database.
     * @date 2/6/2024 - 5:21:12 PM
     *
     * @async
     * @param {*} client
     * @param {*} username
     * @param {*} password
     * @param {*} firstName
     * @param {*} lastName
     * @param {*} email
     * @param {*} role
     * @returns {Promise<import('pg').QueryResult>}
     */
    async register(client, username, password, firstName, lastName, email, role) {
        try {
            //Create new user
            let userSql = "INSERT INTO users (username, password, first_name, last_name, email, roles) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
            let userValues = new Array(username, password, firstName, lastName, email, role);
            const user = await client.query(userSql, userValues);

            return user.rows[0];

        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }


    /**
     * Refresh Token DAL - This function is responsible for setting the refresh token in the database.
     * Update Operation is performed here.
     * @date 2/7/2024 - 11:44:51 AM
     *
     * @async
     * @param {import('pg').PoolClient} client
     * @param {string} userId
     * @param {string} refreshToken
     * @returns {Promise<boolean>}
     */
    async setRefreshToken(client, userId, refreshToken) {
        try {
            const refreshTokenSql = "UPDATE users SET refresh_token = $1 WHERE id = $2;";
            const refreshTokenValues = [refreshToken, userId];

            const result = await client.query(refreshTokenSql, refreshTokenValues);

            if (result.rowCount === 1)
                return true;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", "Something went wrong while setting refresh token. Please try again later.");
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * Get the refresh token from the database of the userId
     * @param {import('pg').PoolClient} client 
     * @param {string} userId 
     * @returns {import('pg').QueryResult<any>}
     */
    async getRefreshToken(client, userId) {
        try {
            const refreshTokenSql = "SELECT refresh_token FROM users WHERE id = $1";
            const refreshTokenValues = [userId];

            const result = await client.query(refreshTokenSql, refreshTokenValues);

            return result.rows[0].refresh_token;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * Update the role of the user
     * @param {import('pg').PoolClient} client 
     * @param {string} id 
     * @param {string} role 
     * @returns {Promise<boolean>}
     */
    async changeRole(client, id, role) {
        try {
            const changeRoleSql = "UPDATE users SET roles = $1 WHERE id = $2;";
            const changeRoleValues = [role, id];

            const result = await client.query(changeRoleSql, changeRoleValues);

            if (result.rowCount === 1)
                return true;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", "Something went wrong while changing the role. Please try again later.");
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * get single user from the database
     * @param {*} client 
     * @param {*} id 
     * @returns 
     */
    async getSingleUser(client, id) {
        try {
            const userSql = "SELECT * FROM users WHERE id = $1";
            const userValues = [id];

            const user = await client.query(userSql, userValues);

            return user.rows[0];
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * update single user in the database
     * @param {*} client 
     * @param {*} id 
     * @param {*} body 
     * @returns 
     */
    async updateUser(client, id, body) {
        try {
            let updateUserSql = "UPDATE users SET  ";
            let updateUserValues = [];
            let count = 1;

            for (let key in body) {
                updateUserSql += `${key} = $${count}, `;
                updateUserValues.push(body[key]);
                count++;
            }

            //remove the last comma and space
            updateUserSql = updateUserSql.slice(0, -2);
            updateUserSql += ` WHERE id = $${count};`;
            updateUserValues.push(id);

            const result = await client.query(updateUserSql, updateUserValues);

            return result.rowCount === 1;
        } catch (err) {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }

    /**
     * delete the user from the database
     * @param {*} client 
     * @param {*} id 
     * @returns 
     */
    async deleteUser(client, id) {
        try {
            const deleteUserSql = "UPDATE users SET is_deleted = true WHERE id = $1";
            const deleteUserValues = [id];

            const result = await client.query(deleteUserSql, deleteUserValues);

            return result;
        } catch {
            if (err instanceof CustomError)
                throw err;
            else
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }


    async changePassword(client, id, newPassword) {

    }
}

export default new UserDal();