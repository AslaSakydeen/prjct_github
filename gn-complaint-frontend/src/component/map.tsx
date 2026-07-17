import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export interface Location {
  lat: number;
  lng: number;
}

interface LocationSelectorProps {
  setLocation: (location: Location) => void;
}

interface MapPickerProps {
  setLocation: (location: Location) => void;
}

const LocationSelector = ({ setLocation }: LocationSelectorProps) => {
  useMapEvents({
    click(e: L.LeafletMouseEvent) {
      setLocation({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
};

const MapPicker = ({ setLocation }: MapPickerProps) => {
  const [position, setPosition] = useState<Location | null>(null);

  return (
    <div>
      <MapContainer
        center={[6.9271, 79.8612]}
        zoom={12}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocationSelector
          setLocation={(loc) => {
            setPosition(loc);
            setLocation(loc);
          }}
        />

        {position && (
          <Marker position={[position.lat, position.lng]} />
        )}
      </MapContainer>

      {position && (
        <p>
          Selected Location: {position.lat}, {position.lng}
        </p>
      )}
    </div>
  );
};

export default MapPicker;