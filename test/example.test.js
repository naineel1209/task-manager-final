import * as chai from "chai";
import chaiHttp from "chai-http";
import app from "../app.js";

chai.use(chaiHttp);
const { assert, request } = chai;

const BASE_URL = "http://localhost:3000";


describe("Test 1", () => {
    it("should return 1", () => {
        assert.equal(1, 1);
    })
});

describe("Login Test", () => {
    it("should return 200", async function (done) {
        // return new Promise((res, rej) => {
        //     request(BASE_URL)
        //         .get("/")
        //         .end((err, res) => {
        //             if (err) {
        //                 rej(err);
        //             }
        //             chai.expect(res.statusCode).to.be.equal(200);
        //         }).then(() => {
        //             res(done());
        //         })
        // })

        return request.agent(app)
            .get("/")
            .then(res => {
                chai.expect(res.status).to.be.equal(200);
                done();
            })
    });
})