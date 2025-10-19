import React from "react";
import { Link } from "react-router-dom";
import { Users, Paintbrush, FileText, Banknote } from "lucide-react";

const AdminDashboardPage = () => {
  // Array to hold dashboard navigation items for easier mapping and scalability
  const adminLinks = [
    {
      to: "/admin/users",
      title: "User Management",
      description: "View and manage all registered users.",
      icon: Users,
      color: "text-blue-500",
    },
    {
      to: "/admin/artists",
      title: "Artist Management",
      description: "View, verify, and manage all artists.",
      icon: Paintbrush,
      color: "text-kalaa-orange",
    },
    {
      to: "/admin/articles",
      title: "Article Management",
      description: "Create, edit, and publish articles.",
      icon: FileText,
      color: "text-green-500",
    },
    {
      to: "/admin/payouts",
      title: "Payout Management",
      description: "View pending payouts and pay artists.",
      icon: Banknote,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-kalaa-cream">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-kalaa-charcoal">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Manage users, artists, and platform settings.
          </p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {adminLinks.map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl hover:border-kalaa-orange transition-all duration-300 text-center group flex flex-col items-center justify-center text-decoration-none"
            >
              <item.icon
                className={`w-12 h-12 mb-4 transition-transform duration-300 group-hover:scale-110 ${item.color}`}
                strokeWidth={1.5}
              />
              <h2 className="font-playfair text-xl font-bold text-kalaa-charcoal mb-2">
                {item.title}
              </h2>
              <p className="text-gray-500 text-sm">{item.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
