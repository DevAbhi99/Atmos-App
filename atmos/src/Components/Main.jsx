
import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import './Main.css';
import Heading from "./Heading";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 37.7749, // Default latitude
  lng: -122.4194, // Default longitude
};

const API_KEY = "502894e3704721dd1fe07dd0767f88f6"; // Replace with your OpenWeatherMap API Key

function Main() {
  const [location, setLocation] = useState(center);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [weatherData, setWeatherData] = useState(null);

  // Fetch location data from backend
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get("http://localhost:4000/location")
        .then((response) => {
          const { lat, lng } = response.data;
          setLocation({ lat, lng });
        })
        .catch((error) => {
          console.error("Error fetching location:", error);
        });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch list of areas on load
  useEffect(() => {
    axios.get("http://localhost:4000/areas")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });
  }, []);

  // Fetch weather data based on selected area
  useEffect(() => {
    if (selectedArea) {
      const selectedAreaDetails = areas.find((area) => area.area === selectedArea);
      if (selectedAreaDetails) {
        const { lat, lng } = selectedAreaDetails;

        // Fetch real-time weather data from OpenWeatherMap API
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`)
          .then((response) => {
            setWeatherData(response.data);
          })
          .catch((error) => {
            console.error("Error fetching weather data:", error);
          });
      } else {
        setWeatherData(null); 
      }
    } else {
      setWeatherData(null); 
    }
  }, [selectedArea, areas]);

  // Handle area selection
  const handleAreaChange = (event) => {
    const area = event.target.value;
    setSelectedArea(area);

    // Send selected area to backend to update location
    axios.post("http://localhost:4000/set-location", { area })
      .then((response) => {
        setLocation(response.data.currentLocation); // Update location on map
      })
      .catch((error) => {
        console.error("Error setting location:", error);
      });
  };

  return (
    <>
      <Heading />
      <div className="display_main">
        <div className="main_display_map">
          <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={location} zoom={12}>
              <Marker position={location} />
            </GoogleMap>
          </LoadScript>
        </div>

      </div>
    </>
  );
}

export default Main;
