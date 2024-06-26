//path user.test.js

import supertest from "supertest";
import app from "../../app.js";
import { isEqual } from "lodash";

let accessToken;

describe("team test", () =>
{
    describe("authentication test", () =>
    {
        describe("login test", () =>
        {
            //valid login user
            it("should return 200", async () =>
            {
                const response = await supertest(app).post("/user/login").send({
                    username: "naineel2",
                    password: "1234567890",
                });

                // accessToken = response.headers["set-cookie"][0].split("=")[1].split(";")[0];
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty("user_id");
                accessToken = response.headers["set-cookie"][0].split(";")[0];
            });
        });

        describe("get all teams", () =>
        {
            //unauthorized
            it("should  return 401", async () =>
            {
                const res = await supertest(app).get("/teams");

                expect(res.status).toBe(401);
                expect(res.body).toHaveProperty("message");
            })

            //valid
            it("should return 200", async () =>
            {
                const response = await supertest(app).get("/teams/").set("Cookie", accessToken);

                expect(response.status).toBe(200);
                console.log(response.type);
                expect(response.type).toBe("application/json");
            })
        })


        describe("create a team", () =>
        {
            // invalid request - forbidden request 
            it("should return 400", async () =>
            {
                const res = await supertest(app)
                    .post("/teams/create")
                    .send({
                        "name": "testing team",
                        "tl_id": "15bca82c-1df0-43e0-b198-61903c07e8f0"
                    }).set("Cookie", accessToken);

                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message")
                expect(res.body.message).toBe("Team Lead already has a team.")
            })

            // it("should return 403", async () => {
            //     const res = await supertest(app).post("/teams/create").send({
            //         "name": "testing team",
            //         "tl_id": "15bca82c-1df0-43e0-b198-61903c07e8f0"
            //     })
            //         .set("Cookie", accessToken);

            //     console.log(res.body)

            //     expect(res.status).toBe(403);


            // it("should return 201", async () => {
            //     const res = await supertest(app).post("/teams/create").send({
            //         "name": "testing team",
            //         "tl_id": "48f97134-93d1-48bc-9973-b8394a96a379"
            //     })
            //         .set("Cookie", accessToken);

            //     expect(res.status).toBe(201)
            //     expect(res.body).toHaveProperty("team_id");
            // })
        })

        // describe("delete team", () => {
        //     //invalid request
        //     it("should return 400", async () => {
        //         const res = await supertest(app).delete("/teams/delete").send({

        //         }).set("Cookie", accessToken);

        //         expect(res.status).toBe(400);
        //         expect(res.body).toHaveProperty("message");
        //     })

        //     it("should return 200", async () => {
        //         const res = await supertest(app).delete("/teams/delete").send({
        //             "team_id": "da316ea5-f26b-43d9-8e54-ecb246ce5198"
        //         })
        //             .set("Cookie", accessToken);

        //         expect(res.status).toBe(200);
        //         expect(res.body.message).toBe("Team deleted successfully");
        //     })
        // })


        describe("update team", () =>
        {
            //invalid request
            // it("should return 401", async () => {
            //     const res = await supertest(app).patch("/teams/update").send({
            //         "team_id": "84caad15-b130-4292-94c5-28a956cbd2ef",
            //         "name": "testing team - 999999999999999999"
            //     }).set("Cookie", accessToken);

            //     expect(res.status).toBe(401);
            //     expect(res.body).toHaveProperty("message");
            // })

            //valid request
            it("should return 200", async () =>
            {
                const res = await supertest(app).patch("/teams/update").send({
                    "team_id": "84caad15-b130-4292-94c5-28a956cbd2ef",
                    "name": "testing team - 999999999999999999"
                }).set("Cookie", accessToken);

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("id")
                expect(res.body).toHaveProperty("name")
                expect(res.body).toHaveProperty("admin_id")
                expect(res.body).toHaveProperty("tl_id")
            })
        })

        // //TODO: refactor
        describe("remove  member test", () =>
        {
            //invalid request - structure is wrong
            it("should return 400", async () =>
            {
                const res = await supertest(app).delete("/teams/remove-member").set("Cookie", accessToken);

                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
            })


            //invalid request - forbidden request for user as adder
            // it("should return 403", async () => {
            //     const res = await supertest(app).post("/teams/remove-member").send({
            //         "team_id": "84caad15-b130-4292-94c5-28a956cbd2ef",
            //         "user_id": "15bca82c-1df0-43e0-b198-61903c07e8f0",
            //     }).set("Cookie", accessToken);

            //     expect(res.status).toBe(403);
            //     expect(res.body).toHaveProperty("message");
            // })

            //invalid request - unauthorized request - not actual tl changing the team
            // it("should return 401", async () => {
            //     const res = await supertest(app).post("/teams/remove-member").send({
            //         "team_id": "84caad15-b130-4292-94c5-28a956cbd2ef",
            //         "user_id": "15bca82c-1df0-43e0-b198-61903c07e8f0",
            //     });

            //     expect(res.status).toBe(401);
            //     expect(res.body).toHaveProperty("message");
            // });

            //valid request
            // it("should return 200  ", async () => {
            //     const res = await supertest(app).delete("/teams/remove-member").send({
            //         "team_id": "84caad15-b130-4292-94c5-28a956cbd2ef",
            //         "user_id": "0888689c-0e4e-45c6-871c-52f439713cc3",
            //     }).set("Cookie", accessToken);


            //     console.log(res.body);
            //     expect(res.status).toBe(200);
            //     expect(res.body.length > 0).toBe(true);
            // })
        })

        describe("get single team", () =>
        {
            //invalid test - malformed team id
            it("should return 400", async () =>
            {
                const res = await supertest(app).get("/teams/cd6d0367-e332-4820-97dd-6970764264").set("Cookie", accessToken);


                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
            })


            //valid request
            it("should return 200", async () =>
            {
                const res = await supertest(app).get("/teams/cd6d0367-e332-4820-97dd-697076426430").set("Cookie", accessToken);

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("team");
                expect(res.body).toHaveProperty("id")
                expect(res.body).toHaveProperty("tl_id")
                expect(res.body).toHaveProperty("admin_id")
                expect(res.body).toHaveProperty("name")
            })
        });

        describe("get user team", () =>
        {
            //invalid request - logging in without 
            it("should return 401", async () =>
            {
                const res = await supertest(app).get("/teams/get-user-team");

                expect(res.status).toBe(401);
                expect(res.body).toHaveProperty("message");
            })

            //valid request
            it("should return 200", async () =>
            {
                const res = await supertest(app).get("/teams/get-user-team").set("Cookie", accessToken);

                expect(res.status).toBe(200);
            });
        })

        describe("get team members", () =>
        {
            //invalid request - logging in without 
            it("should return 401", async () =>
            {
                const res = await supertest(app).get("/teams/get-team-members");

                expect(res.status).toBe(401);
                expect(res.body).toHaveProperty("message");
            })

            //invalid request - user does not have a team
            it("should return 400", async () =>
            {
                const res = await supertest(app).get("/teams/get-team-members").set("Cookie", accessToken);

                expect(res.status).toBe(400);
            });


            // //valid request
            // it("should return 200", async () => {
            //     const res = await supertest(app).get("/teams/get-team-members").set("Cookie", accessToken);

            //     expect(res.status).toBe(200);
            //     expect(res.body).toHaveProperty("members");
            // });
        })


        describe("get team projects", () =>
        {
            //invalid request - logging in without 
            it("should return 401", async () =>
            {
                const res = await supertest(app).get("/teams/get-user-projects");

                expect(res.status).toBe(401);
                expect(res.body).toHaveProperty("message");
            })

            //valid request
            it("should return 200", async () =>
            {
                const res = await supertest(app).get("/teams/cd6d0367-e332-4820-97dd-697076426430/projects").set("Cookie", accessToken);

                expect(res.status).toBe(200);
                expect(res.body.length > 0).toBe(true);
            });
        })
    })
});