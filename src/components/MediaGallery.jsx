import React, { useState, useEffect } from "react";
import { Image as ImageIcon, PlayCircle, X } from "lucide-react";

// Lightbox Component
const Lightbox = ({ media, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!media) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-kalaa-orange transition-colors z-10"
        aria-label="Close media view"
      >
        <X className="w-8 h-8" />
      </button>

      <div
        className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {media.mediaType === "image" ? (
          <img
            src={media.mediaUrl}
            alt="Portfolio piece"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            loading="lazy"
          />
        ) : (
          <video
            src={media.mediaUrl}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            controls
            autoPlay
          />
        )}
      </div>
    </div>
  );
};

// Main MediaGallery Component
const MediaGallery = ({ portfolio }) => {
  const [selectedMedia, setSelectedMedia] = useState(null);

  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl shadow-md border-2 border-dashed border-gray-200 p-12 text-center">
        <ImageIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
        <h3 className="font-playfair font-bold text-kalaa-charcoal text-xl">
          Portfolio is Empty
        </h3>
        <p className="text-gray-500 mt-1">
          This artist has not uploaded any media yet.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {portfolio.map((media) => (
          <div
            key={media.id}
            className="relative rounded-2xl overflow-hidden shadow-md border border-gray-200 group cursor-pointer"
            onClick={() => setSelectedMedia(media)}
          >
            {media.mediaType === "image" ? (
              <img
                src={media.mediaUrl}
                alt="Portfolio piece"
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <video
                src={media.mediaUrl}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                muted
                loop
                playsInline
              />
            )}

            {/* Play icon for videos */}
            {media.mediaType === "video" && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <PlayCircle className="w-12 h-12 text-white opacity-80" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedMedia && (
        <Lightbox
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </>
  );
};

export default MediaGallery;
