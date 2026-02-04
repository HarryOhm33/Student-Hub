const request = require("supertest");
const app = require("../app"); // export your app

describe("Health check", () => {
  it("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});
