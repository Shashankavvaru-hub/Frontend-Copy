import React, { useState, useEffect, useContext } from "react";
import {
  User,
  Mail,
  Smartphone,
  Edit,
  Save,
  X,
  AlertTriangle,
} from "lucide-react";

// Assuming these exist in your project
import api from "../api/axiosConfig";
import { AuthContext } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fullName: "", email: "" });
  // const { updateUser } = useContext(AuthContext); // Optional: if you update context on save

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
        setFormData({
          fullName: response.data.fullName || "",
          email: response.data.email || "",
        });
      } catch (err) {
        setError("Failed to fetch user profile. Please try logging in again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.put("/users/me", formData);
      setUser(response.data);
      // if (updateUser) updateUser(response.data); // Optionally update global context
      setIsEditing(false);
      // Consider adding a success toast here
    } catch (err) {
      setError(
        "Failed to update profile. Please check your input and try again."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original user data before cancelling
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
    }
    setIsEditing(false);
    setError(""); // Clear any errors shown during edit
  };

  if (loading && !user) return <LoadingSpinner />; // Show spinner only on initial load
  if (!loading && error && !user)
    return <EmptyState message={error} isError={true} />; // Show error if user couldn't be loaded
  if (!user) return <EmptyState message="No user data found. Please log in." />; // Fallback if no user data

  return (
    <div className="bg-kalaa-cream min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 w-full">
          <h1 className="font-playfair text-center text-4xl md:text-5xl font-bold text-kalaa-charcoal">
            My Profile
          </h1>
        </header>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 max-w-2xl mx-auto">
          {/* Display general errors here */}
          {error && !isEditing && (
            <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
              <span>{error}</span>
            </div>
          )}

          {isEditing ? (
            // --- EDIT MODE ---
            <form onSubmit={handleSave} className="space-y-6">
              {/* Display errors specific to saving */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={user.mobileNumber}
                    disabled
                    readOnly
                    className="w-full pl-10 pr-4 py-3 bg-gray-100 border-2 border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Mobile number cannot be changed.
                </p>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-2 px-6 rounded-full transition-colors shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />{" "}
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2"
                >
                  <X className="w-5 h-5" /> Cancel
                </button>
              </div>
            </form>
          ) : (
            // --- VIEW MODE ---
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 border-b">
                <User className="w-6 h-6 text-kalaa-orange flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-semibold text-lg text-kalaa-charcoal">
                    {user.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 border-b">
                <Smartphone className="w-6 h-6 text-kalaa-orange flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Mobile Number</p>
                  <p className="font-semibold text-lg text-kalaa-charcoal">
                    {user.mobileNumber}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4">
                <Mail className="w-6 h-6 text-kalaa-orange flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Email Address</p>
                  <p className="font-semibold text-lg text-kalaa-charcoal">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>
              <div className="pt-4 text-right">
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-gray-100 hover:bg-gray-200 text-kalaa-charcoal font-bold py-2 px-6 rounded-full transition-colors flex items-center gap-2 ml-auto"
                >
                  <Edit className="w-5 h-5" /> Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
