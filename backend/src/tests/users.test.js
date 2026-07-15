const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");
const User = require("../modules/users/users.model");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/policy_platform_test";

describe("Users API Integration", () => {
  let adminToken = "";
  let adminUser;

  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }
    await User.deleteMany({ email: "admin_test@govintel.gov" });
    
    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash("Password123", 10);
    adminUser = await User.create({
      name: "Admin User",
      email: "admin_test@govintel.gov",
      password: hashedPassword,
      role: "admin",
    });

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin_test@govintel.gov",
        password: "Password123",
      });
    adminToken = loginRes.body.token;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "admin_test@govintel.gov" });
    await mongoose.connection.close();
  });

  it("should get all users list for admin", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });

  it("should fail to get users list without token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(401);
  });
});
