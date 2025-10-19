import React, { useState, useEffect, useContext } from "react";
import Calendar from "react-calendar";
import { Save, Info } from "lucide-react";
import "react-calendar/dist/Calendar.css"; // Calendar styles
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { showSuccessToast, showErrorToast } from "../utils/notifications";
import LoadingSpinner from "../components/LoadingSpinner"; // Optional loading spinner

const AvailabilityPage = () => {
  const { user, refreshUser } = useContext(AuthContext);
  const [unavailableTimestamps, setUnavailableTimestamps] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // --- Load user data and convert dates to UTC timestamps ---
  useEffect(() => {
    if (user && user.artist) {
      const initialTimestamps = new Set(
        (user.artist.unavailableDates || []).map((dateStr) => {
          const date = new Date(dateStr + "T00:00:00Z"); // Parse in UTC
          date.setUTCHours(0, 0, 0, 0); // Normalize to start of day
          return date.getTime();
        })
      );
      setUnavailableTimestamps(initialTimestamps);
    }
    setInitialLoading(false);
  }, [user]);

  // --- Handle selecting/deselecting dates ---
  const handleDateClick = (date) => {
    date.setUTCHours(0, 0, 0, 0); // Normalize
    const timestamp = date.getTime();
    const newTimestamps = new Set(unavailableTimestamps);
    if (newTimestamps.has(timestamp)) {
      newTimestamps.delete(timestamp);
    } else {
      newTimestamps.add(timestamp);
    }
    setUnavailableTimestamps(newTimestamps);
  };

  // --- Apply custom CSS class for unavailable dates ---
  const tileClassName = ({ date }) => {
    date.setUTCHours(0, 0, 0, 0);
    return unavailableTimestamps.has(date.getTime())
      ? "unavailable-date"
      : null;
  };

  // --- Save availability to backend ---
  const handleSaveAvailability = async () => {
    setLoading(true);
    try {
      const dateStrings = Array.from(unavailableTimestamps).map(
        (ts) => new Date(ts).toISOString().split("T")[0]
      );

      await api.put("/artists/me/availability", {
        unavailableDates: dateStrings,
      });
      if (refreshUser) await refreshUser();
      showSuccessToast("Your availability has been updated!");
    } catch (err) {
      console.error(err);
      showErrorToast("Failed to update availability.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  if (!user?.artist) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 p-8">
        You must have an artist profile to manage availability.
      </div>
    );
  }

  // --- Custom calendar styles for Tailwind ---
  // Custom styles for react-calendar to match the theme
  const calendarStyles = `
        .themed-calendar {
            border-radius: 1rem;
            border: 1px solid #e5e7eb;
            padding: 1.25rem;
            background-color: white;
            width: 100%;
        }
        .themed-calendar .react-calendar__navigation button {
            color: #D84315; /* kalaa-orange */
            font-weight: 700;
            border-radius: 0.5rem;
        }
        .themed-calendar .react-calendar__navigation button:hover,
        .themed-calendar .react-calendar__navigation button:focus {
            background-color: #FFF8E1; /* kalaa-cream */
        }
        .themed-calendar .react-calendar__month-view__weekdays__weekday {
            text-align: center;
            font-weight: 600;
            color: #4B5563;
        }
        .themed-calendar .react-calendar__tile {
            border-radius: 9999px; /* rounded-full */
            transition: background-color 0.2s, color 0.2s;
        }
        .themed-calendar .react-calendar__tile:enabled:hover,
        .themed-calendar .react-calendar__tile:enabled:focus {
            background-color: #FFF8E1; /* kalaa-cream */
        }
        .themed-calendar .react-calendar__tile--now {
            background-color: #fde6d8; /* A lighter orange */
            color: #D84315;
            font-weight: bold;
        }
        /* --- ADDED RULE TO HIDE DEFAULT BLUE --- */
        .themed-calendar .react-calendar__tile--active {
             background-color: #FFF8E1 !important; /* kalaa-cream (hover color) */
             color: #4B5563 !important; /* Keep text color readable */
        }
        /* --- END ADDED RULE --- */
        .themed-calendar .unavailable-date {
            background-color: #C62828 !important; /* kalaa-red */
            color: white !important;
            text-decoration: line-through;
        }
        .themed-calendar .unavailable-date:hover {
            background-color: #a82222 !important;
        }
    `;

  return (
    <div className="min-h-screen bg-kalaa-cream flex items-center justify-center p-4">
      <style>{calendarStyles}</style>
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="text-center mb-6">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-kalaa-charcoal">
              Manage Your Availability
            </h1>
          </div>

          <div className="flex items-start gap-3 bg-blue-50 text-blue-800 p-4 rounded-lg border border-blue-200 mb-6">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span>
              Click on dates to mark them as{" "}
              <strong className="font-semibold">unavailable</strong>. Click
              again to make them available.
            </span>
          </div>

          <div className="flex justify-center">
            <Calendar
              onClickDay={handleDateClick}
              tileClassName={tileClassName}
              minDate={new Date()}
              className="themed-calendar"
            />
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-kalaa-red"></div>
              <span>Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: "#fde6d8" }}
              ></div>
              <span>Today</span>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleSaveAvailability}
              disabled={loading}
              className="w-full md:w-auto bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Availability
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvailabilityPage;
