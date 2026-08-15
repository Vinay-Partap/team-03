const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../modules/users/users.model");
const Scheme = require("../modules/schemes/schemes.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/policy_platform_test";

describe("Schemes API Integration", () => {
  let token = "";
  let user;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(global.__MONGO_URI || MONGODB_URI);
    }
    await User.deleteMany({ email: "scheme_test@govintel.gov" });
    await Scheme.deleteMany({ title: "Scheme Integration Test Title" });

    user = await User.create({
      name: "Scheme Officer",
      email: "scheme_test@govintel.gov",
      password: "Password123",
      role: "official",
      department: "Department of Agriculture",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "scheme_test@govintel.gov",
        password: "Password123",
      });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "scheme_test@govintel.gov" });
    await Scheme.deleteMany({ title: "Scheme Integration Test Title" });
    await mongoose.connection.close();
  });

  it("should create a new draft scheme", async () => {
    const res = await request(app)
      .post("/api/schemes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Scheme Integration Test Title",
        description: "Integration test description details.",
        category: "Farmer Welfare",
        department: "Department of Agriculture",
        state: "All",
        eligibilityRules: {
          ageMin: 18,
          ageMax: 60,
          gender: "All",
        },
      });

    expect(res.statusCode).toBe(201);
  });

  it("should get schemes list", async () => {
    const res = await request(app).get("/api/schemes");
    expect(res.statusCode).toBe(200);
  });
});
