// routes/topic.js
import express from "express";
import { authenticate } from "../middlewares/auth.js";
import { createTopic } from "../controllers/topicController.js";

const router = express.Router();

router.post("/:subjectId/topics", authenticate, createTopic);

export default router;