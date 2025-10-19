import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FileText,
  Image as ImageIcon,
  Save,
  AlertTriangle,
} from "lucide-react";

// Assuming SunEditor is installed and its CSS is imported globally in your main CSS/JS file
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

// Assuming these exist in your project
import api from "../api/axiosConfig";
import { showSuccessToast, showErrorToast } from "../utils/notifications";
import LoadingSpinner from "../components/LoadingSpinner";

const ArticleEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false); // For submission
  const [initialLoading, setInitialLoading] = useState(true); // For fetching existing article
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEditing) {
      const fetchArticle = async () => {
        setError("");
        try {
          const response = await api.get(`/articles/${id}`);
          setTitle(response.data.title);
          setContent(response.data.content);
          setImageUrl(response.data.imageUrl || "");
        } catch (err) {
          setError("Failed to load the article for editing.");
          console.error(err);
        } finally {
          setInitialLoading(false);
        }
      };
      fetchArticle();
    } else {
      setInitialLoading(false); // Not editing, so no initial load needed
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const articleData = { title, content, imageUrl };

    try {
      if (isEditing) {
        await api.put(`/admin/articles/${id}`, articleData);
        showSuccessToast("Article updated successfully!");
      } else {
        await api.post("/admin/articles", articleData);
        showSuccessToast("Article created successfully!");
      }
      navigate("/admin/articles");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        (isEditing ? "Failed to update article." : "Failed to create article.");
      showErrorToast(errorMessage);
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-kalaa-cream">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-4xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="font-playfair text-3xl md:text-4xl font-bold text-kalaa-charcoal flex items-center justify-center gap-3">
              <FileText className="w-8 h-8" />
              {isEditing ? "Edit Article" : "Create New Article"}
            </h1>
          </header>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 text-red-800 p-4 rounded-lg border border-red-200 mb-6">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Article Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800 text-lg font-semibold"
                required
              />
            </div>

            <div>
              <label
                htmlFor="imageUrl"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Header Image URL (Optional)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-kalaa-orange focus:bg-white transition-all text-gray-800"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Content
              </label>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-kalaa-orange transition-all">
                <SunEditor
                  setContents={content}
                  onChange={setContent}
                  height="300px"
                  setOptions={{
                    buttonList: [
                      ["undo", "redo"],
                      ["font", "fontSize", "formatBlock"],
                      ["bold", "underline", "italic", "strike"],
                      ["removeFormat"],
                      ["outdent", "indent"],
                      ["align", "horizontalRule", "list"],
                      ["link", "image", "table"],
                    ],
                  }}
                />
              </div>
            </div>

            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2 ml-auto"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {isEditing ? "Update Article" : "Publish Article"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditorPage;
