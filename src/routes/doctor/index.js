import express from "express";
import diaryEntriesRoutes from "./diaryEntries.routes.js";

const router = express.Router();

router.use("/diary-entries", diaryEntriesRoutes);

export default router;
