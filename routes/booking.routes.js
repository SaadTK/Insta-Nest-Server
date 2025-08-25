// routes/bookingRoutes.js
import express from "express";
import {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAllBookings,
} from "../controllers/bookingController.js";

// import { verifyToken } from "../middleware/authMiddleware.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getUserBookings);
router.delete("/:id", verifyToken, cancelBooking);
router.get("/all", verifyToken, getAllBookings);

export default router;
