import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center[0] && center[1]) {
      map.setView(center, 10);
    }
  }, [center]);
  return null;
}

export default function Map({
  height = "500px",
  width = "50%",
  id = null,
  onSelectAddress = null,
}) {
  const [employees, setEmployees] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const url = id
      ? `http://localhost:5050/record/${id}`
      : "http://localhost:5050/record";

    fetch(url)
      .then((res) => res.json())
      .then((data) => setEmployees(id ? [data] : data))
      .catch((err) => console.error(err));
  }, [id]);

  async function handleSearch(e) {
    const value = e.target.value;
    setSearch(value);
    if (value.length < 3) return setSuggestions([]);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&limit=5`,
      { headers: { "Accept-Language": "fr" } }, // résultats en français
    );
    const data = await res.json();
setSuggestions(data.filter((s) => s.display_name));
  }

  function handleSelect(suggestion) {
    setSearch(suggestion.display_name);
    setSuggestions([]);
    if (onSelectAddress) {
      onSelectAddress({
        street: suggestion.display_name,
        city: suggestion.address?.city || suggestion.address?.town || "",
        country: suggestion.address?.country || "",
        coordinates: {
          lat: parseFloat(suggestion.lat),
          lng: parseFloat(suggestion.lon),
        },
      });
    }
  }

  const center = employees[0]?.address?.coordinates
    ? [
        employees[0].address.coordinates.lat,
        employees[0].address.coordinates.lng,
      ]
    : [20, 0];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {onSelectAddress && (
        <div style={{ position: "relative", width: width }}>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Rechercher une adresse..."
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              boxSizing: "border-box",
            }}
          />
          {suggestions.length > 0 && (
            <ul
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                listStyle: "none",
                margin: 0,
                padding: 0,
                zIndex: 1000,
              }}
            >
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  onClick={() => handleSelect(s)}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                  onMouseEnter={(e) => (e.target.style.background = "#f1f5f9")}
                  onMouseLeave={(e) => (e.target.style.background = "white")}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        style={{ height, width, borderRadius: "16px", overflow: "hidden" }}
      >
        <ChangeView center={center} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {employees.map((emp) => {
          const lat = emp.address?.coordinates?.lat;
          const lng = emp.address?.coordinates?.lng;
          if (!lat || !lng) return null;
          return (
            <Marker key={emp._id} position={[lat, lng]}>
              <Popup>
                <strong>
                  {emp.firstName} {emp.lastName}
                </strong>
                <br />
                {emp.address?.city}, {emp.address?.country}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
