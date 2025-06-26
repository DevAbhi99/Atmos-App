import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import './Main.css';
import './AQI.css';
import Heading from "./Heading";
import axios from "axios";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

const API_KEY = process.env.REACT_APP_WEATHER_API; 
const google_api=process.env.REACT_APP_GOOGLE_API;

function AQI() {
  const [location, setLocation] = useState(defaultCenter); 
  const [areas, setAreas] = useState([]); 
  const [selectedArea, setSelectedArea] = useState(""); 
  const [aqData, setAqData] = useState(null); 

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

      axios.get(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${API_KEY}`)
        .then((response) => {
          setAqData({
            ...response.data,
            areaName: area,
          });
        })
        .catch((error) => {
          console.error("Error fetching air quality data:", error);
        });
    } else {
      setAqData(null);
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
          <LoadScript googleMapsApiKey={google_api}>
            <GoogleMap mapContainerStyle={mapContainerStyle} center={location} zoom={12}>
              {aqData && (
                <>
                  <Marker position={location} />
                  <InfoWindow position={location}>
                    <div className="info-window">
                      <h3>Air Quality in {aqData.areaName}</h3>
                      <p><strong>AQI:</strong> {aqData.list[0].main.aqi}</p>
                      <p><strong>Concentration of Gases (µg/m³):</strong></p>
                      <ul>
                        <li><strong>CO:</strong> {aqData.list[0].components.co}</li>
                        <li><strong>NO:</strong> {aqData.list[0].components.no}</li>
                        <li><strong>NO₂:</strong> {aqData.list[0].components.no2}</li>
                        <li><strong>O₃:</strong> {aqData.list[0].components.o3}</li>
                        <li><strong>SO₂:</strong> {aqData.list[0].components.so2}</li>
                        <li><strong>PM2.5:</strong> {aqData.list[0].components.pm2_5}</li>
                        <li><strong>PM10:</strong> {aqData.list[0].components.pm10}</li>
                        <li><strong>NH₃:</strong> {aqData.list[0].components.nh3}</li>
                      </ul>
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

export default AQI;
