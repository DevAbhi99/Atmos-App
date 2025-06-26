import './App.css';
import "@fontsource/poppins" 
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Main from './Components/Main';
import Weather from './Components/Weather';
import AQI from './Components/AQI';
import Bikestations from './Components/Bikestations';
import Login from './Components/Login';
import Signup from './Components/Signup';

function App() {
  return (
    <>
<BrowserRouter>
<Routes>
  <Route path="/" element={<Login/>}/>
  <Route path="/signup" element={<Signup/>}/>
  <Route path="/atmos" element={<Main/>}/>
  <Route path="/weather" element={<Weather/>}/>
  <Route path="/aqi" element={<AQI/>}/>
  <Route path="/bikestations" element={<Bikestations/>}/>
</Routes>
</BrowserRouter>

  

    </>
  );
}

export default App;
