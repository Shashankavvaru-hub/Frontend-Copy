import React, { useState, useEffect } from "react";
import {
  Paintbrush,
  CheckCircle,
  ShieldAlert,
  UserCheck,
  UserX,
} from "lucide-react";

// Assuming these exist in your project
import api from "../api/axiosConfig";
import { showSuccessToast, showErrorToast } from "../utils/notifications";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const AdminArtistListPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null); // Tracks loading state for a specific button

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/artists");
      setArtists(response.data);
    } catch (error) {
      setError("Failed to fetch artists. You may not have permission.");
      console.error("Failed to fetch artists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const handleVerifyToggle = async (artistId, currentStatus) => {
    setActionLoading(artistId); // Set loading state for this specific artist's button
    try {
      // The endpoint name 'verify' suggests it's a toggle on the backend
      await api.put(`/admin/artists/${artistId}/verify`);
      showSuccessToast(
        `Artist has been ${currentStatus ? "un-verified" : "verified"}.`
      );
      // Optimistically update the UI before refetching for a faster feel
      setArtists((prevArtists) =>
        prevArtists.map((artist) =>
          artist.id === artistId
            ? { ...artist, active: !artist.active }
            : artist
        )
      );
      // fetchArtists(); // Optionally refetch for data consistency
    } catch (error) {
      showErrorToast("Failed to update verification status.");
      console.error(error);
    } finally {
      setActionLoading(null); // Clear loading state
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <EmptyState message={error} isError={true} />;

  return (
    <div className="min-h-screen bg-kalaa-cream">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <header className="mb-8 md:mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-kalaa-charcoal flex items-center gap-3">
            <Paintbrush className="w-10 h-10" /> Artist Management
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            The "Verified" status controls whether an artist appears in public
            search results.
          </p>
        </header>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {artists.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Artist
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Associated User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {artists.map((artist) => (
                    <tr
                      key={artist.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-kalaa-charcoal">
                          {artist.artistName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {artist.artForm}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {artist.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {artist.userMobile}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {artist.active ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            <CheckCircle className="w-4 h-4 mr-1.5" /> Verified
                          </span>
                        ) : (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            <ShieldAlert className="w-4 h-4 mr-1.5" /> Not
                            Verified
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() =>
                            handleVerifyToggle(artist.id, artist.active)
                          }
                          disabled={actionLoading === artist.id}
                          className={`inline-flex items-center gap-2 font-semibold px-3 py-1.5 rounded-lg transition-colors text-xs disabled:opacity-50 disabled:cursor-wait ${
                            artist.active
                              ? "bg-red-100 hover:bg-red-200 text-red-700"
                              : "bg-green-100 hover:bg-green-200 text-green-700"
                          }`}
                        >
                          {actionLoading === artist.id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          ) : artist.active ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                          {artist.active ? "Un-verify" : "Verify"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState message="No artists have registered yet." />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminArtistListPage;
