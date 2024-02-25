import pool from '../../../config/db.config.js';
import CustomError from '../../errors/CustomError.js';
import statusCodes from "http-status-codes"

class MainDal {

    /**
     * Gets the count of the users in the database
     * @date 2/7/2024 - 9:50:53 AM
     *
     * @async
     * @param {import('pg').PoolClient} client
     * @returns {Promise<number | Error>}
     */
    async getUserCount(client) {
        try {
            let userCountSql = "SELECT COUNT(*) FROM users WHERE is_deleted = false;";
            const userCount = await client.query(userCountSql);
            return userCount.rows[0].count;
        } catch (err) {
            throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }


    /**
     * Checks if the user Exists
     * @date 2/7/2024 - 10:02:55 AM
     *
     * @async
     * @param {import('pg').PoolClient} client
     * @param {string} username
     * @returns {Promise<import('pg').QueryResult | Error>}
     */
    async checkUserExists(client, username) {
        try {
            let userExistsSql = "SELECT * FROM users WHERE username = $1 AND is_deleted = false;";
            const userExists = await client.query(userExistsSql, [username]);
            return userExists.rows[0];
        } catch (err) {
            throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }


    /**
     * 
     * @date 2/8/2024 - 10:59:13 AM
     *
     * @async
     * @param {import('pg').PoolClient} client
     * @param {string} id
     * @returns {Promise<any> | Error}
     */
    async checkUserExistsById(client, id) {
        try {
            let userExistsSql = "SELECT * FROM users WHERE id = $1 AND is_deleted = FALSE;";
            const userExists = await client.query(userExistsSql, [id]);
            return userExists.rows[0];
        } catch (err) {
            throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
        }
    }
}

export default new MainDal();