//!module
import authDal from "./user.dal.js";
import mainDal from "../main/main.dal.js";
import pool from "../../../config/db.config.js";
import CustomError from "../../errors/CustomError.js";

//!npm modules
import bcrypt from "bcrypt";
import { config } from "dotenv";
import statusCodes from "http-status-codes";
import jwt from 'jsonwebtoken';
config();

class AuthServices {


    /**
     * Service function to login a user
     * @date 2/7/2024 - 11:37:06 AM
     *
     * @async
     * @param {*} username
     * @param {*} password
     * @returns {Promise<import("pg").QueryResult<any>>}
     */
    async login(username, password) {
        const client = await pool.connect();
        try {
            //Check if user exists
            const user = await generalDal.checkUserExists(client, username);
            if (!user) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Invalid credentials", "Invalid username or password. Please try again.");
            }

            //Check if password is correct
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new CustomError(statusCodes.BAD_REQUEST, "Invalid credentials", "Invalid username or password. Please try again.");
            }

            //Correct user and password, generate access token and refresh token
            const accessToken = jwt.sign({ id: user.id, username: user.username, role: user.roles }, process.env.JWT_SECRET, { expiresIn: '30m' });
            const refreshToken = jwt.sign({ id: user.id, username: user.username, role: user.roles }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

            user.accessToken = accessToken;

            const userRefreshToken = await authDal.setRefreshToken(client, user.id, refreshToken);

            //this will never happen as the service will throw an error if the refresh token is not set
            //but just in case it does, throw an error
            if (!userRefreshToken) {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", "Something went wrong while setting refresh token. Please try again later.");
            }

            //password is correct, return user
            return user;

        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        } finally {
            client.release();
        }
    }

    /**
     * Service function to register a new user
     * @param {*} username 
     * @param {*} password 
     * @param {*} firstName 
     * @param {*} lastName 
     * @param {*} email 
     */
    async register(username, password, firstName, lastName, email) {
        const client = await pool.connect();
        try {
            //Check if user exists
            const userExists = await generalDal.checkUserExists(client, username);

            //If user exists, throw error
            if (userExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User already exists", "User already exists. Please try again with a different username");
            }

            //Get the user count
            const userCount = await generalDal.getUserCount(client);

            //If user count is <= 5, role is admin, else role is user
            let role = "DEV";
            if (userCount <= 5) {
                role = "ADMIN";
            };

            //Hash the password
            const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

            //Register the user to the authDal
            const user = await authDal.register(client, username, hashedPassword, firstName, lastName, email, role);

            return user; //Return the user data
        } catch (err) {
            //throwing an error
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        } finally {
            client.release(); //Release the client
        }
    }


    /**
     * Service function to logout a user - remove the refresh token from the database of the user
     * @param {string} id 
     * @returns {Promise<void>}
     */
    async logout(id) {
        const client = await pool.connect();
        try {
            //Remove the refresh token from the database
            const result = await authDal.setRefreshToken(client, id, null);

            //If the refresh token is not removed, throw an error
            if (!result) {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", "Something went wrong while logging out. Please try again later.");
            }

            return;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        } finally {
            client.release();
        }
    }

    async changeRole(id, role) {
        const client = await pool.connect();
        try {
            /**
             * TODO: Implement the temporary ban on the user role change until all projects with TL are completed
             */

            //Check if the user exists
            const user = await mainDal.checkUserExistsById(client, id);

            //If user does not exist, throw an error
            if (!user) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User does not exist", "User does not exist. Please try again with a different user id");
            }

            //Change the role of the user
            const result = await authDal.changeRole(client, id, role);

            return result;
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", err.message);
            }
        } finally {
            client.release();
        }
    }
}

export default new AuthServices();