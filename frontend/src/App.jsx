import { useState, useEffect } from "react";

function App() {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/locations`)
      .then((res) => res.json())
      .then((data) => setLocations(data))
      .catch((err) => console.error("Error fetching locations:", err));
  }, []);

  return (
    <>
      <div className="bg-black text-white min-h-screen max-w-screen">
        {/* Main Section */}
        <div className="h-dvh flex flex-col md:flex-row items-center">
          {/* Left Side: Text */}
          <div className="p-4 md:w-1/2 flex flex-col justify-center">
            <h1 className="text-[5rem] mb-4">Cuisine Analysis</h1>
            <p className="text-[2rem]">
              Analyze the density of an area's cuisine combination and structure your business accordingly...
            </p>
          </div>

          {/* Right Side: Background Image */}
          <div className="md:w-1/2 h-full w-full">
            <div 
              className="h-full w-full bg-cover bg-center"
              style={{ backgroundImage: "url('/restaurant.png')" }}
            ></div>
          </div>
        </div>

        {/* Second Section */}
        <div className="h-dvh flex flex-col justify-center items-center">
          <h1 className="p-4 border-b border-b-gray-500 text-4xl mb-6">Analyser</h1>
          
          {/* Location Dropdown */}
          <select 
            className="p-2 bg-gray-900 text-white border border-gray-500 rounded-md"
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
            <option value="" disabled>Select a Location</option>
            {locations.map((location, index) => (
              <option key={index} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}

export default App;
