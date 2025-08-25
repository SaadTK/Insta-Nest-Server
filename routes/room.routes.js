import express from "express";
import {
  createRoom,
  getRooms,
  getRoomById,
  updateRoom,
  deleteRoom,
  getFilteredRooms,
} from "../controllers/roomController.js";

const router = express.Router();

// Create new room
router.post("/", createRoom);

// Get all rooms
router.get("/", getRooms);

// Get single room by ID
router.get("/:id", getRoomById);

// Update room by ID
router.put("/:id", updateRoom);

// Delete room by ID
router.delete("/:id", deleteRoom);

router.get("/rooms", getFilteredRooms);


export default router;
