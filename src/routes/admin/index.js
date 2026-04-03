import express from "express";
import contentRoutes from "./content.routes.js";

const router = express.Router();

router.use("/content", contentRoutes);

export default router;
