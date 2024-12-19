import express from "express";
import { logout, signin, signup } from "../controllers/auth.controller";


const router = express.Router();

router.post("/signup", signup);
router.post("/signin",signin);
router.get("/logout",logout);


export default router;