import { hash } from "argon2";
import { App } from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";
import request from "supertest";

const { app } = new App();

describe("POST /auth/login", () => {
  it("should login successfully", async () => {
    // Arrange
    const data = { name: "User", email: "user@mail.com", password: "Admin123" };
    const hashedPassword = await hash(data.password);
    await prisma.user.create({ data: { ...data, password: hashedPassword } });

    // Act
    const response = await request(app).post("/auth/login").send({
      email: data.email,
      password: data.password,
    });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("user");
  });

  it("shoud return an error when the password is incorrect", async () => {
    // Arrange
    const data = { name: "User", email: "user@mail.com", password: "Admin123" };
    const hashedPassword = await hash(data.password);
    await prisma.user.create({ data: { ...data, password: hashedPassword } });

    // Act
    const response = await request(app).post("/auth/login").send({
      email: data.email,
      password: "WrongPassword123",
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("shoud return an error when the email is not found", async () => {
    // Arrange
    const data = { name: "User", email: "user@mail.com", password: "Admin123" };
    const hashedPassword = await hash(data.password);
    await prisma.user.create({ data: { ...data, password: hashedPassword } });

    // Act
    const response = await request(app).post("/auth/login").send({
      email: "wrong-email@mail.com",
      password: data.password,
    });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid credentials");
  });
});
