import { Router } from "express";
import { authCallback, getMe } from "../controllers/authController";
import { protectRoute } from "../middlewares/auth";

const router = Router();

router.get("/profile", protectRoute, getMe);
router.post("/callback", authCallback);

export default router;