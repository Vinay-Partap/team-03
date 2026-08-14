const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../modules/users/users.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/policy_platform_test";

describe("Auth API Integration", () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(global.__MONGO_URI || MONGODB_URI);
    }
    await User.deleteMany({ email: "test_integration@govintel.gov" });
  });

  afterAll(async () => {
    await User.deleteMany({ email: "test_integration@govintel.gov" });
    await mongoose.connection.close();
  });

  it("should register a new citizen user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Integration",
        email: "test_integration@govintel.gov",
        password: "Password123",
        role: "citizen",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toHaveProperty("email", "test_integration@govintel.gov");
  });

  it("should fail to register a user with duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test Integration",
        email: "test_integration@govintel.gov",
        password: "Password123",
        role: "citizen",
      });

    expect(res.statusCode).toBe(400);
  });

  it("should log in successfully", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test_integration@govintel.gov",
        password: "Password123",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
