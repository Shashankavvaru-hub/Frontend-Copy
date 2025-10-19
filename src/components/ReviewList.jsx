import React from "react";
import StarRating from "./StarRating"; // Assuming this component exists
import { MessageCircle } from "lucide-react";

const ReviewList = ({ reviews, averageRating, reviewCount }) => {
  return (
    <div className="w-full">
      {/* Overall Rating Summary */}
      {reviewCount > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold text-kalaa-charcoal">
              {averageRating.toFixed(1)}
            </div>
            <div>
              <StarRating rating={averageRating} size="h-6 w-6" />
              <p className="text-sm text-gray-600 mt-1">
                Based on {reviewCount} review{reviewCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal Scrolling Container */}
      <div className="flex overflow-x-auto space-x-6 pb-4 -mx-4 px-4 scrollbar-hide">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar with initials */}
                  <div className="w-10 h-10 rounded-full bg-kalaa-orange text-white flex items-center justify-center font-bold">
                    {review.reviewerName
                      ? review.reviewerName.charAt(0).toUpperCase()
                      : "?"}
                  </div>
                  <h3 className="font-playfair font-bold text-kalaa-charcoal text-lg">
                    {review.reviewerName || "Anonymous"}
                  </h3>
                </div>
                <StarRating rating={review.rating} />
              </div>

              <p className="text-gray-600 text-sm italic flex-grow">
                "{review.comment}"
              </p>

              <div className="text-right text-xs text-gray-400 mt-4 pt-4 border-t border-gray-100">
                Reviewed on: {new Date(review.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-200 p-12 text-center">
            <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="font-playfair font-bold text-kalaa-charcoal text-xl">
              No Reviews Yet
            </h3>
            <p className="text-gray-500 mt-1">
              This artist is waiting for their first review.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// CSS to hide the scrollbar for a cleaner look
const style = document.createElement("style");
style.innerHTML = `
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
`;
document.head.appendChild(style);

export default ReviewList;
