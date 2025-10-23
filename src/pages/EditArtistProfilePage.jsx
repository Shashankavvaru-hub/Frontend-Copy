import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { User, Palette, MapPin, Feather, Save } from "lucide-react";

// Assuming these exist in your project
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { showSuccessToast, showErrorToast } from "../utils/notifications";
import LoadingSpinner from "../components/LoadingSpinner"; // Assuming this exists

const EditArtistProfilePage = () => {
  const [formData, setFormData] = useState({
    artistName: "",
    artForm: "",
    location: "",
    bio: "",
    shortBio: "",
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true); // Separate loading state for initial fetch
  const { user, refreshUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // Pre-fill the form with existing details
  useEffect(() => {
    if (user && user.artist) {
      setFormData({
        artistName: user.artist.artistName || "",
        artForm: user.artist.artForm || "",
        location: user.artist.location || "",
        bio: user.artist.bio || "",
        shortBio: user.artist.shortBio || "",
      });
      setInitialLoading(false); // Data loaded
    } else if (user && !user.artist) {
      // Handle case where user is logged in but not an artist (redirect or show message)
      showErrorToast("You do not have an artist profile to edit.");
      navigate("/dashboard"); // Or another appropriate page
      setInitialLoading(false);
    }
    // If no user context yet, initialLoading remains true until user data is available
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Use this for form submission loading state
    try {
      await api.put("/artists/me", formData);
      if (refreshUser) {
        await refreshUser(); // Refresh global user context if function exists
      }
      showSuccessToast("Profile updated successfully!");
      setTimeout(() => navigate("/dashboard"), 1500); // Shorter delay after toast
    } catch (err) {
      showErrorToast(
        err.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Show spinner during initial data fetch
  if (initialLoading) {
    return <LoadingSpinner />;
  }

  // Ensure we don't render the form if the user is somehow not an artist
  if (!user?.artist) {
    // Should have been redirected, but as a fallback:
    return (
      <div className="text-center p-8 text-red-600">
        Error: Artist profile not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-kalaa-cream flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-kalaa-charcoal">
              Edit Your Artist Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Keep your information up-to-date.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="artistName"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Artist / Group Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="artistName"
                  name="artistName"
                  value={formData.artistName}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="artForm"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Art Form
              </label>
              <div className="relative">
                <Palette className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="artForm"
                  name="artForm"
                  value={formData.artForm}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                  required
                  placeholder="e.g., Burrakatha, Bharatanatyam"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                  required
                  placeholder="e.g., Hyderabad, Telangana"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="shortBio"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Short Bio (one-liner)
              </label>
              <div className="relative">
                <Feather className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="shortBio"
                  name="shortBio"
                  value={formData.shortBio}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                  placeholder="E.g., Folk singer with 8+ years experience"
                  maxLength={160}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="bio"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Bio / Description
              </label>
              <div className="relative">
                <Feather className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <textarea
                  id="bio"
                  name="bio"
                  rows={5}
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                  required
                  placeholder="Tell potential clients about yourself, your art form, experience, and what makes you unique..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditArtistProfilePage;
