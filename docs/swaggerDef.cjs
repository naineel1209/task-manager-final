module.exports = {
    swaggerDefinition: {
        info: {
            title: "TaskManager API",
            version: "1.0.0",
            description: "API for managing projects, tasks and comments",
            contact: {
                name: "Naineel Soyantar",
                email: "naineel.soyantar@zuru.com",

            },
            host: "localhost:3000",
            basePath: "/",
            schemes: [
                "http"
            ],
            swagger: "2.0"
        },
        servers: [{
            url: "http://localhost:3000",
            description: "development server"
        }],
    },
    apis: ["./src/modules/**/*.routes.js"],
}

