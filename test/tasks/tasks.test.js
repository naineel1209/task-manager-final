import supertest from "supertest";
import app from "../../app.js";

let accessToken;

describe("task test", () => {
    describe("login test", () => {
        //valid login user
        it("should return 200", async () => {
            const response = await supertest(app).post("/user/login").send({
                username: "naineel2",
                password: "1234567890",
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("user_id");
            accessToken = response.headers["set-cookie"][0].split(";")[0];
        });
    });

    describe("get all projects tasks", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).get("/projects/667d22ab-1bea-4741-8ff7-e7ddd8c0e1df/tasks/");

            expect(response.status).toBe(401);
        });

        //valid request
        it("should return 200", async () => {
            const response = await supertest(app).get("/projects/667d22ab-1bea-4741-8ff7-e7ddd8c0e1df/tasks/").set("Cookie", accessToken);

            expect(response.status).toBe(200);
        });
    });

    describe("create project", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).post("/projects/667d22ab-1bea-4741-8ff7-e7ddd8c0e1df/tasks").send({
                title: "test",
                description: "test",
                team_id: 1,
            });

            expect(response.status).toBe(401);
        });

        //valid request
        // it("should return 201", async () => {
        //     const response = await supertest(app).post("/projects/667d22ab-1bea-4741-8ff7-e7ddd8c0e1df/tasks").set("Cookie", accessToken).send({
        //         "title": "Implement Feature X",
        //         "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        //         "categories": ["Feature", "Development"],
        //         "assignedTo": "48f97134-93d1-48bc-9973-b8394a96a379",
        //         "dueDate": "2024-02-29"
        //     });

        //     console.log(response.body);
        //     expect(response.status).toBe(201);
        // });
    })

    describe("update project task", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).patch("/projects/1").send({
                title: "test",
                description: "test",
                team_id: 1,
            });

            expect(response.status).toBe(401);
        });

        //valid request
        it("should return 200", async () => {
            const response = await supertest(app).patch("/projects/667d22ab-1bea-4741-8ff7-e7ddd8c0e1df/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c").set("Cookie", accessToken).send({
                "title": "Implement Feature XMII",
                "status": "INPROGRESS",
                "categories": ["Feature"]
            });

            expect(response.status).toBe(200);
        });
    });

    describe("delete project", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).delete("/projects/1");

            expect(response.status).toBe(401);
        });

        //valid request
        // it("should return 200", async () => {
        //     const response = await supertest(app).delete("/projects/667d22ab-1bea-4741-8ff7-e7ddd8c0e1df/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c").set("Cookie", accessToken);

        //     expect(response.status).toBe(200);
        // });
    })
});