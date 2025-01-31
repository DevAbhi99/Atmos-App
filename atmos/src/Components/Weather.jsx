import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import './Main.css';
import './Weather.css';
import Heading from "./Heading";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 53.34,
  lng: -6.255,
};

const API_KEY = "502894e3704721dd1fe07dd0767f88f6"; 

function Weather() {
  const [location, setLocation] = useState(defaultCenter); 
  const [areas, setAreas] = useState([]); 
  const [selectedArea, setSelectedArea] = useState(""); 
  const [weatherData, setWeatherData] = useState(null); 

  useEffect(() => {
    axios.get("http://localhost:4000/areas")
      .then((response) => {
        setAreas(response.data);
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
      });
  }, []);

  const handleAreaChange = (event) => {
    const area = event.target.value;
    setSelectedArea(area);

    const selectedAreaDetails = areas.find((a) => a.area === area);

    if (selectedAreaDetails) {
      const { lat, lng } = selectedAreaDetails;
      setLocation({ lat, lng });

      axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`)
        .then((response) => {
          setWeatherData({
            ...response.data,
            areaName: area,
          });
        })
        .catch((error) => {
          console.error("Error fetching weather data:", error);
        });
    } else {
      setWeatherData(null);
      setLocation(defaultCenter);
    }
  };

  return (
    <>
      <Heading />
      
      <div className="display_results">
          <select id="selectdesign" value={selectedArea} onChange={handleAreaChange}>
            <option value="">Select an Area</option>
            {areas.map((area, index) => (
              <option key={index} value={area.area}>
                {area.area}
              </option>
            ))}
          </select>
        </div>

      <div className="display_main">
        <div className="display_map">
          <LoadScript googleMapsApiKey="AIzaSyBo-mXQolZZnHe2jxg1FDm8m-ViYP9_AaY">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={location}
              zoom={12}
            >
              {weatherData && (
                <>
                  <Marker position={location} />
                  <InfoWindow position={location}>
                    <div className="info-window">
                      <h3>Weather in {weatherData.areaName}</h3>
                      <p><strong>Temperature:</strong> {weatherData.main.temp} °C</p>
                      <p><strong>Weather:</strong> {weatherData.weather[0].description}</p>
                      <p><strong>Humidity:</strong> {weatherData.main.humidity} %</p>
                      <p><strong>Wind Speed:</strong> {weatherData.wind.speed} m/s</p>
                    </div>
                  </InfoWindow>
                </>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        
      </div>
    </>
  );
}

export default Weather;
