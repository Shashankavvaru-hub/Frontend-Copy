import React, { useState, useContext, createContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  Home,
  Newspaper,
  User,
  LogIn,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  Menu,
  X,
} from "lucide-react";

const Navbar = () => {
  const auth = useContext(AuthContext);
  const { token, logout, user } = auth || {};
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    if (logout) logout();
    navigate("/");
    setIsMobileMenuOpen(false); // Close menu on logout
  };

  const navLinkClass =
    "flex items-center gap-2 text-gray-600 hover:text-kalaa-orange font-semibold transition-colors px-3 py-2 rounded-md";
  const mobileNavLinkClass =
    "flex items-center gap-4 text-lg text-gray-700 hover:bg-kalaa-cream font-semibold p-4 rounded-lg";

  const renderNavLinks = (isMobile = false) => (
    <>
      <Link
        to="/"
        className={isMobile ? mobileNavLinkClass : navLinkClass}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Home className="w-5 h-5" /> Home
      </Link>
      <Link
        to="/articles"
        className={isMobile ? mobileNavLinkClass : navLinkClass}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <Newspaper className="w-5 h-5" /> Articles
      </Link>
      {token ? (
        <>
          {user && user.role === "ADMIN" && (
            <Link
              to="/admin"
              className={`${
                isMobile ? mobileNavLinkClass : navLinkClass
              } text-yellow-500 hover:text-yellow-600`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShieldCheck className="w-5 h-5" /> Admin
            </Link>
          )}
          <Link
            to="/dashboard"
            className={isMobile ? mobileNavLinkClass : navLinkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </Link>
          <Link
            to="/profile"
            className={isMobile ? mobileNavLinkClass : navLinkClass}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <User className="w-5 h-5" /> Profile
          </Link>
          <button
            onClick={handleLogout}
            className={`${
              isMobile ? mobileNavLinkClass : navLinkClass
            } text-red-500 hover:text-red-700 w-full text-left`}
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </>
      ) : (
        <Link
          to="/login"
          className={isMobile ? mobileNavLinkClass : navLinkClass}
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <LogIn className="w-5 h-5" /> Login
        </Link>
      )}
    </>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold font-playfair text-kalaa-orange"
          >
            Kalaa Setu
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {renderNavLinks()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-2 pb-4 space-y-2">{renderNavLinks(true)}</div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
