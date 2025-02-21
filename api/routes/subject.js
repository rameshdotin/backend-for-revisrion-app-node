// routes/subject.js
import express from "express";
import { createSubject } from "../controllers/subjectController.js";
import { authenticate } from "../middlewares/auth.js";


const router = express.Router();

router.post("/", authenticate, createSubject);

export default router;