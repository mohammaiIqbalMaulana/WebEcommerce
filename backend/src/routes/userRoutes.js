import express from "express";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
  res.json({ message: "User route ready ✅" });
});

export default router;
