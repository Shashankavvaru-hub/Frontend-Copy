import React from "react";
import { Star } from "lucide-react"; // Using a high-quality SVG icon library

/**
 * A flexible StarRating component that supports full and half-star ratings.
 * @param {object} props - The component props.
 * @param {number} props.rating - The numerical rating value (e.g., 4.5).
 * @param {string} [props.size='h-5 w-5'] - Tailwind CSS classes for the star size.
 */
const StarRating = ({ rating = 0, size = "h-5 w-5" }) => {
  const totalStars = 5;

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;

        // --- Logic for Full, Half, and Empty Stars ---

        if (starValue <= Math.floor(rating)) {
          // Full star
          return (
            <Star
              key={index}
              className={`${size} text-kalaa-amber fill-current`}
              aria-hidden="true"
            />
          );
        } else if (starValue === Math.ceil(rating) && rating % 1 !== 0) {
          // Half star - achieved by layering two icons
          return (
            <div key={index} className={`relative ${size}`}>
              {/* Empty star as the background */}
              <Star
                className={`${size} text-gray-300 fill-current absolute top-0 left-0`}
                aria-hidden="true"
              />
              {/* Filled star inside a half-width container */}
              <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
                <Star
                  className={`${size} text-kalaa-amber fill-current`}
                  aria-hidden="true"
                />
              </div>
            </div>
          );
        } else {
          // Empty star
          return (
            <Star
              key={index}
              className={`${size} text-gray-300 fill-current`}
              aria-hidden="true"
            />
          );
        }
      })}
    </div>
  );
};

export default StarRating;
