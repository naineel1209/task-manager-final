import supertest from "supertest";
import app from "../../app.js";

let accessToken;

describe("comments test", () => {
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

    describe("get all task comments", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).get("/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c/comments");

            expect(response.status).toBe(401);
        });

        //valid request
        it("should return 200", async () => {
            const response = await supertest(app).get("/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c/comments").set("Cookie", accessToken);

            expect(response.status).toBe(200);
        });
    });

    describe("create project", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).post("/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c/comments").send({
                title: "test",
                description: "test",
                team_id: 1,
            });

            expect(response.status).toBe(401);
        });

        //valid request
        it("should return 201", async () => {
            const response = await supertest(app).post("/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c/comments").set("Cookie", accessToken).send({
                title: "test",
                description: "test",
            });

            expect(response.status).toBe(201);
        });
    })

    describe("update project", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).patch("/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c/comments/f52d3743-c2ea-491d-aba1-5c87f008533c").send({
                title: "test",
                description: "test",
                team_id: 1,
            });

            expect(response.status).toBe(401);
        });

        //valid request
        it("should return 200", async () => {
            const response = await supertest(app).patch("/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c/comments/f52d3743-c2ea-491d-aba1-5c87f008533c").set("Cookie", accessToken).send({
                "title": "Billie Jeans",
                "description": "she says i am the one"
            });

            expect(response.status).toBe(200);
        });
    });

    // describe("delete project", () => {
    //     //invalid request - no token
    //     it("should return 401", async () => {
    //         const response = await supertest(app).delete("/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c/comments/f52d3743-c2ea-491d-aba1-5c87f008533c");

    //         expect(response.status).toBe(401);
    //     });

    //     //valid request
    //     it("should return 200", async () => {
    //         const response = await supertest(app).delete("/tasks/9cf0d98b-f02a-48cf-bdca-9297e350f30c/comments/f52d3743-c2ea-491d-aba1-5c87f008533c").set("Cookie", accessToken);

    //         expect(response.status).toBe(200);
    //     });
    // })
});