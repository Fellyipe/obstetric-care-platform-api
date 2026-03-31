import dotenv from "dotenv";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";
import { authenticate } from "./middlewares/authenticate.js";
import { authorize } from "./middlewares/authorize.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import adminRoutes from "./routes/admin/index.js";
import authRoutes from "./routes/auth.routes.js";
import doctorRoutes from "./routes/doctor/index.js";
import patientRoutes from "./routes/patient/index.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "API está rodando!",
    timestamp: new Date().toISOString(),
    enviroment: process.env.NODE_ENV || "development",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "obstetric-care-platform-api",
    uptime: process.uptime(),
  });
});

app.use(
  "/api/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "obstetric-care-platform-api Docs",
  }),
);

app.get("/api/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/auth", authRoutes);
app.use("/api/patient", authenticate, authorize("patient"), patientRoutes);
app.use("/api/doctor", authenticate, authorize("doctor"), doctorRoutes);
app.use("/api/admin", authenticate, authorize("admin"), adminRoutes);
// Lógica omitida app.use("/api/pregnancies", authenticate, authorize("patient", "doctor"), pregnanciesRoutes);
// Lógica omitida app.use("/api/profile", authenticate, profileRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    path: req.path,
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});

export default app;
