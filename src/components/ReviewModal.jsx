import React, { useState } from "react";
import { FireworksBackground } from "./ui/fireworks-background";
import { X, Star, Send } from "lucide-react";

// Assuming these exist in your project
import api from "../api/axiosConfig";
import { showSuccessToast, showErrorToast } from "../utils/notifications";

const ReviewModal = ({ show, handleClose, booking, onReviewSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0); // For hover effect
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      showErrorToast("Please select a star rating.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/reviews", {
        bookingId: booking.id,
        rating: rating,
        comment: comment,
      });
      showSuccessToast("Thank you for your review!");
      onReviewSubmit(); // Refresh the calling component's data
      // Celebrate briefly, then reset and close
      setCelebrate(true);
      setTimeout(() => {
        setCelebrate(false);
        setRating(0);
        setComment("");
        handleClose();
      }, 1200);
      return;
    } catch (err) {
      showErrorToast(
        err.response?.data?.message ||
          err.response?.data ||
          "Failed to submit review."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-kalaa-cream/90 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {celebrate && (
        <div className="absolute inset-0 pointer-events-none">
          <FireworksBackground
            className="size-full"
            population={2}
            color={["#ff4d4f", "#52c41a", "#1677ff", "#faad14"]}
            fireworkSpeed={{ min: 4, max: 8 }}
            particleSize={{ min: 2, max: 6 }}
          />
        </div>
      )}
      {/* Modal Panel */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto transform transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="p-5 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
          <h2 className="font-playfair text-xl md:text-2xl font-bold text-kalaa-charcoal">
            Leave a Review for {booking.artist.artistName}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* Main Content (Scrollable) */}
        <main className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating Input */}
            <div className="text-center">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Rating
              </label>
              <div
                className="flex justify-center items-center space-x-1"
                onMouseLeave={() => setHoverRating(0)} // Reset hover on mouse leave
              >
                {[...Array(5)].map((_, index) => {
                  const starValue = index + 1;
                  const isFilled = starValue <= (hoverRating || rating);
                  return (
                    <button
                      key={starValue}
                      type="button" // Important to prevent form submission
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      className="p-1 focus:outline-none focus:ring-2 focus:ring-kalaa-orange focus:ring-offset-2 rounded-full transition-colors"
                      aria-label={`Rate ${starValue} star${
                        starValue > 1 ? "s" : ""
                      }`}
                    >
                      <Star
                        className={`w-8 h-8 md:w-10 md:h-10 transition-colors ${
                          isFilled
                            ? "text-kalaa-amber fill-current"
                            : "text-gray-300 fill-current"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment Input */}
            <div>
              <label
                htmlFor="comment"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Your Comments
              </label>
              <textarea
                id="comment"
                rows={5}
                placeholder="Share your experience with this artist... (e.g., performance quality, professionalism, communication)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800 placeholder-gray-400"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || rating === 0}
              className="w-full bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting Review...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default ReviewModal;
