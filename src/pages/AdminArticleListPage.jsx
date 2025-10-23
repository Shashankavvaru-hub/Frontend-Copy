import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FileText, Plus, Edit, Trash2, AlertTriangle, X } from "lucide-react";

// Assuming these exist in your project
import api from "../api/axiosConfig";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { showSuccessToast, showErrorToast } from "../utils/notifications";

// --- Internal Confirmation Modal Component ---
const DeleteConfirmationModal = ({ article, onConfirm, onCancel, loading }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto transform transition-all">
        <div className="p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="font-playfair text-2xl font-bold text-kalaa-charcoal">
            Are you sure?
          </h3>
          <p className="text-gray-600 mt-2">
            Do you really want to permanently delete the article titled "
            {article.title}"? This action cannot be undone.
          </p>
        </div>
        <footer className="p-4 bg-gray-50 rounded-b-2xl flex justify-end items-center gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
          >
            {loading ? "Deleting..." : "Delete Article"}
          </button>
        </footer>
      </div>
    </div>
  );
};

const AdminArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State for the delete confirmation modal
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get("/articles");
      setArticles(response.data);
    } catch (err) {
      setError("Failed to load articles.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
  };

  const confirmDelete = async () => {
    if (!articleToDelete) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/admin/articles/${articleToDelete.id}`);
      showSuccessToast("Article deleted successfully!");
      setArticleToDelete(null); // Close modal on success
      fetchArticles(); // Refresh the list
    } catch (err) {
      showErrorToast("Failed to delete article.");
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <EmptyState message={error} isError={true} />;

  return (
    <>
      <div className="min-h-screen bg-kalaa-cream">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <header className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 md:mb-12">
            <div>
              <h1 className="font-playfair text-4xl md:text-5xl font-bold text-kalaa-charcoal flex items-center gap-3">
                <FileText className="w-10 h-10" /> Article Management
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                Create, edit, and manage all articles on the platform.
              </p>
            </div>
            <Link
              to="/admin/articles/new"
              className="mt-4 md:mt-0 bg-kalaa-orange hover:bg-kalaa-red text-white font-bold py-3 px-6 rounded-full transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Create New Article
            </Link>
          </header>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {articles.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Title
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Author
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Updated
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => (
                      <tr
                        key={article.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-kalaa-charcoal">
                          {article.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {article.authorName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(article.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <Link
                            to={`/admin/articles/edit/${article.id}`}
                            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg transition-colors text-xs"
                          >
                            <Edit className="w-4 h-4" /> Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteClick(article)}
                            className="inline-flex items-center gap-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold px-3 py-1.5 rounded-lg transition-colors text-xs"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState message="No articles have been created yet." />
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        article={articleToDelete}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={() => setArticleToDelete(null)}
      />
    </>
  );
};

export default AdminArticleListPage;
