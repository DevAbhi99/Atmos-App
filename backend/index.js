const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
require('dotenv').config();
const userRoutes=require('../backend/routes/route');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));



let currentLocation = { lat: 53.3400, lng: -6.2550 }; // Default location
const areaCoordinates = [];
const file=process.env.FILE;


fs.createReadStream(file) 
  .pipe(csv())
  .on('data', (row) => {
    const { Area, Latitude, Longitude } = row;
    areaCoordinates.push({
      area: Area,
      lat: parseFloat(Latitude),
      lng: parseFloat(Longitude),
    });
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });


app.get('/areas', (req, res) => {
  res.json(areaCoordinates);
});


app.post('/set-location', (req, res) => {
  const { area } = req.body;
  const selectedArea = areaCoordinates.find((a) => a.area === area);

  if (selectedArea) {
    currentLocation = { lat: selectedArea.lat, lng: selectedArea.lng };
    res.json({ message: 'Location updated successfully', currentLocation });
  } else {
    res.status(404).json({ message: 'Area not found' });
  }
});

app.use('/users', userRoutes);


// Start server
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
