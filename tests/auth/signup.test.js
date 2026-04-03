import "../helpers/setup.js";
import request from "supertest";
import app from "../../src/app.js";
import { cleanTestUser } from "../helpers/auth.helper.js";

describe("POST /api/auth/signup/mobile", () => {
  let createdUserId;

  afterEach(async () => {
    if (createdUserId) {
      await cleanTestUser(createdUserId);
      createdUserId = null;
    }
  });

  it("deve criar uma conta de paciente com sucesso", async () => {
    const res = await request(app)
      .post("/api/auth/signup/mobile")
      .send({
        email: `paciente_${Date.now()}@9moon.com`,
        password: "senha123",
        data: { name: "Paciente teste" },
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("session");
    expect(res.body.message).toBe("Account created successfully");

    createdUserId = res.body.session?.user?.id;
  });

  it("deve rejeitar email inválido", async () => {
    const res = await request(app)
      .post("/api/auth/signup/mobile")
      .send({
        email: "nao-e-um-email",
        password: "senha123",
        data: { name: "Paciente teste" },
      });

    expect(res.status).toBe(400);
  });

  it("deve rejeitar senha curta", async () => {
    const res = await request(app)
      .post("/api/auth/signup/mobile")
      .send({
        email: "teste@9moon.com",
        password: "123",
        data: { name: "Paciente teste" },
      });

    expect(res.status).toBe(400);
  });
});
