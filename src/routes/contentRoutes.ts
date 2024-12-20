import express from "express";
import { getContent, postContent } from "../controllers/content.controller";
import { authenticateRoute } from "../middleware/authenticateRoute";

const router = express.Router();

router.post("/content", authenticateRoute, postContent);
router.get("/content", authenticateRoute, getContent);
// router.delete("/content",deleteCcontent);
// router.get("/share/:shareLink",getSharedContent);


export default router;