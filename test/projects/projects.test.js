import supertest from "supertest";
import app from "../../app.js";

let accessToken;

describe("project test", () => {
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

    describe("get all projects", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).get("/projects");

            expect(response.status).toBe(401);
        });

        //valid request
        it("should return 200", async () => {
            const response = await supertest(app).get("/projects").set("Cookie", accessToken);

            expect(response.status).toBe(200);
        });
    });

    describe("create project", () => {
        //invalid request - no token
        it("should return 401", async () => {
            const response = await supertest(app).post("/projects").send({
                title: "test",
                description: "test",
                team_id: 1,
            });

            expect(response.status).toBe(401);
        });

        //valid request
        // it("should return 201", async () => {
        //     const response = await supertest(app).post("/projects").set("Cookie", accessToken).send({
        //         title: "test",
        //         description: "test",
        //         team_id: 1,
        //     });

        //     expect(response.status).toBe(201);
        // });
    })

    describe("update project", () => {
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
            const response = await supertest(app).patch("/projects/667d22ab-1bea-4741-8ff7-e7ddd8c0e1df").set("Cookie", accessToken).send({
                "title": "Billie Jeans",
                "description": "she says i am the one"
            });

            expect(response.status).toBe(200);
        });
    });

    // describe("delete project", () => {
    //     //invalid request - no token
    //     it("should return 401", async () => {
    //         const response = await supertest(app).delete("/projects/1");

    //         expect(response.status).toBe(401);
    //     });

    //     //valid request
    //     it("should return 200", async () => {
    //         const response = await supertest(app).delete("/projects/006ccb81-3b1b-4e74-b1e0-a9c06f892a08").set("Cookie", accessToken);

    //         expect(response.status).toBe(200);
    //     });
    // })
});