import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { fetchLocations } from "../services/locationService";
import { submitLocation } from "../services/submitService";

export default function AnalyzerSection() {
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

    return(
        <section className="h-dvh flex flex-col justify-center items-center relative z-10">
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
        </section>
    );
}
