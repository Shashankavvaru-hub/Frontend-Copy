import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";



// Center of Hyderabad, Telangana
const center = [17.385, 78.4867];

const ART_FORM_COLORS = {
  BURRAKATHA: { color: "#D84315", label: "Burrakatha" },
  BHARATANATYAM: { color: "#283593", label: "Bharatanatyam" },
  PUPPETRY: { color: "#FFA000", label: "Tholu Bommalata" },
  OTHER: { color: "#10B981", label: "Other Art Forms" },
  CLUSTER: "#6D28D9",
};

const getCategoryAbbrev = (artForm) => {
  const s = artForm.toLowerCase();
  if (s.includes("burrakatha")) return "Bk";
  if (s.includes("bharathanatyam") || s.includes("dance")) return "Bn";
  if (s.includes("tholu bommalata") || s.includes("puppetry")) return "Pu";
  return "Ot";
};

const getMarkerColor = (artForm) => {
  const lower = artForm.toLowerCase();
  if (lower.includes("burrakatha")) return ART_FORM_COLORS.BURRAKATHA.color;
  if (lower.includes("bharathanatyam") || lower.includes("dance"))
    return ART_FORM_COLORS.BHARATANATYAM.color;
  if (lower.includes("tholu bommalata") || lower.includes("puppetry"))
    return ART_FORM_COLORS.PUPPETRY.color;
  return ART_FORM_COLORS.OTHER.color;
};

// Professional circular pin with subtle pointer and shadow
const createPinIcon = (color, label) => {
  const markerHtml = `
    <div class="group relative">
      <div class="w-7 h-7 rounded-full ring-2 ring-white shadow-md transition-transform duration-150 group-hover:scale-110 flex items-center justify-center text-white text-[10px] font-bold" style="background:${color}">${label}</div>
      <div class="absolute left-1/2 top-7 -translate-x-1/2 w-2 h-2 bg-white rotate-45 shadow" style="background:${color}; box-shadow: 0 1px 2px rgba(0,0,0,0.25);"></div>
    </div>
  `;
  return new L.DivIcon({
    html: markerHtml,
    className: "kalaa-pin-icon",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
  });
};

// Zoom-on-click marker wrapper (for clusters or grouped points)
const ZoomMarker = ({ position, icon, zoomDelta = 2, children }) => {
  const map = useMap();
  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: () => {
          const current = map.getZoom();
          map.setView(position, Math.min(current + zoomDelta, map.getMaxZoom?.() || 18));
        },
      }}
    >
      {children}
    </Marker>
  );
};

const createClusterIcon = (count) => {
  return new L.DivIcon({
    html: `
      <div class="relative">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg"
             style="background: radial-gradient(100% 100% at 50% 0%, #7C3AED 0%, #5B21B6 100%); border:2px solid #fff;">
          ${count}
        </div>
        <div class="absolute left-1/2 top-10 -translate-x-1/2 w-2 h-2 rotate-45" style="background:#5B21B6; box-shadow: 0 1px 2px rgba(0,0,0,0.25);"></div>
      </div>
    `,
    className: "kalaa-cluster-icon",
    iconSize: [40, 48],
    iconAnchor: [20, 48],
  });
};

const MapLegend = () => (
  <div className="absolute top-3 right-3 z-[1000] bg-white p-3 rounded-lg shadow-lg border text-sm">
    <h6 className="font-bold mb-2">Legend</h6>
    <ul className="space-y-2">
      {Object.values(ART_FORM_COLORS)
        .filter((item) => item.label)
        .map((item) => (
          <li key={item.label} className="flex items-center">
            <span className="relative mr-2 inline-block" style={{ width: 24, height: 24 }}>
              <span
                className="w-5 h-5 rounded-full ring-2 ring-white shadow flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: item.color, display: 'inline-flex' }}
              >
                {getCategoryAbbrev(item.label)}
              </span>
              <span
                className="absolute left-1/2 top-5 -translate-x-1/2 w-1.5 h-1.5 rotate-45"
                style={{ backgroundColor: item.color, boxShadow: '0 1px 2px rgba(0,0,0,0.25)' }}
              />
            </span>
            <span>{item.label}</span>
          </li>
        ))}
      <li className="flex items-center">
        <span className="relative mr-2 inline-block" style={{ width: 24, height: 24 }}>
          <span
            className="w-5 h-5 rounded-full ring-2 ring-white shadow flex items-center justify-center text-[10px] font-bold text-white"
            style={{ background: 'radial-gradient(100% 100% at 50% 0%, #7C3AED 0%, #5B21B6 100%)', display: 'inline-flex' }}
          >
            Cl
          </span>
          <span
            className="absolute left-1/2 top-5 -translate-x-1/2 w-1.5 h-1.5 rotate-45"
            style={{ backgroundColor: '#5B21B6', boxShadow: '0 1px 2px rgba(0,0,0,0.25)' }}
          />
        </span>
        <span>Multiple Artists</span>
      </li>
    </ul>
  </div>
);

const MapComponent = ({ artists }) => {
  const artistsWithCoords = artists.filter(
    (artist) => artist.latitude != null && artist.longitude != null
  );

  const artistGroups = artistsWithCoords.reduce((groups, artist) => {
    const key = `${artist.latitude},${artist.longitude}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(artist);
    return groups;
  }, {});

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg border">
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "60vh", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {Object.values(artistGroups).map((group, index) => {
          const position = [group[0].latitude, group[0].longitude];

          if (group.length === 1) {
            const artist = group[0];
            const color = getMarkerColor(artist.artForm);
            const abbrev = getCategoryAbbrev(artist.artForm);
            return (
              <Marker
                key={artist.id}
                position={position}
                icon={createPinIcon(color, abbrev)}
              >
                <Tooltip direction="top" offset={[0, -20]} opacity={0.9}>
                  <div className="text-sm font-semibold">{artist.artistName}</div>
                  <div className="text-xs text-gray-600">{artist.artForm}</div>
                </Tooltip>
                <Popup>
                  <strong className="font-playfair text-lg">
                    {artist.artistName}
                  </strong>
                  <br />
                  {artist.artForm}
                  <br />
                  <Link
                    to={`/artists/${artist.id}`}
                    className="text-kalaa-orange font-semibold"
                  >
                    View Profile
                  </Link>
                </Popup>
              </Marker>
            );
          }

          return (
            <ZoomMarker
              key={`cluster-${index}`}
              position={position}
              icon={createClusterIcon(group.length)}
            >
              <Tooltip direction="top" opacity={0.9}>
                <div className="text-sm font-semibold">{group.length} artists here</div>
                <div className="text-xs text-gray-600">Click to zoom in</div>
              </Tooltip>
              <Popup>
                <strong className="font-semibold">
                  {group.length} Artists at this Location
                </strong>
                <ul className="list-none mt-2 mb-0 p-0 space-y-1">
                  {group.map((artist) => (
                    <li key={artist.id}>
                      <Link
                        to={`/artists/${artist.id}`}
                        className="text-kalaa-orange"
                      >
                        {artist.artistName}
                      </Link>{" "}
                      -{" "}
                      <small className="text-gray-500">{artist.artForm}</small>
                    </li>
                  ))}
                </ul>
              </Popup>
            </ZoomMarker>
          );
        })}
      </MapContainer>
      <MapLegend />
    </div>
  );
};

export default MapComponent;
