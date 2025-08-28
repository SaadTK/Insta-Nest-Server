import Room from "../models/Room.js";

// Create new room
export const createRoom = async (req, res) => {
  try {
    const room = new Room(req.body);
    const savedRoom = await room.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single room by ID
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update room by ID
export const updateRoom = async (req, res) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedRoom)
      return res.status(404).json({ message: "Room not found" });
    res.json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete room by ID
export const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);
    if (!deletedRoom)
      return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Filter/Search Rooms by Price, Capacity, Rating

export const getFilteredRooms = async (req, res) => {
  try {
    const { ranges } = req.query;
    console.log("Received ranges:", ranges);

    if (!ranges) {
      const allRooms = await Room.find();
      return res.json(allRooms);
    }

    const rangeArray = ranges.split(",").map((range) => {
      const [minStr, maxStr] = range.split("-");
      const min = parseInt(minStr, 10);
      const max = parseInt(maxStr, 10);

      if (isNaN(min) || isNaN(max)) {
        throw new Error(`Invalid range: ${range}`);
      }

      return { min, max };
    });

    const orConditions = rangeArray.map(({ min, max }) => ({
      price: { $gte: min, $lte: max },
    }));

    const rooms = await Room.find({ $or: orConditions });
    return res.json(rooms);
  } catch (err) {
    console.error("Filter error:", err);
    return res.status(500).json({ error: "Failed to filter rooms." });
  }
};
