import React, { useState, useEffect, useContext, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Briefcase,
  UploadCloud,
  X,
  AlertTriangle,
  CheckCircle,
  Trash2,
  UserCircle2,
} from "lucide-react";

// Assuming these exist in your project
import { AuthContext } from "../context/AuthContext";
import api from "../api/axiosConfig";
import { showSuccessToast, showErrorToast } from "../utils/notifications";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const PortfolioManagementPage = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // State for delete confirmation
  const [itemToDelete, setItemToDelete] = useState(null);

  const { user, refreshUser } = useContext(AuthContext);

  const fetchPortfolio = useCallback(async () => {
    if (!user || !user.artist) return;
    setLoading(true);
    try {
      const response = await api.get(`/artists/${user.artist.id}`);
      setPortfolio(response.data.portfolio || []);
    } catch (err) {
      setError("Failed to fetch your portfolio.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles((prev) => [...prev, ...acceptedFiles]);
    setError("");
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [], "video/*": [] },
  });

  const removeFile = (file) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== file));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      showErrorToast("Please select files to upload.");
      return;
    }
    setUploading(true);
    setError("");
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      await api.post("/artists/portfolio/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showSuccessToast("Files uploaded successfully!");
      setSelectedFiles([]); // Clear selected files
      await fetchPortfolio(); // Refresh portfolio
      if (refreshUser) await refreshUser();
    } catch (err) {
      showErrorToast(
        "File upload failed. Please check the file types and sizes."
      );
      setError("File upload failed. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleSetProfilePic = async (mediaId) => {
    try {
      await api.put("/artists/profile-picture", { mediaId });
      showSuccessToast("Profile picture updated successfully!");
      if (refreshUser) await refreshUser();
    } catch (err) {
      showErrorToast("Failed to set profile picture.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.delete(`/artists/portfolio/${itemToDelete.id}`);
      showSuccessToast("Media deleted successfully!");
      setItemToDelete(null); // Close modal
      await fetchPortfolio(); // Refresh portfolio
      if (refreshUser) await refreshUser();
    } catch (err) {
      showErrorToast("Failed to delete media.");
      console.error(err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="min-h-screen bg-kalaa-cream">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="mb-8 md:mb-12">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-kalaa-charcoal flex items-center gap-3">
              <Briefcase className="w-10 h-10" /> Manage Portfolio
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Upload images and videos to showcase your talent.
            </p>
          </header>

          {/* Uploader Section */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8">
            <h2 className="font-playfair text-2xl font-bold text-kalaa-charcoal mb-4">
              Upload New Media
            </h2>
            {error && (
              <div className="flex items-start gap-3 bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 mb-4">
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            <div
              {...getRootProps()}
              className={`p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-kalaa-orange bg-kalaa-cream"
                  : "border-gray-300 hover:border-kalaa-orange hover:bg-gray-50"
              }`}
            >
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              {isDragActive ? (
                <p className="font-semibold text-kalaa-orange">
                  Drop the files here...
                </p>
              ) : (
                <p className="text-gray-600">
                  Drag & drop files here, or{" "}
                  <span className="font-semibold text-kalaa-orange">
                    click to select
                  </span>
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Images (JPG, PNG) and Videos (MP4) supported.
              </p>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-kalaa-charcoal mb-2">
                  Selected Files:
                </h3>
                <ul className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-100 p-2 rounded-lg text-sm"
                    >
                      <span className="truncate text-gray-700">
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(file)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full mt-4 bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    `Upload ${selectedFiles.length} File(s)`
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Current Portfolio Section */}
          <div>
            <h2 className="font-playfair text-2xl font-bold text-kalaa-charcoal mb-4">
              Your Current Portfolio
            </h2>
            {portfolio.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {portfolio.map((media) => (
                  <div
                    key={media.id}
                    className="relative rounded-2xl overflow-hidden shadow-md border group aspect-w-1 aspect-h-1 bg-gray-100"
                  >
                    <img
                      src={media.mediaUrl}
                      alt="Portfolio item"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex flex-col items-center justify-center space-y-2 opacity-0 group-hover:opacity-100 p-2">
                      <button
                        onClick={() => handleSetProfilePic(media.id)}
                        className="flex items-center gap-2 text-white bg-black bg-opacity-50 hover:bg-opacity-80 px-3 py-1.5 text-xs rounded-full transition-colors"
                      >
                        <UserCircle2 className="w-4 h-4" /> Set as Profile Pic
                      </button>
                      <button
                        onClick={() => setItemToDelete(media)}
                        className="flex items-center gap-2 text-white bg-red-500 bg-opacity-80 hover:bg-opacity-100 px-3 py-1.5 text-xs rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Your portfolio is empty. Upload some media to get started!" />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto transform transition-all">
            <div className="p-6 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="font-playfair text-2xl font-bold text-kalaa-charcoal">
                Are you sure?
              </h3>
              <p className="text-gray-600 mt-2">
                Do you really want to permanently delete this media? This action
                cannot be undone.
              </p>
            </div>
            <footer className="p-4 bg-gray-50 rounded-b-2xl flex justify-end items-center gap-4">
              <button
                onClick={() => setItemToDelete(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Delete
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioManagementPage;
