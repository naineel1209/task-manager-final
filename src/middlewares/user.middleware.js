import statusCodes from "http-status-codes";
import jwt, { decode } from "jsonwebtoken";
import pool from "../../config/db.config.js";
import { loginSchema, registerSchema } from "../modules/users/user.schema.js";
import authDal from "../modules/users/user.dal.js";


/**
 * Verifies the token and sets the user in the request object -> if the token is expired, it will check the refresh token and set a new access token in the cookie and move to the next function else throws an error
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 * @param {import("express").NextFunction} next 
 * @returns void
 */

const verifyToken = async (req, res, next) => {
    const { accessToken } = req.cookies || req.headers.Authorization.split(" ")[1];

    if (!accessToken) {
        return res.status(statusCodes.UNAUTHORIZED).send({ message: "Access Token is missing" });
    }

    try {
        const decodedData = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decodedData;
        next();
    } catch (err) {
        if (err.message === "jwt expired") {
            const decodedData = jwt.decode(accessToken);
            const client = await pool.connect();
            try {
                //get the refresh token from the database and verify it
                const refreshToken = await authDal.getRefreshToken(client, decodedData.id);
                const refreshDecodedData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

                //generate a new access token and set it in the cookie and move to the next function
                const newAccessToken = jwt.sign({ id: refreshDecodedData.id, username: refreshDecodedData.username, role: refreshDecodedData.role }, process.env.JWT_SECRET, { expiresIn: '30m' });
                res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: false, maxAge: 1000 * 60 * 30 });

                //assign the user to the request object
                req.user = decodedData;

                //move to the next function
                next();
            } catch (err) {
                return res.status(statusCodes.UNAUTHORIZED).send({ message: "Invalid Token" });
            } finally {
                client.release();
            }

        } else {
            return res.status(statusCodes.UNAUTHORIZED).send({ message: "Invalid Token" });
        }
    }
}

const checkPermission = (allowedRoles) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (allowedRoles.includes(role)) {
            next();
        } else {
            return res.status(statusCodes.FORBIDDEN).send({ message: "You are not authorized to access this resource" });
        }
    }
}

export {
    verifyToken, checkPermission,
};