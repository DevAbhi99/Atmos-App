import react from 'react';
import './Heading.css';

function Heading(){

return(
    <>
    <div className="heading-main">
    <a href="http://localhost:3000/"><button id="title_btn"><div className='app-title'><h1>AtMos</h1></div></button></a>
    <div className='title-options'><span id="aq"><a href="http://localhost:3000/aqi"><button id="aq">Air Quality</button></a></span><span id="weather"><a href='http://localhost:3000/weather'><button id="weather">Weather</button></a></span><span id="weather"><a href='http://localhost:3000/bikestations'><button id="weather">Bike Stations</button></a></span></div>
    </div>
    </>
)

};

export default Heading;