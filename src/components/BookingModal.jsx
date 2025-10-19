import React, { useState, useMemo } from "react";
import Calendar from "react-calendar";
import { X, AlertTriangle, CheckCircle, Send } from "lucide-react";

// Assuming this exists in your project
import api from "../api/axiosConfig";

// A robust helper function to convert a Date object to a 'YYYY-MM-DD' string, ignoring timezones.
const toYYYYMMDD = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const BookingModal = ({
  show,
  handleClose,
  artistId,
  artistName,
  unavailableDates,
}) => {
  const [eventDate, setEventDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const unavailableDateSet = useMemo(() => {
    return new Set(unavailableDates || []);
  }, [unavailableDates]);

  const isDateDisabled = ({ date }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return true;
    }
    const dateString = toYYYYMMDD(date);
    return unavailableDateSet.has(dateString);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formattedDate = toYYYYMMDD(eventDate);
      const bookingRequest = {
        artistId,
        eventDate: formattedDate,
        eventDescription: message,
      };

      await api.post("/bookings", bookingRequest);

      setSuccess(`Your booking request for ${artistName} has been sent!`);
      setTimeout(() => {
        handleClose();
        setSuccess("");
        setMessage("");
        setEventDate(new Date());
      }, 2500);
    } catch (err) {
      setError("Failed to send booking request. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calendarStyles = `
    .themed-calendar {
        border-radius: 1rem;
        border: 1px solid #e5e7eb;
        padding: 1rem;
        background-color: white;
        width: 100%;
    }
    .themed-calendar .react-calendar__navigation button {
        color: #D84315;
        font-weight: 700;
    }
    .themed-calendar .react-calendar__navigation button:hover,
    .themed-calendar .react-calendar__navigation button:focus {
        background-color: #FFF8E1;
    }
    .themed-calendar .react-calendar__month-view__weekdays__weekday {
        text-align: center;
        font-weight: 600;
        color: #4B5563;
    }
    .themed-calendar .react-calendar__tile {
        border-radius: 9999px;
    }
    .themed-calendar .react-calendar__tile:enabled:hover,
    .themed-calendar .react-calendar__tile:enabled:focus {
        background-color: #FFF8E1;
    }
    .themed-calendar .react-calendar__tile--now {
        background-color: #fde6d8;
        color: #D84315;
    }
    .themed-calendar .react-calendar__tile--active {
        background-color: #D84315 !important;
        color: white !important;
    }
    .themed-calendar .react-calendar__tile--disabled {
        background-color: #f3f4f6;
        color: #9ca3af;
        text-decoration: line-through;
    }
  `;

  if (!show) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-kalaa-cream bg-opacity-80 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <style>{calendarStyles}</style>
      {/* MODAL PANEL: Added flex layout and max-height to contain content */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto transform transition-all flex flex-col max-h-[90vh]">
        {/* Header */}
        <header className="p-5 flex items-center justify-between border-b border-gray-200 flex-shrink-0">
          <h2 className="font-playfair text-2xl font-bold text-kalaa-charcoal">
            Book {artistName}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </header>

        {/* MAIN CONTENT: Made scrollable */}
        <main className="p-6 overflow-y-auto">
          {error && (
            <div className="flex items-start gap-3 bg-red-50 text-red-800 p-4 rounded-lg mb-4">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center justify-center flex-col text-center p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h3 className="text-xl font-bold text-kalaa-charcoal">
                Request Sent!
              </h3>
              <p className="text-gray-600">{success}</p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select an Available Date
                </label>
                <div className="flex justify-center">
                  <Calendar
                    onChange={setEventDate}
                    value={eventDate}
                    tileDisabled={isDateDisabled}
                    minDate={new Date()}
                    className="themed-calendar"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Message (Optional)
                </label>
                <textarea
                  id="message"
                  rows={4}
                  placeholder="Provide details about your event, like the occasion, venue, and expected audience size."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800 placeholder-gray-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};

export default BookingModal;
