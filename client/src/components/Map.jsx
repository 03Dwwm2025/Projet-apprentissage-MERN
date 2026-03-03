import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Marker.prototype.options.icon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function Map() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/record")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        style={{
          height: "500px",
          width: "50%",
          borderRadius: "16px",
          overflow: "hidden",
        }}
      >
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
