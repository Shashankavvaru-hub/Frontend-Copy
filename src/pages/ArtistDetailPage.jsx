import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, CalendarCheck, CheckCircle } from "lucide-react";

// Assuming these components and context/api exist
import api from "../api/axiosConfig";
import MediaGallery from "../components/MediaGallery";
import BookingModal from "../components/BookingModal";
import { AuthContext } from "../context/AuthContext";
import ReviewList from "../components/ReviewList";
import LoadingSpinner from "../components/LoadingSpinner"; // Assuming this exists
import EmptyState from "../components/EmptyState"; // Assuming this exists

const ArtistDetailPage = () => {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const auth = useContext(AuthContext); // Use useContext directly
  const { token } = auth || {}; // Destructure safely
  const navigate = useNavigate();

  const handleBookNowClick = () => {
    if (token) setShowModal(true);
    else navigate("/login");
  };

  useEffect(() => {
    const fetchArtistDetails = async () => {
      setLoading(true); // Ensure loading state is set at the start
      setError(null); // Reset error state
      try {
        const response = await api.get(`/artists/${id}`);
        setArtist(response.data);
        console.log(response);
      } catch (err) {
        setError(
          "Failed to fetch artist details. The artist may not exist or there was a network issue."
        );
        console.error("Error fetching artist:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArtistDetails();
  }, [id]);

  // Handle loading state
  if (loading) return <LoadingSpinner />;

  // Handle error state
  if (error) return <EmptyState message={error} isError={true} />;

  // Handle artist not found state
  if (!artist) return <EmptyState message="Artist not found." />;

  // --- Render Artist Details ---
  return (
    <>
      <div className="bg-kalaa-cream min-h-screen">
        <div className="container mx-auto px-4 py-8 md:py-12">
          {/* Hero Section */}
          <div className="relative mb-8 md:mb-12 rounded-2xl overflow-hidden bg-white shadow-lg border border-gray-200">
            {/* Optional Cover Image */}
            {artist.coverImageUrl && (
              <img
                src={artist.coverImageUrl}
                alt={`${artist.artistName} cover`}
                className="w-full h-48 md:h-64 object-cover"
              />
            )}
            <div
              className={`p-6 md:p-8 ${artist.coverImageUrl ? "md:pt-4" : ""}`}
            >
              {" "}
              {/* Adjust padding if cover exists */}
              <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 relative">
                {/* Profile Picture */}
                <img
                  src={
                    artist.profilePictureUrl ||
                    "https://i.imgur.com/8b2hUoE.jpeg"
                  }
                  alt={artist.artistName}
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md flex-shrink-0 ${
                    artist.coverImageUrl ? "-mt-12 md:-mt-16 z-10" : ""
                  }`}
                />
                <div className="flex-grow">
                  <h1 className="font-playfair text-3xl md:text-5xl font-bold text-kalaa-charcoal mb-1">
                    {artist.artistName}
                    {artist.verified && (
                      <CheckCircle
                        className="w-5 h-5 md:w-6 md:h-6 inline-block text-kalaa-amber ml-2 mb-1"
                        title="Verified Artist"
                      />
                    )}
                  </h1>
                  <p className="font-semibold text-kalaa-orange text-lg md:text-xl mb-2">
                    {artist.artForm}
                  </p>
                  <div className="flex items-center text-gray-600 text-sm md:text-base">
                    <MapPin className="w-4 h-4 mr-2" />
                    {artist.location}
                  </div>
                </div>
                {/* Book Now Button (Desktop - Right aligned) */}
                <div className="hidden md:block flex-shrink-0">
                  <button
                    onClick={handleBookNowClick}
                    className="bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md flex items-center gap-2"
                  >
                    <CalendarCheck className="w-5 h-5" /> Book Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Left Column (Bio, Portfolio, Reviews) */}
            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              {/* About Section */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-kalaa-charcoal mb-4">
                  About the Artist
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {artist.bio || "No biography provided."}
                </p>
              </section>

              {/* Portfolio Section */}
              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-kalaa-charcoal mb-4">
                  Portfolio
                </h2>
                <MediaGallery portfolio={artist.portfolio || []} />
              </section>

              {/* Reviews Section */}
              <section>
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-kalaa-charcoal mb-4">
                  Reviews
                </h2>
                <ReviewList
                  reviews={artist.reviews || []}
                  averageRating={artist.averageRating}
                  reviewCount={artist.reviewCount}
                />
              </section>
            </div>

            {/* Right Column (Sticky Booking - Desktop) */}
            <aside className="hidden lg:block relative">
              <div className="sticky top-24 space-y-6">
                {" "}
                {/* Adjust top value based on your header height */}
                {/* Simplified Booking Card */}
                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 text-center">
                  <p className="text-lg font-semibold text-kalaa-charcoal mb-1">
                    Starting from
                  </p>
                  <p className="text-3xl font-bold text-kalaa-orange mb-4">
                    ₹{artist.startingPrice || "N/A"}
                  </p>
                  <button
                    onClick={handleBookNowClick}
                    className="w-full bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <CalendarCheck className="w-5 h-5" /> Book Now
                  </button>
                  <p className="text-xs text-gray-500 mt-3">
                    Check availability and get a quote
                  </p>
                </div>
                {/* Add other info like response time, languages etc. if available */}
                {artist.responseTime && (
                  <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 text-sm text-gray-700">
                    Usually responds within:{" "}
                    <span className="font-semibold">{artist.responseTime}</span>
                  </div>
                )}
              </div>
            </aside>
          </div>

          {/* Book Now Button (Mobile - Sticky Footer) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-200 shadow-lg z-30">
            <button
              onClick={handleBookNowClick}
              className="w-full bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <CalendarCheck className="w-5 h-5" /> Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showModal && artist && (
        <BookingModal
          show={showModal}
          handleClose={() => setShowModal(false)}
          artistId={artist.id}
          artistName={artist.artistName}
          unavailableDates={artist.unavailableDates || []}
        />
      )}
    </>
  );
};

export default ArtistDetailPage;
