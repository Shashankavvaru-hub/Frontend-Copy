import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Palette,
  MapPin,
  Feather,
  Send,
  CheckCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

// Assuming these exist in your project
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { FireworksBackground } from "../components/ui/fireworks-background";

const BecomeArtistPage = () => {
  const [formData, setFormData] = useState({
    artistName: "",
    artForm: "",
    location: "",
    bio: "",
    shortBio: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();
  const { refreshUser } = useContext(AuthContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/artists/profile", formData);
      if (refreshUser) {
        await refreshUser();
      }
      setShowSuccessModal(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to create artist profile. Please try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToDashboard = () => {
    setShowSuccessModal(false);
    navigate("/dashboard");
  };

  return (
    <>
      <div className="min-h-screen bg-kalaa-cream flex items-center justify-center p-4">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <div className="text-center mb-8">
              <h1 className="font-playfair text-3xl md:text-4xl font-bold text-kalaa-charcoal">
                Become an Artist
              </h1>
              <p className="text-gray-600 mt-2">
                Join our community and share your art with the world.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 bg-red-50 text-red-800 p-4 rounded-lg border border-red-200">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all"
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all"
                    placeholder="e.g., Singer, Dance Group"
                    required
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all"
                    placeholder="e.g., Hyderabad, India"
                    required
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
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all"
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
                    rows="5"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all"
                    placeholder="Tell us about your art..."
                    required
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Profile...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Application
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="absolute inset-0 pointer-events-none">
            <FireworksBackground
              className="size-full"
              population={3}
              color={["#ff4d4f", "#52c41a", "#1677ff", "#faad14"]}
              fireworkSpeed={{ min: 4, max: 8 }}
              particleSize={{ min: 2, max: 6 }}
            />
          </div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto transform transition-all text-center p-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="font-playfair text-2xl font-bold text-kalaa-charcoal">
              Success!
            </h2>
            <p className="text-gray-600 mt-2 mb-6">
              Congratulations! Your artist profile has been created. You can now
              receive booking requests on Kalaa Setu.
            </p>
            <button
              onClick={handleGoToDashboard}
              className="w-full bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 group"
            >
              Go to my Dashboard
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BecomeArtistPage;
