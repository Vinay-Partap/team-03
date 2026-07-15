const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../modules/users/users.model");
const Policy = require("../modules/policies/policies.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/policy_platform_test";

describe("Policies API Integration", () => {
  let token = "";
  let user;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    await User.deleteMany({ email: "policy_test@govintel.gov" });
    await Policy.deleteMany({ title: "Policy Integration Test Title" });

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("Password123", 10);
    user = await User.create({
      name: "Policy Officer",
      email: "policy_test@govintel.gov",
      password: hashedPassword,
      role: "official",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "policy_test@govintel.gov",
        password: "Password123",
      });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "policy_test@govintel.gov" });
    await Policy.deleteMany({ title: "Policy Integration Test Title" });
    await mongoose.connection.close();
  });

  it("should create a new draft policy", async () => {
    const res = await request(app)
      .post("/api/policies")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Policy Integration Test Title",
        description: "Integration test description context info details.",
        category: "Energy",
        department: "Department of Power",
        state: "Global",
      });

    expect(res.statusCode).toBe(201);
  });

  it("should get active policies list", async () => {
    const res = await request(app).get("/api/policies");
    expect(res.statusCode).toBe(200);
  });
});
