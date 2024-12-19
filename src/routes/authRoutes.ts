import express from "express";
import { signin, signup } from "../controllers/auth.controller";


const router = express.Router();

router.post("/signup", signup);
router.post("/signin",signin);
router.post("/logout",logout);


export default router;