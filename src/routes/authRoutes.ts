import express from "express";

const router = express.Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.post("/content",postContent);
router.get("/content",getCcontent);
router.delete("/content",deleteCcontent);
router.get("/share/:shareLink",getSharedContent);

export default router;