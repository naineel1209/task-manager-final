//!module
import userDal from "./user.dal.js";
import mainDal from "../main/main.dal.js";
import pool from "../../../config/db.config.js";
import CustomError from "../../errors/CustomError.js";

//!npm modules
import bcrypt from "bcrypt";
import { config } from "dotenv";
import statusCodes from "http-status-codes";
import jwt from 'jsonwebtoken';
import teamsDal from "../teams/teams.dal.js";
import tasksDal from "../tasks/tasks.dal.js";
import commentsDal from "../comments/comments.dal.js";
import projectsDal from "../projects/projects.dal.js";
config();

async function deleteDevUser(client, id) {
    //now soft delete the user from the database 
    const deletedUser = await userDal.deleteUser(client, id);

    //get the team of the user
    const userTeam = await teamsDal.getTeamFromUserId(client, id);

    //reassign the tasks to the TL_ID
    const updateTask = await tasksDal.updateTasksToTL(client, id, userTeam.tl_id);

    //update the comments
    const updateComment = await commentsDal.updateCommentByUserId(client, id);

    return { message: "User deleted" };
}

async function deleteTlAdminUser(client, id, role) {
    //soft delete the user
    const deletedUser = await userDal.deleteUser(client, id);

    //update the teams 
    const updatedTeams = await teamsDal.updateTeamTL_Admin(client, id, role);

    if (role == "ADMIN") {
        //update teams and projects admin_id to dummy user
        const updatedProject = await projectsDal.updateProjectAdmin(client, id);
    }

    return { message: "User deleted" };
}

class UserServices {


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
            const user = await mainDal.checkUserExists(client, username);
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

            const userRefreshToken = await userDal.setRefreshToken(client, user.id, refreshToken);

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
            const userExists = await mainDal.checkUserExists(client, username);

            //If user exists, throw error
            if (userExists) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User already exists", "User already exists. Please try again with a different username");
            }

            //Get the user count
            const userCount = await mainDal.getUserCount(client);

            //If user count is <= 5, role is admin, else role is user
            let role = "DEV";
            if (userCount <= 5) {
                role = "ADMIN";
            };

            //Hash the password
            const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

            //Register the user to the userDal
            const user = await userDal.register(client, username, hashedPassword, firstName, lastName, email, role);

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
            const result = await userDal.setRefreshToken(client, id, null);

            //If the refresh token is not removed, throw an error
            if (!result) {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Something went wrong", "Something went wrong while logging out. Please try again later.");
            }

            //successfully logged out
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


    /**
     * Services to change the role of a user
     * @date 2/8/2024 - 5:28:09 PM
     *
     * @async
     * @param {string} id
     * @param {string} role
     * @returns {QueryResult<any> | Error}
     */
    async changeRole(id, role) {
        const client = await pool.connect();
        try {
            //Check if the user exists
            const user = await mainDal.checkUserExistsById(client, id);

            //If user does not exist, throw an error
            if (!user) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User does not exist", "User does not exist. Please try again with a different user id");
            }

            //Change the role of the user
            const result = await userDal.changeRole(client, id, role);

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

    /**
     * Service function to get a single user
     * @date 2/8/2024 - 5:29:15 PM
     *  @async
     * @param {string} id
     * @returns {*}
     */
    async getSingleUser(id) {
        const client = await pool.connect();
        try {
            //Check if the user exists
            const user = await userDal.getSingleUser(client, id);

            //If user does not exist, throw an error
            if (!user) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User does not exist", "User does not exist. Please try again with a different user id");
            }

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
     * Service function to update a user
     * @date 2/8/2024 - 5:37:19 PM
     *
     * @async
     * @param {string} id
     * @param {object} body
     * @returns {Promise<QueryResult<any> | Error>}
     */
    async updateUser(id, body, updater_id, updater_role) {
        const client = await pool.connect();
        try {
            const user = await mainDal.checkUserExistsById(client, id);

            if (!user) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User does not exist", "User does not exist. Please try again with a different user id");
            }

            if (updater_id !== id && updater_role !== "ADMIN") {
                throw new CustomError(statusCodes.UNAUTHORIZED, "Unauthorized", "You are not authorized to update this user");
            }

            const result = await userDal.updateUser(client, id, body);

            if (!result) {
                throw new CustomError(statusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error", "Something went wrong!")
            }

            return { message: "User updated successfully" };
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
     * delete the user
     * @param {*} id 
     * @returns 
     */
    async deleteUser(id) {
        const client = await pool.connect();
        try {
            const user = await mainDal.checkUserExistsById(client, id);

            if (!user) {
                throw new CustomError(statusCodes.BAD_REQUEST, "User does not exist", "User does not exist. Please try again with a different user id");
            }



            //check if the user is DEV or (ADMIN/TL);
            if (user.roles === "DEV") {

                //delete the user; 
                return await deleteDevUser(client, id);
            } else {
                return await deleteTlAdminUser(client, id, user.roles);
            }

            // const result = await userDal.deleteUser(client, id);

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
     * changes the password - internally calls the update user call
     * @param {*} user_id 
     * @param {*} oldPassword 
     * @param {*} newPassword 
     * @returns 
     */
    async changePassword(user_id, oldPassword, newPassword) {
        const client = await pool.connect();
        try {
            const userDetails = await userDal.getSingleUser(client, user_id);

            const compare = await bcrypt.compare(oldPassword, userDetails.password);

            if (!compare) {
                throw new CustomError(statusCodes.UNAUTHORIZED, "Unauthorized", "Invalid Credentials");
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));

            const updatedUser = await userDal.updateUser(client, user_id, { password: hashedNewPassword });

            return { message: "Password changed" };
        } catch (err) {
            if (err instanceof CustomError) {
                throw err;
            } else {
                throw new CustomError(500, "Something went wrong", err.message);
            }
        } finally {
            client.release();
        }
    }
}

export default new UserServices();