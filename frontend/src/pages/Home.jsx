import { useEffect, useState } from "react";
import Dropdown from "../components/Dropdown";
import SubmitButton from "../components/SubmitButton";
import { fetchLocations } from "../services/locationService";
import { submitLocation } from "../services/submitService";

const Home = () => {
  const [locations, setLocations] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch((err) => console.error("Error:", err));
  }, []);

  const handleSubmit = async () => {
    if (!selectedCity || !selectedPlace) {
      alert("Please select both city and place");
      return;
    }
  
    setLoading(true);
  
    try {
      const result = await submitLocation(selectedCity, selectedPlace);
      console.log("Server Response:", result);
      // Show a toast or navigate, etc.
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="bg-black text-white min-h-screen max-w-screen overflow-x-hidden">
      <div className="h-dvh flex flex-col md:flex-row items-center">
        <div className="p-4 md:w-1/2 flex flex-col justify-center">
          <h1 className="text-[5rem] mb-4">Cuisine Analysis</h1>
          <p className="text-[2rem]">
            Analyze the density of an area's cuisine combination...
          </p>
        </div>
        <div className="md:w-1/2 h-full w-full bg-cover bg-center" style={{ backgroundImage: "url('/restaurant.png')" }} />
      </div>

      <div className="h-dvh flex flex-col justify-center items-center relative z-10">
        <h1 className="p-4 border-b border-b-gray-500 text-4xl mb-6">Analyser</h1>
        <div className="flex flex-wrap gap-4 items-center">
          <Dropdown
            label="Select a City"
            options={Object.keys(locations)}
            selected={selectedCity}
            onSelect={setSelectedCity}
          />
          <Dropdown
            label={selectedCity ? "Select a Place" : "Choose a city first"}
            options={locations[selectedCity] || []}
            selected={selectedPlace}
            onSelect={setSelectedPlace}
            disabled={!selectedCity}
          />
          <SubmitButton
            onClick={handleSubmit}
            disabled={!selectedCity || !selectedPlace}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
