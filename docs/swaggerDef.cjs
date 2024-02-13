module.exports = {
    openapi: "3.0.0",
    info: {
        title: "Project Management API",
        version: "1.0.0",
        description: "API for managing projects, tasks and comments",
        contact: {
            name: "Naineel Soyantar",
            email: "naineel.soyantar@zuru.com",

        }
    },
    servers: [
        {
            url: "http://localhost:3000",
            description: "Development server"
        },
    ],
    apis: ["./src/modules/**/*.routes.js"],
}
