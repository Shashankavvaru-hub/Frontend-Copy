import React from "react";
import { Twitter, Instagram, Facebook } from "lucide-react"; // Using lucide-react for icons

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "#" },
    { name: "Instagram", icon: Instagram, href: "#" },
    { name: "Twitter", icon: Twitter, href: "#" },
  ];

  return (
    <footer className="bg-kalaa-charcoal text-kalaa-cream">
      <div className="container mx-auto px-3 py-4 md:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-2">
          {/* Copyright and Brand */}
          <div className="mb-4 md:mb-0">
            <h3 className="font-playfair text-xl font-bold mb-0.5">
              Kalaa Setu
            </h3>
            <p className="text-xs text-black">
              &copy; {currentYear} Kalaa Setu. Connecting Artists and Audiences
              in India.
            </p>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center space-x-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                aria-label={`Visit our ${link.name} page`}
                className="text-black hover:text-kalaa-orange transition-colors"
              >
                <link.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
