import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, CalendarCheck, CheckCircle, Mail } from "lucide-react";

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
            {artist.coverImageUrl && (
              <>
                <img
                  src={artist.coverImageUrl}
                  alt={`${artist.artistName} cover`}
                  className="w-full h-48 md:h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </>
            )}
            <div className={`p-6 md:p-8 ${artist.coverImageUrl ? "md:pt-4" : ""}`}>
              <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 relative">
                {/* Profile */}
                <img
                  src={artist.profilePictureUrl || "https://i.imgur.com/8b2hUoE.jpeg"}
                  alt={artist.artistName}
                  className={`w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md flex-shrink-0 ${artist.coverImageUrl ? "-mt-12 md:-mt-16 z-10" : ""}`}
                />
                <div className="flex-grow">
                  <h1 className="font-playfair text-3xl md:text-5xl font-bold text-kalaa-charcoal flex items-center gap-2">
                    <span className={`${artist.coverImageUrl ? "text-white drop-shadow" : ""}`}>{artist.artistName}</span>
                    {artist.verified && (
                      <CheckCircle className={`w-5 h-5 md:w-6 md:h-6 ${artist.coverImageUrl ? "text-white" : "text-kalaa-amber"}`} title="Verified Artist" />
                    )}
                  </h1>
                  <div className={`mt-2 flex flex-wrap items-center gap-3 ${artist.coverImageUrl ? "text-white" : "text-kalaa-charcoal"}`}>
                    <span className="inline-flex items-center bg-white/90 text-kalaa-orange font-semibold px-3 py-1 rounded-full shadow-sm">
                      {artist.artForm}
                    </span>
                    <span className="inline-flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" /> {artist.location}
                    </span>
                  </div>
                  {/* Stats */}
                  <div className="mt-4 flex flex-wrap gap-3">
                    {(artist.reviewCount ?? 0) > 0 ? (
                      <span className="inline-flex items-center bg-white text-gray-800 text-sm px-3 py-1 rounded-full shadow-sm">
                        ⭐ {Number(artist.averageRating || 0).toFixed(1)} ({artist.reviewCount})
                      </span>
                    ) : (
                      <span className="inline-flex items-center bg-white text-gray-800 text-sm px-3 py-1 rounded-full shadow-sm">
                        No Reviews
                      </span>
                    )}
                  </div>
                </div>
                {/* Book Now (Desktop) */}
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

          {/* Quick Info Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 text-center">
              <p className="text-sm font-semibold text-kalaa-charcoal mb-1">Starting from</p>
              <p className="text-2xl font-bold text-kalaa-orange">₹10,000</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-200 text-center">
              <p className="text-sm font-semibold text-kalaa-charcoal mb-1">Usually responds within</p>
              <p className="text-lg font-bold text-gray-800">2hrs</p>
            </div>
          </div>

          {/* Contact Email */}
          {(artist.email || (artist.user && artist.user.email)) && (
            <div className="mb-8">
              <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
                <h3 className="font-playfair text-xl md:text-2xl font-bold text-kalaa-charcoal mb-3">Contact</h3>
                <a
                  href={`mailto:${artist.email || (artist.user && artist.user.email)}`}
                  className="inline-flex items-center gap-2 text-kalaa-orange hover:text-kalaa-red font-semibold break-all"
                >
                  <Mail className="w-5 h-5" /> {artist.email || (artist.user && artist.user.email)}
                </a>
                <p className="text-sm text-gray-600 mt-2">Use this email for enquiries and as a point of contact.</p>
              </div>
            </div>
          )}

          {/* Main Content Area */}
          <div className="grid grid-cols-1 gap-8 md:gap-12">
            {/* Bio, Portfolio, Reviews */}
            <div className="space-y-8 md:space-y-12">
              {/* About */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-kalaa-charcoal mb-3">About the Artist</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{artist.bio || "No biography provided."}</p>
              </section>

              {/* Portfolio */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-kalaa-charcoal mb-3">Portfolio</h2>
                <MediaGallery portfolio={artist.portfolio || []} />
              </section>

              {/* Reviews */}
              <section className="bg-white p-6 md:p-8 rounded-2xl shadow-md border border-gray-200">
                <h2 className="font-playfair text-2xl md:text-3xl font-bold text-kalaa-charcoal mb-3">Reviews</h2>
                <ReviewList
                  reviews={artist.reviews || []}
                  averageRating={artist.averageRating}
                  reviewCount={artist.reviewCount}
                />
              </section>
            </div>

            {/* Removed sticky booking aside for cleaner layout */}
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
