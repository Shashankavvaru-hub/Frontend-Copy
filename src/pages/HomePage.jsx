import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Search, Mic, Map, List, ChevronDown } from "lucide-react";

import ArtistCard from "../components/ArtistCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import MapComponent from "../components/MapComponent";
import api from "../api/axiosConfig"; // Assuming this is configured
import { AuthContext } from "../context/AuthContext"; // Assuming this is configured

// --- Main HomePage Decider ---
const HomePage = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="bg-kalaa-cream min-h-full">
      {user && user.artist ? (
        <ArtistHomePageView artist={user.artist} />
      ) : (
        <UserHomePageView />
      )}
    </div>
  );
};

// --- View for Regular Users and Guests ---
const UserHomePageView = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'map'

  // Search & Filter State
  const [filterCategory, setFilterCategory] = useState("artistName");
  const [filterValue, setFilterValue] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Voice Search State
  const [isListening, setIsListening] = useState(false);
  const [speechApiSupported, setSpeechApiSupported] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechApiSupported(true);
    }
  }, []);

  // Debounced data fetching
  useEffect(() => {
    const timerId = setTimeout(() => {
      setLoading(true);
      const fetchArtists = async () => {
        try {
          const params = new URLSearchParams();
          if (filterValue) {
            params.append(filterCategory, filterValue);
          }
          const response = await api.get(`/artists?${params.toString()}`);
          setArtists(response.data);
          console.log(artists);
          setError(null);
        } catch (err) {
          setError("Failed to fetch artists. Please try again later.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchArtists();
    }, 500); // 500ms debounce

    return () => clearTimeout(timerId);
  }, [filterCategory, filterValue]);

  const handleListen = () => {
    if (isListening || !speechApiSupported) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setFilterCategory("artistName"); // Default to artist name for voice search
      setFilterValue(transcript);
    };
    recognition.start();
  };

  const categoryLabels = {
    artistName: "Artist Name",
    artForm: "Art Form",
    location: "Location",
  };

  const selectCategory = (category) => {
    setFilterCategory(category);
    setIsDropdownOpen(false);
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <EmptyState message={error} isError={true} />;
    if (artists.length === 0)
      return <EmptyState message="No artists found matching your criteria." />;

    if (viewMode === "map") {
      return (
        <div className="mt-8">
          <MapComponent artists={artists} />
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {artists.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* --- Hero Section --- */}
      <div className="text-center rounded-2xl bg-white shadow-lg p-8 md:p-12 mb-8 border border-gray-200">
        <h1 className="text-4xl md:text-5xl font-bold text-kalaa-charcoal font-playfair mb-4">
          Discover the Soul of Telangana's Artistry
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with talented local artists. Find the perfect performance for
          your event, from traditional Burrakatha to vibrant Bharatanatyam.
        </p>
      </div>

      {/* --- Search and View Toggle Section --- */}
      <div className="bg-white p-4 rounded-2xl shadow-md border border-gray-200 sticky top-20 z-20 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex flex-col md:flex-row items-center gap-4 w-full md:flex-1">
          <div className="relative w-full md:w-auto">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-between w-full md:w-48 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-3 rounded-lg transition-colors"
            >
              <span>{categoryLabels[filterCategory]}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-full md:w-48 bg-white rounded-lg shadow-xl border z-30">
                <a
                  href="#"
                  onClick={() => selectCategory("artistName")}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Artist Name
                </a>
                <a
                  href="#"
                  onClick={() => selectCategory("artForm")}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Art Form
                </a>
                <a
                  href="#"
                  onClick={() => selectCategory("location")}
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Location
                </a>
              </div>
            )}
          </div>
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search by ${categoryLabels[filterCategory]}...`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-kalaa-orange transition-colors"
            />
            {speechApiSupported && (
              <button
                onClick={handleListen}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-kalaa-orange"
                aria-label="Speak to search"
              >
                <Mic
                  className={`w-5 h-5 ${
                    isListening ? "text-red-500 animate-pulse" : ""
                  }`}
                />
              </button>
            )}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex-shrink-0">
          <div className="bg-gray-200 p-1 rounded-full flex items-center">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-white text-kalaa-orange shadow"
                  : "bg-transparent text-gray-600"
              }`}
            >
              <List className="w-5 h-5 inline mr-1" /> List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                viewMode === "map"
                  ? "bg-white text-kalaa-orange shadow"
                  : "bg-transparent text-gray-600"
              }`}
            >
              <Map className="w-5 h-5 inline mr-1" /> Map
            </button>
          </div>
        </div>
      </div>

      {/* --- Main Content --- */}
      {renderContent()}
    </div>
  );
};

// --- View for Logged-in Artists ---
const ArtistHomePageView = ({ artist }) => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 text-center">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 md:p-16 max-w-3xl mx-auto">
        <img
          src={artist.profilePictureUrl || "https://i.imgur.com/8b2hUoE.jpeg"}
          alt={artist.artistName}
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-kalaa-amber shadow-lg"
        />
        <h1 className="text-3xl md:text-4xl font-bold text-kalaa-charcoal font-playfair mb-3">
          Welcome back, {artist.artistName}!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Manage your profile, showcase your art, and connect with new
          opportunities.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
