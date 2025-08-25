import express from "express";
import {
  postReview,
  getReviewsByRoom,
  getAllReviews,
} from "../controllers/reviewController.js";
// import verifyUser from "../middlewares/authMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/:roomId", verifyToken, postReview);
router.get("/:roomId", getReviewsByRoom);
router.get("/", getAllReviews);
export default router;
