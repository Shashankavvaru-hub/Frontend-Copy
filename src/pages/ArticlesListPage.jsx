import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Calendar, AlertTriangle } from "lucide-react";

// Assuming these components and the api config exist at these paths
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import api from "../api/axiosConfig";

const ArticlesListPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await api.get("/articles");
        setArticles(response.data);
      } catch (err) {
        setError("Failed to load articles. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []); // Dependency array is empty as api is a stable module import

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <EmptyState message={error} isError={true} />;
    if (articles.length === 0)
      return <EmptyState message="There are no articles to display yet." />;

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <Link
            key={article.id}
            to={`/articles/${article.id}`}
            className="group block bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100"
          >
            <div className="overflow-hidden h-48">
              <img
                src={
                  article.imageUrl ||
                  "https://placehold.co/600x400/gray/white?text=Kalaa+Setu"
                }
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-playfair text-2xl font-bold text-kalaa-charcoal mb-3 leading-tight">
                {article.title}
              </h3>
              <div className="flex items-center text-sm text-gray-500 gap-4 mt-4">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.authorName}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-kalaa-cream min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-kalaa-charcoal font-playfair mb-4">
            Our Articles
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the stories, history, and cultural significance of
            Telangana's vibrant folk arts.
          </p>
        </div>

        {/* Main Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ArticlesListPage;
