import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// 아이콘 설정 (기본 아이콘과 다를 경우 필요)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Main = () => {
  const [position, setPosition] = useState(null);
  const [previousPosition, setPreviousPosition] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = [latitude, longitude];

          if (previousPosition) {
            const distance = calculateDistance(
              previousPosition[0],
              previousPosition[1],
              latitude,
              longitude
            );

            if (distance > 0.1) return; // 큰 변화 무시
          }

          setPreviousPosition(newPosition);
          setPosition(newPosition);
        },
        (error) => {
          console.error(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [previousPosition]);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 지구 반지름(km)
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;

    return R * 2 * Math.asin(Math.sqrt(a));
  }

  const MapUpdater = () => {
    const map = useMap();
    useEffect(() => {
      if (position) {
        map.setView(position, map.getZoom());
      }
    }, [position, map]);
    return null;
  };

  return (
    <div style={{ width: "100vw", height: "100vh", paddingTop: "50px" }}>
      {position ? (
        <MapContainer
          center={position}
          zoom={17}
          style={{
            height: "100vh",
            width: "100%",
            zIndex: -1,
            position: "relative",
          }} // z-index를 0으로 변경
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />
          <Marker position={position}>
            <Popup>You are here</Popup>
          </Marker>
          <MapUpdater />
        </MapContainer>
      ) : (
        <p>Loading location...</p>
      )}
    </div>
  );
};

export default Main;
