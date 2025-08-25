import Review from "../models/Review.js";

// POST a review for a room
// export const postReview = async (req, res) => {
//   try {
//     const { roomId } = req.params;
//     const { rating, comment } = req.body;
//     const userId = req.user.id; // assuming you have auth middleware that sets req.userId

//     if (!rating || !comment) {
//       return res
//         .status(400)
//         .json({ message: "Rating and comment are required" });
//     }

//     // Optional: prevent user from posting multiple reviews for same room
//     const existingReview = await Review.findOne({ room: roomId, user: userId });
//     if (existingReview) {
//       return res
//         .status(400)
//         .json({ message: "You have already reviewed this room" });
//     }

//     const review = new Review({
//       room: roomId,
//       user: userId,
//       rating,
//       comment,
//     });

//     const savedReview = await review.save();
//     res.status(201).json(savedReview);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// POST a review for a room
export const postReview = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || !comment) {
      return res
        .status(400)
        .json({ message: "Rating and comment are required" });
    }

    // Check for existing review
    const existingReview = await Review.findOne({ room: roomId, user: userId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this room" });
    }

    // Save new review
    const newReview = new Review({
      room: roomId,
      user: userId,
      rating,
      comment,
    });
    await newReview.save();

    // 🔥 Re-fetch with user info populated
    const populatedReview = await Review.findById(newReview._id).populate(
      "user",
      "name email"
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all reviews for a room, sorted newest first
export const getReviewsByRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const reviews = await Review.find({ room: roomId })
      .populate("user", "name email") // populate user info, adjust as needed
      .sort({ createdAt: -1 }); // newest first

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAllReviews = async (req, res) => {
  try {
    // Populate user and room info if you want to show names or room titles
    const reviews = await Review.find()
      .populate("room", "name") // populate only the `name` field of the room
      .populate("user", "name"); // also populate user name if needed

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error fetching reviews" });
  }
};
