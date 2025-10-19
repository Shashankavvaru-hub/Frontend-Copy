import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// This code creates a new default icon object with the correct image paths
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41], // This helps position the icon correctly
});

// This line tells Leaflet to use our new, corrected icon for all markers
L.Marker.prototype.options.icon = DefaultIcon;