import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import "express-async-errors";
import { ValidationError } from "express-validation";
import { createServer } from "http";
import statusCodes from "http-status-codes";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "./docs/swagger.json" assert { type: "json" };
config();

//! loggers
import logger from "./config/winston.config.js";

//! Routes
import commentsRoutes from "./src/modules/comments/comments.routes.js";
import privateRoutes from "./src/modules/private/private.routes.js";
import projectsRoutes from "./src/modules/projects/projects.routes.js";
import teamsRoutes from "./src/modules/teams/teams.routes.js";
import authRoutes from "./src/modules/users/user.routes.js";

const app = express();
const server = createServer(app);

//! Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("public"));

//! CORS
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

//! Swagger docs route
app.use("/docs", express.static("docs"));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerJson));


//! Logger Middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

//! Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/user", authRoutes);

//! Teams Routes
app.use("/teams", teamsRoutes);

//! Projects Routes
app.use("/projects", projectsRoutes);

//! tasks -> comments
app.use("/tasks", commentsRoutes)

//! Private Routes
app.use("/private", privateRoutes);

//! Not Found Handler
app.use("*", (req, res) => {
    res.status(404).send("Page Not Found!");
})

//! Error Handler
app.use((err, req, res, next) => {

    if (err.status >= 500) {
        //log the error to the logger and send the error to the client
        logger.error(`${err.status || statusCodes.INTERNAL_SERVER_ERROR} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    }

    if (process.env.NODE_ENV === "development") {
        console.log("error stack : ", err.stack)
    }

    if (err instanceof ValidationError) {
        return res.status(err.statusCode).json({ message: err.message, errors: err.details });
    }

    res.status(err.status || statusCodes.INTERNAL_SERVER_ERROR).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack
    });
})

server.listen(process.env.PORT, () => {
    console.log("Server is running on port 3000");
});