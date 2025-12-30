import request from "supertest";
import app from "../app.js";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient.js";

afterAll(async () => {
  await prisma.$disconnect();
});

describe("GET /orders", () => {
  let adminToken;

  beforeAll(() => {
    adminToken = jwt.sign(
      { userId: 1, role: "ADMIN" },
      process.env.JWT_ACCESS_SECRET
    );
  });

  test(" should fail without token", async () => {
    const res = await request(app).get("/orders");
    expect(res.statusCode).toBe(401);
  });

  test("should fail for non-admin user", async () => {
    const userToken = jwt.sign(
      { userId: 1, role: "USER" },
      process.env.JWT_ACCESS_SECRET
    );

    const res = await request(app).get(`/orders?token=${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test("should return orders for admin", async () => {
    const res = await request(app).get(`/orders?token=${adminToken}`);
    expect(res.statusCode).toBe(200);
  });
});
