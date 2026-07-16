const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../modules/users/users.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/policy_platform_test";

describe("Eligibility API Integration", () => {
  let token = "";
  let user;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    await User.deleteMany({ email: "eligibility_test@govintel.gov" });

    user = await User.create({
      name: "Eligibility User",
      email: "eligibility_test@govintel.gov",
      password: "Password123",
      role: "citizen",
      profile: {
        age: 25,
        gender: "Male",
        income: 150000,
        state: "Bihar",
        occupation: "Farmer",
        education: "10th Pass",
        category: "General",
        disability: false,
      },
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "eligibility_test@govintel.gov",
        password: "Password123",
      });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "eligibility_test@govintel.gov" });
    await mongoose.connection.close();
  });

  it("should perform profile-based match calculations successfully", async () => {
    const res = await request(app)
      .get("/api/eligibility/check-my")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("success", true);
  });
});
