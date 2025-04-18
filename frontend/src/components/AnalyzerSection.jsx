import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import SubmitButton from "./SubmitButton";
import { fetchLocations } from "../services/locationService";
import {
  submitCoreAnalysis
} from "../services/submitService";

export default function AnalyzerSection() {
  const [locations, setLocations] = useState({});
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

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
      const [core] = await Promise.all([
        submitCoreAnalysis(selectedCity, selectedPlace),
      ]);

      const output = {
        core: core.output,
      };

      console.log("Full Output:", output);
      setResults(output);
      // You can optionally display this on screen or toast
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Failed to complete analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-dvh flex flex-col justify-center items-center relative z-10">
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

      {results && (
        <div className="mt-8 bg-gray-100 p-4 rounded-lg w-[90%] max-w-2xl text-black">
            <h2 className="text-xl font-semibold mb-2">Analysis Results</h2>
            <div className="mb-4 whitespace-pre-wrap text-[0.95rem] leading-relaxed">
                {results.core}
            </div>
            {results.image && (
                <img
                    src={`${import.meta.env.VITE_API_URL}${results.image}`}
                    alt="Top Cuisines"
                    className="rounded shadow w-full"
                />
            )}
        </div>
      )}
    </section>
  );
}
