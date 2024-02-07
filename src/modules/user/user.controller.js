import { config } from "dotenv";
import authServices from "./user.services.js";
import statusCodes from "http-status-codes";
config();

/**
 * Controller function to register a user
 * @date 2/7/2024 - 11:59:43 AM
 *
 * @async
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<import("express").Response>}
 */
const registerUser = async (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;

    //services called to register user
    const user = await authServices.register(username, password, firstName, lastName, email);

    //user is registered - return the user
    return res.status(statusCodes.CREATED).send({ user_id: user.id });
}

/**
 * Controller function to login a user
 * @date 2/7/2024 - 12:00:00 PM
 * 
 * @async
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {Promise<import("express").Response>}
 */
const loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    //services called to login user
    const user = await authServices.login(username, password);

    //user is logged in - assign the access token to the header and return the user
    res.cookie("accessToken", user.accessToken, { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 });
    return res.status(statusCodes.OK).send({ user_id: user.id });
}


/**
 * Logout Controller function
 * @date 2/7/2024 - 3:56:02 PM
 *
 * @async
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @returns {Promise<import("express").Response>}
 * */
const logoutUser = async (req, res) => {
    const { id } = req.user;

    //services called to logout user
    await authServices.logout(id);

    //user is logged out - clear the access token from the header and return the user
    res.clearCookie("accessToken");
    return res.status(statusCodes.OK).send({ message: "User logged out" });
}

/**
 * change the role of the user
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @returns {Promise<import("express").Response>}
 */
const changeUserRole = async (req, res) => {
    const { id, role } = req.body;

    //services called to change the role of the user
    const result = await authServices.changeRole(id, role);

    if (!result) {
        return res.status(statusCodes.BAD_REQUEST).send({ message: "Role not changed" });
    }

    return res.status(statusCodes.OK).send({ message: "Role Changed" });
}

export {
    loginUser,
    logoutUser,
    registerUser,
    changeUserRole
};
