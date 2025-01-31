import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  InfoWindow,
} from "@react-google-maps/api";
import './Main.css';
import './Bikestations.css';
import Heading from "./Heading";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./Firebase";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const API_KEY = "AIzaSyBo-mXQolZZnHe2jxg1FDm8m-ViYP9_AaY";

function Bikestations() {
  const [location, setLocation] = useState({ lat: 53.34, lng: -6.255 });
  const [bikeStations, setBikeStations] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [clickedStation, setClickedStation] = useState(null); // Track clicked station
  const [directions, setDirections] = useState([]);

  // Fetch bike stations and user location
  useEffect(() => {
    const fetchBikeStations = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "dublinbikesdata"));
        const stations = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBikeStations(stations);
      } catch (error) {
        console.error("Error fetching bike stations:", error);
      }
    };

    fetchBikeStations();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error fetching current location:", error),
        { enableHighAccuracy: true }
      );
    }
  }, []);

  // Calculate routes from current position to bike stations
  useEffect(() => {
    if (currentPosition && bikeStations.length > 0) {
      const directionsService = new window.google.maps.DirectionsService();
      bikeStations.forEach((station) => {
        directionsService.route(
          {
            origin: currentPosition,
            destination: { lat: station.Latitude, lng: station.Longitude },
            travelMode: window.google.maps.TravelMode.WALKING,
          },
          (result, status) => {
            if (status === "OK") {
              setDirections((prevDirections) => [...prevDirections, result]);
            } else {
              console.error(`Error fetching directions: ${status}`);
            }
          }
        );
      });
    }
  }, [currentPosition, bikeStations]);

  // Click event handler for markers
  const handleMarkerClick = (station) => {
    setClickedStation(station); // Set clicked station
  };

  return (
    <>
      <Heading />
      <div className="bike_display_main">
        <div className="display_map_bike">
          <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={location} zoom={12}>
              {/* Marker for current location */}
              {currentPosition && (
                <Marker
                  position={currentPosition}
                  icon={{
                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Green marker
                  }}
                  title="You are here"
                />
              )}

              {/* Markers for bike stations */}
              {bikeStations.map((station) => (
                <Marker
                  key={station.id}
                  position={{
                    lat: parseFloat(station.Latitude),
                    lng: parseFloat(station.Longitude),
                  }}
                  onClick={() => handleMarkerClick(station)} // Click to show info
                  title={`Available Bikes: ${station.Available}, Total Stands: ${station.BikeStand}, Status: ${station.Status}`}
                />
              ))}

              {/* Clicked station details */}
              {clickedStation && (
                <InfoWindow
                  position={{
                    lat: parseFloat(clickedStation.Latitude),
                    lng: parseFloat(clickedStation.Longitude),
                  }}
                  onCloseClick={() => setClickedStation(null)} // Close InfoWindow
                >
                  <div className="info_window_content">
                    <h3>{clickedStation.AreaName}</h3>
                    <p><strong>Available Bikes:</strong> {clickedStation.Available}</p>
                    <p><strong>Total Stands:</strong> {clickedStation.BikeStand}</p>
                    <p><strong>Status:</strong> {clickedStation.Status}</p>
                  </div>
                </InfoWindow>
              )}

              {/* Render routes from current location to each bike station */}
              {directions.map((direction, index) => (
                <DirectionsRenderer
                  key={index}
                  directions={direction}
                  options={{
                    polylineOptions: {
                      strokeColor: "#00008b", // Blue for visibility
                      strokeOpacity: 0.8,
                      strokeWeight: 4,
                    },
                    suppressMarkers: true, // Suppress default A and B markers
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </>
  );
}

export default Bikestations;
