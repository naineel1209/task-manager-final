//path user.test.js

import supertest from "supertest";
import app from "../../app.js";
import { isEqual } from "lodash";

let accessToken;

describe("user test", () => {
    describe("authentication test", () => {
        describe("register test", () => {
            //correct input
            // it("new user should return 201", async () => {
            //     const response = await supertest(app)
            //         .post("/user/register")
            //         .send({
            //             "username": "naineel25",
            //             "password": "1234567890",
            //             "firstName": "Naineel",
            //             "lastName": "Soyantar",
            //             "email": "naineelsoyantar14@gmail.com"
            //         });

            //     expect(response.status).toBe(201);
            //     expect(response.body).toHaveProperty("user_id");
            // })

            it("should return 400", async () => {
                const response = await supertest(app).post("/user/register").send({
                    username: "naineel25",
                    password: "1234567890",
                    firstName: "Naineel",
                    lastName: "Soyantar",
                    email: "naineelsoyantar@gmail.com",
                });
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("message");
            });

            it("validation error should return 400", async () => {
                const response = await supertest(app).post("/user/register").send({
                    username: "naineel25",
                    password: "1234567890",
                    firstName: "Naineel",
                    lastName: "Soyantar",
                });
                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("message");
            });
        });

        describe("login test", () => {
            //invalid login - wrong password
            it("should return 400", async () => {
                const response = await supertest(app).post("/user/login").send({
                    username: "naineel2",
                    password: "12345678",
                });

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("message");
                expect(response.body.message).toBe(
                    "Invalid username or password. Please try again."
                );
            });

            //invalid login - user doesn't exist
            it("should return 400", async () => {
                const response = await supertest(app).post("/user/login").send({});

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("message");
            });

            //valid login user
            it("should return 200", async () => {
                const response = await supertest(app).post("/user/login").send({
                    username: "naineel2",
                    password: "1234567890",
                });

                // accessToken = response.headers["set-cookie"][0].split("=")[1].split(";")[0];
                accessToken = response.headers["set-cookie"][0].split(";")[0];
                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty("user_id");
            });
        });

        describe("logout test", () => {
            //invalid logout
            it("should return unauthorized 401", async () => {
                const response = await supertest(app).get("/user/logout");

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty("message");
            });

            //valid logout
            it("should return 200", async () => {
                const response = await supertest(app)
                    .get("/user/logout")
                    .set("Cookie", accessToken);

                expect(response.status).toBe(200);
            });
        });

        describe("change role test", () => {
            //unauthorized test
            it("should return 401", async () => {
                const response = await supertest(app).get("/user/change-user-role");

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty("message");
            });

            //validation error test
            it("should return 400", async () => {
                const response = await supertest(app)
                    .get("/user/change-user-role")
                    .set("Cookie", accessToken)
                    .send({ id: "", role: "ADMIN" });

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty("message");
            });

            //valid change user-role
            it("should return 200", async () => {
                const response = await supertest(app)
                    .get("/user/change-user-role")
                    .send({ id: "756784d6-3117-4820-aa61-cc3a30312d41", role: "ADMIN" })
                    .set("Cookie", accessToken);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty("message");
            });
        });

        describe("get single", () => {
            //invalid request - Validation Error
            it("should return 400", async () => {
                const res = await supertest(app)
                    .get("/user/7bdb3818-274d-4e0a-8dea-a339d00843")
                    .set("Cookie", accessToken);

                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
            });

            //valid request
            it("should return 200", async () => {
                const res = await supertest(app)
                    .get("/user/756784d6-3117-4820-aa61-cc3a30312d41")
                    .set("Cookie", accessToken);

                expect(res.status).toBe(200);
                expect(
                    isEqual(res.body, {
                        id: '756784d6-3117-4820-aa61-cc3a30312d41',
                        first_name: 'Soyantar',
                        last_name: 'Naineel',
                        username: 'test',
                        password: '$2b$12$BkKyJiMC3ib39/nLDcA0ie7EAitYP06qCmT2vgSjMk0atiZI.NFMC',
                        email: 'naineelsoyantar939@gmail.com',
                        roles: 'ADMIN',
                        refresh_token: null,
                        created_at: '2024-02-15T09:31:46.093Z'
                    })
                ).toBe(true);
            });
        });

        describe("update single user", () => {
            //invalid request - Validation Error -id
            it("should return 400", async () => {
                const res = await supertest(app)
                    .patch("/user/7bdb3818-274d-4e0a-8dea-a339d008437")
                    .set("Cookie", accessToken);

                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
            });

            //invalid request - Validation Error - empty object
            it("should return 400", async () => {
                const res = await supertest(app)
                    .patch("/user/756784d6-3117-4820-aa61-cc3a30312d41")
                    .set("Cookie", accessToken);

                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
            });

            //valid request - OK
            it("should return 200", async () => {
                const res = await supertest(app)
                    .patch("/user/756784d6-3117-4820-aa61-cc3a30312d41")
                    .send({
                        first_name: "Soyantar",
                        last_name: "Naineel",
                    })
                    .set("Cookie", accessToken);

                expect(res.status).toBe(200);
                expect(res.body).toHaveProperty("message");
            });
        });

        describe("delete single user", () => {
            //invalid request
            it("should return 400", async () => {
                const res = await supertest(app)
                    .delete("/user/7bdb3818-274d-4e0a-8dea-a339d008437")
                    .set("Cookie", accessToken);

                expect(res.status).toBe(400);
                expect(res.body).toHaveProperty("message");
            });

            // it("should return 200", async () => {
            //     const res = await supertest(app).delete("/user/756784d6-3117-4820-aa61-cc3a30312d41").set("Cookie", accessToken);

            //     expect(res.status).toBe(200);
            //     expect(res.body).toHaveProperty("message");
            //     expect(res.body.message).toBe("User deleted");
            // })
        });

        describe("get tasks of user", () => {
            //invalid request
            it("should return 401", async () => {
                const res = await supertest(app).get("/user/get-task");

                expect(res.status).toBe(401);
                expect(res.body).toHaveProperty("message");
            })

            //valid request
            it("should return 200", async () => {
                const res = await supertest(app).get("/user/get-tasks").set("Cookie", accessToken);


                expect(res.status).toBe(200);
            })
        })
    });
});

afterAll(async () => {
    await new Promise((resolve) => setTimeout(() => resolve(), 500)); // avoid jest open handle error

    // close server
    app.closeServer();
});
