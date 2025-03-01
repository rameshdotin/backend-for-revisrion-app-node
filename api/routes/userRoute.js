import { Router } from "express";
import { userSignIn, userSignOut, userSignUp } from "../controllers/authController.js";
import { authenticate } from "../middlewares/auth.js";
import { userStats } from "../controllers/statsController.js";
import { updateAvatarRoute } from "../controllers/userController.js";

const route = Router();

// Public routes
route.post("/signup", userSignUp);
route.post("/signin", userSignIn);

// Protected routes
route.post("/signout", authenticate, userSignOut);
route.put("/avatar", authenticate, ...updateAvatarRoute); // Spread operator is fine here
route.post("/stats", authenticate, userStats);

export default route;