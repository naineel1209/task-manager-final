import { config } from "dotenv";
import statusCodes from "http-status-codes";
import CustomError from "../../errors/CustomError.js";
import userServices from "./user.services.js";
config();


const registerUser = async (req, res) => {
    const { username, password, firstName, lastName, email } = req.body;

    //services called to register user
    const user = await userServices.register(username, password, firstName, lastName, email);

    //user is registered - return the user
    return res.status(statusCodes.CREATED).send({ user_id: user.id });
}

const loginUser = async (req, res, next) => {
    const { username, password } = req.body;

    //services called to login user
    const user = await userServices.login(username, password);

    //user is logged in - assign the access token to the header and return the user
    res.cookie("accessToken", user.accessToken, { httpOnly: true, secure: false, maxAge: 1000 * 60 * 60 * 24 * 7 });
    return res.status(statusCodes.OK).send({ user_id: user.id });
}


const logoutUser = async (req, res) => {
    const { id } = req.user;

    //services called to logout user
    await userServices.logout(id);

    //user is logged out - clear the access token from the header and return the user
    res.clearCookie("accessToken");
    return res.status(statusCodes.OK).send({ message: "User logged out" });
}

const changeUserRole = async (req, res) => {
    const { id, role } = req.body;

    //services called to change the role of the user
    const result = await userServices.changeRole(id, role);

    if (!result) {
        return res.status(statusCodes.BAD_REQUEST).send({ message: "Role not changed" });
    }

    return res.status(statusCodes.OK).send({ message: "Role Changed" });
}

const getSingleUser = async (req, res) => {
    const { id } = req.params;

    //services called to get the user
    const user = await userServices.getSingleUser(id);

    return res.status(statusCodes.OK).send(user);
}

const updateUser = async (req, res) => {
    const { id } = req.params;

    //services called to update the user
    const user = await userServices.updateUser(id, req.body, req.user.id, req.user.role);

    return res.status(statusCodes.OK).send(user);
}

const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (req.user.id === id) {
        throw new CustomError(statusCodes.FORBIDDEN, "cannot delete yourself", "You cannot delete yourself");
    }

    //services called to delete the user
    const user = await userServices.deleteUser(id, req.user.id, req.user.role);

    return res.status(statusCodes.OK).send(user);

}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmedNewPassword } = req.body;

    if (newPassword !== confirmedNewPassword) {
        return res.status(statusCodes.BAD_REQUEST).send({ message: "Mismatched new password" })
    }

    const userData = await userServices.changePassword(req.user.id, oldPassword, newPassword);

    return res.status(statusCodes.OK).send(userData);
}

export {
    changePassword, changeUserRole, deleteUser, getSingleUser, loginUser,
    logoutUser,
    registerUser, updateUser
};

