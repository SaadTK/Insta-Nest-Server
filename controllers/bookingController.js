// controllers/bookingController.js
import Booking from "../models/Bookings.js";

// Create a booking

export const createBooking = async (req, res) => {
  try {
    console.log("Booking request body:", req.body); // Add this line to debug

    const { room, checkIn, checkOut, guests, totalPrice } = req.body;
    const userId = req.user.id;

    // Check all required fields exist
    if (!room || !checkIn || !checkOut || !guests || !totalPrice) {
      return res.status(400).json({ error: "Missing booking information" });
    }

    // Check if this room is already booked by any user
    const roomAlreadyBooked = await Booking.findOne({ room });
    if (roomAlreadyBooked) {
      return res.status(400).json({ error: "This room is already booked." });
    }

    const booking = new Booking({ ...req.body, user: userId });
    const saved = await booking.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get bookings for logged-in user
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cancel/delete a booking
export const cancelBooking = async (req, res) => {
  try {
    const deleted = await Booking.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ error: "Booking not found or not authorized" });
    }

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all bookings (for admin or general purposes)
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room user");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
