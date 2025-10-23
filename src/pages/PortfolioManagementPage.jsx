import React, { useState, useEffect, useContext, useCallback } from "react";
import { FireworksBackground } from "../components/ui/fireworks-background";
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
  const [previewMedia, setPreviewMedia] = useState(null);
  const [celebrate, setCelebrate] = useState(false);

  // State for delete confirmation
  const [itemToDelete, setItemToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1500);
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
    setDeleting(true);
    try {
      await api.delete(`/artists/portfolio/${itemToDelete.id}`);
      showSuccessToast("Media deleted successfully!");
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 1200);
      setItemToDelete(null); // Close modal
      await fetchPortfolio(); // Refresh portfolio
      if (refreshUser) await refreshUser();
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Failed to delete media.";
      showErrorToast(msg);
      console.error("Delete media error:", err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      {celebrate && (
        <div className="fixed inset-0 z-[2500] pointer-events-none">
          <FireworksBackground
            className="size-full"
            population={3}
            color={["#ff4d4f", "#52c41a", "#1677ff", "#faad14"]}
            fireworkSpeed={{ min: 4, max: 8 }}
            particleSize={{ min: 2, max: 6 }}
          />
        </div>
      )}
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
                    className="relative rounded-2xl overflow-hidden shadow-md border group aspect-w-1 aspect-h-1 bg-gray-100 cursor-zoom-in"
                    onClick={() => setPreviewMedia(media)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPreviewMedia(media); } }}
                  >
                    <img
                      src={media.mediaUrl}
                      alt="Portfolio item"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 md:bg-black/0 md:group-hover:bg-black/60 transition-all flex flex-col items-center justify-center space-y-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 p-2 pointer-events-auto md:pointer-events-none">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSetProfilePic(media.id); }}
                        className="flex items-center gap-2 text-white bg-black/50 hover:bg-black/80 px-3 py-1.5 text-xs rounded-full transition-colors pointer-events-auto"
                      >
                        <UserCircle2 className="w-4 h-4" /> Set as Profile Pic
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

      {/* Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-[3000] bg-black/80 flex items-center justify-center p-4" onClick={() => setPreviewMedia(null)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute -top-10 right-0 text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-sm"
              onClick={() => setPreviewMedia(null)}
            >
              Close
            </button>
            <img src={previewMedia.mediaUrl} alt="Preview" className="w-full h-auto rounded-lg shadow-2xl" />
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
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
                disabled={deleting}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioManagementPage;
