import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { User, Calendar, AlertTriangle, ArrowLeft } from "lucide-react";

// Correctly import your actual components and API config
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import api from "../api/axiosConfig";

const ArticleDetailPage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await api.get(`/articles/${id}`);
        setArticle(response.data);
      } catch (err) {
        setError(
          "Failed to load the article. It may have been moved or deleted."
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <EmptyState message={error} isError={true} />;
  if (!article)
    return (
      <EmptyState message="The article you are looking for could not be found." />
    );

  return (
    <div className="bg-kalaa-cream min-h-screen">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <article className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-kalaa-orange font-semibold transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Back to Articles
            </Link>
          </div>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="font-playfair text-4xl md:text-6xl font-bold text-kalaa-charcoal mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex flex-col sm:flex-row items-start sm:items-center text-gray-500 gap-x-6 gap-y-2">
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {article.authorName}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {new Date(article.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </header>

          {/* Hero Image */}
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg mb-12 border"
            />
          )}

          {/* Article Content */}
          <div
            className="prose prose-lg lg:prose-xl max-w-none prose-h2:font-playfair prose-h2:text-kalaa-charcoal prose-p:leading-relaxed prose-a:text-kalaa-orange hover:prose-a:text-kalaa-red"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
