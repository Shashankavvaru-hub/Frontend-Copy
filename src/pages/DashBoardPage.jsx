import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  User,
  Banknote,
  CalendarDays,
  X,
  Star,
  CheckCircle,
  Info,
  AlertTriangle,
  CreditCard,
  Edit,
  Eye,
} from "lucide-react";

// Assuming these exist in your project as per your instructions
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { showSuccessToast, showErrorToast } from "../utils/notifications";
import ReviewModal from "../components/ReviewModal";

// --- A custom hook to safely load the Razorpay script ---
const useRazorpay = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    // Check if the script is already present to avoid duplicates
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      setIsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      setIsLoaded(false);
      console.error("Razorpay SDK failed to load.");
    };
    document.body.appendChild(script);
    return () => {
      // Check if the script exists before trying to remove it
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);
  return isLoaded;
};

const DashboardPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookingToReview, setBookingToReview] = useState(null);

  const fetchBookings = async () => {
    if (!user) return;
    const endpoint = user.artist ? "/bookings/artist/me" : "/bookings/user/me";
    try {
      setLoading(true);
      const response = await api.get(endpoint);
      setBookings(response.data);
    } catch (err) {
      setError("Failed to fetch bookings.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleUpdateBooking = async (bookingId, action) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/${action}`);
      setBookings((currentBookings) =>
        currentBookings.map((b) =>
          b.id === bookingId ? { ...b, status: response.data.status } : b
        )
      );
      setSelectedBooking(null);
      showSuccessToast(`Booking has been ${action}ed.`);
    } catch (err) {
      showErrorToast(`Error: Could not ${action} the booking.`);
      console.error(`Failed to ${action} booking`, err);
    }
  };

  const onPaymentSuccess = () => fetchBookings();
  const handleReviewSubmit = () => fetchBookings();

  if (loading) return <LoadingSpinner />;
  if (error) return <EmptyState message={error} isError={true} />;

  return (
    <div className="bg-kalaa-cream min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {user && user.artist ? (
          <ArtistDashboard
            bookings={bookings}
            onViewDetails={setSelectedBooking}
          />
        ) : (
          <UserDashboard
            bookings={bookings}
            onPaymentSuccess={onPaymentSuccess}
            onLeaveReview={setBookingToReview}
          />
        )}

        {selectedBooking && (
          <BookingDetailModal
            booking={selectedBooking}
            onClose={() => setSelectedBooking(null)}
            onUpdateBooking={handleUpdateBooking}
          />
        )}
        {bookingToReview && (
          <ReviewModal
            show={true}
            handleClose={() => setBookingToReview(null)}
            booking={bookingToReview}
            onReviewSubmit={handleReviewSubmit}
          />
        )}
      </div>
    </div>
  );
};

const ArtistDashboard = ({ bookings, onViewDetails }) => {
  const quickLinks = [
    { name: "Manage Portfolio", to: "/dashboard/portfolio", icon: Briefcase },
    { name: "Edit Profile", to: "/dashboard/edit-profile", icon: User },
    { name: "Payout Details", to: "/dashboard/bank-details", icon: Banknote },
    {
      name: "Manage Availability",
      to: "/dashboard/availability",
      icon: CalendarDays,
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-kalaa-charcoal">
          Artist Dashboard
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Manage your profile, bookings, and availability.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:border-kalaa-orange transition-all text-center group"
          >
            <link.icon className="w-10 h-10 mx-auto text-kalaa-orange mb-3 transition-transform group-hover:scale-110" />
            <span className="font-semibold text-kalaa-charcoal">
              {link.name}
            </span>
          </Link>
        ))}
      </section>

      <section className="bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="p-6 border-b">
          <h2 className="font-playfair text-2xl font-bold text-kalaa-charcoal">
            Incoming Booking Requests
          </h2>
        </div>
        {bookings.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="p-6 flex flex-wrap items-center justify-between gap-4"
              >
                <div
                  className={`flex-grow ${
                    booking.status === "rejected"
                      ? "text-gray-400 line-through"
                      : ""
                  }`}
                >
                  <p className="font-semibold text-kalaa-charcoal">
                    {booking.user.fullName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Event Date:{" "}
                    {new Date(booking.eventDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <StatusBadge status={booking.status} />
                  <button
                    onClick={() => onViewDetails(booking)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" /> View Details
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-6">
            <EmptyState message="You have no incoming booking requests yet." />
          </div>
        )}
      </section>
    </div>
  );
};

const PayNowButton = ({ booking, onPaymentSuccess }) => {
  const { user } = useContext(AuthContext);
  const isRazorpayLoaded = useRazorpay();

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      showErrorToast("Payment gateway is loading. Please try again.");
      return;
    }
    try {
      const { data: order } = await api.post("/payments/create-order", {
        bookingId: booking.id,
        amount: 10000 * 100,
      });
      const options = {
        key: "rzp_test_RCKpjwH511FtKt",
        amount: order.amount,
        currency: order.currency,
        name: "Kalaa Setu Booking",
        description: `Payment for ${booking.artist.artistName}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            const verificationData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: booking.id,
            };
            await api.post("/payments/verify", verificationData);
            showSuccessToast("Payment successful!");
            onPaymentSuccess();
          } catch (verifyError) {
            showErrorToast("Payment verification failed.");
            console.error(verifyError);
          }
        },
        prefill: {
          name: user.fullName,
          email: user.email,
          contact: user.mobileNumber,
        },
        theme: { color: "#D84315" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showErrorToast("Failed to create payment order.");
      console.error(err);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={!isRazorpayLoaded}
      className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-wait flex items-center gap-2"
    >
      <CreditCard className="w-4 h-4" />
      {isRazorpayLoaded ? "Pay Now" : "Loading..."}
    </button>
  );
};

const UserDashboard = ({ bookings, onPaymentSuccess, onLeaveReview }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-kalaa-charcoal">
          My Bookings
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          View your booking history and manage payments.
        </p>
      </header>

      <section className="bg-white rounded-2xl shadow-md border border-gray-200">
        <div className="p-6 border-b">
          <h2 className="font-playfair text-2xl font-bold text-kalaa-charcoal">
            Booking History
          </h2>
        </div>
        {bookings.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {bookings.map((booking) => {
              const eventDate = new Date(booking.eventDate);
              eventDate.setHours(0, 0, 0, 0);
              const isReviewable =
                booking.status === "accepted" &&
                booking.paymentStatus === "completed" &&
                eventDate <= today &&
                !booking.review;

              return (
                <li
                  key={booking.id}
                  className="p-6 flex flex-wrap items-center justify-between gap-4"
                >
                  <div className="flex-grow">
                    <p className="font-semibold text-kalaa-charcoal">
                      For {booking.artist.artistName}
                    </p>
                    <p className="text-sm text-gray-500">
                      Event Date: {eventDate.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <StatusBadge status={booking.status} />
                    {isReviewable && (
                      <button
                        onClick={() => onLeaveReview(booking)}
                        className="bg-kalaa-amber hover:bg-kalaa-amber/80 text-white font-bold px-4 py-2 rounded-lg transition-colors text-sm flex items-center gap-2"
                      >
                        <Star className="w-4 h-4" /> Leave a Review
                      </button>
                    )}
                    {booking.status === "accepted" &&
                      booking.paymentStatus === "pending" && (
                        <PayNowButton
                          booking={booking}
                          onPaymentSuccess={onPaymentSuccess}
                        />
                      )}
                    {booking.paymentStatus === "completed" && !isReviewable && (
                      <span className="flex items-center gap-2 text-sm font-semibold text-green-600">
                        <CheckCircle className="w-4 h-4" /> Paid
                      </span>
                    )}
                    {booking.review && (
                      <span className="flex items-center gap-2 text-sm font-semibold text-blue-600">
                        <Edit className="w-4 h-4" /> Reviewed
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="p-6">
            <EmptyState message="You haven't made any bookings yet." />
          </div>
        )}
      </section>

      <section className="bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-center">
        <h2 className="font-playfair text-2xl font-bold text-kalaa-charcoal mb-2">
          Ready to Share Your Talent?
        </h2>
        <p className="text-gray-600 mb-4">
          Join our community of artists and showcase your skills.
        </p>
        <Link
          to="/become-artist"
          className="inline-block bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          Become an Artist
        </Link>
      </section>
    </div>
  );
};

const BookingDetailModal = ({ booking, onClose, onUpdateBooking }) => {
  return (
    <div className="fixed inset-0 bg-kalaa-cream/60 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto"
        role="dialog"
        aria-modal="true"
      >
        <header className="p-6 flex items-center justify-between border-b">
          <h2 className="font-playfair text-2xl font-bold text-kalaa-charcoal">
            Booking Request
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </header>
        <main className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-1">
              Requester Details
            </h3>
            <p>
              <strong>Name:</strong> {booking.user.fullName}
            </p>
            <p>
              <strong>Contact:</strong> {booking.user.mobileNumber}
            </p>
          </div>
          <hr />
          <div>
            <h3 className="font-semibold text-gray-500 text-sm uppercase tracking-wider mb-1">
              Event Details
            </h3>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(booking.eventDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Description:</strong> {booking.eventDescription}
            </p>
          </div>
        </main>
        <footer className="p-6 bg-gray-50 rounded-b-2xl flex justify-end items-center gap-4">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Close
          </button>
          {booking.status === "pending" && (
            <>
              <button
                onClick={() => onUpdateBooking(booking.id, "reject")}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Reject
              </button>
              <button
                onClick={() => onUpdateBooking(booking.id, "accept")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Accept
              </button>
            </>
          )}
        </footer>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-green-100 text-green-800",
    default: "bg-gray-100 text-gray-800",
  };
  const style = styles[status] || styles.default;
  const Icon =
    {
      pending: Info,
      accepted: CheckCircle,
      rejected: X,
      completed: CheckCircle,
    }[status] || AlertTriangle;

  return (
    <span
      className={`px-3 py-1 text-sm font-semibold rounded-full capitalize flex items-center gap-2 ${style}`}
    >
      <Icon className="w-4 h-4" />
      {status}
    </span>
  );
};

export default DashboardPage;
