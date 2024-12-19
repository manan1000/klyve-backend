import express from "express";
import { resetPassword , forgotPassword, logout, signin, signup } from "../controllers/auth.controller";


const router = express.Router();

router.post("/signup", signup);
router.post("/signin",signin);
router.get("/logout",logout);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);


export default router;