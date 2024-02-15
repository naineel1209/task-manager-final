import supertest from "supertest";
import app from "../app.js";
import { set } from "date-fns";

describe("example test", () => {
    describe("nest describe", () => {
        it("should return true", () => {
            expect(true).toBe(true);
        })

        it("should response with 200", async () => {
            const response = await supertest(app).get("/");
            expect(response.status).toBe(200);
        })
    })
})

afterAll(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error

    // close server
    app.closeServer();
})