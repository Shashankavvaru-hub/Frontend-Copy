import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CheckCircle } from "lucide-react";

const ArtistCard = ({ artist }) => {
  const placeholderImage = "https://i.imgur.com/8b2hUoE.jpeg";

  return (
    <Link
      to={`/artists/${artist.id}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden"
    >
      <div className="relative overflow-hidden h-56">
        <img
          src={artist.profilePictureUrl || placeholderImage}
          alt={artist.artistName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {artist.verified && (
          <div className="absolute top-3 right-3 bg-kalaa-amber/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
            <CheckCircle className="w-4 h-4" />
            Verified
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <h3 className="text-white text-2xl font-bold font-playfair">
            {artist.artistName}
          </h3>
          <p className="text-kalaa-amber font-semibold">{artist.artForm}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-gray-600">
          <MapPin className="w-4 h-4 mr-2 text-gray-400" />
          <span className="text-sm font-medium">{artist.location}</span>
        </div>
        {artist.shortBio && (
          <p className="mt-2 text-sm text-gray-600 break-words whitespace-normal">
            {artist.shortBio}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ArtistCard;
