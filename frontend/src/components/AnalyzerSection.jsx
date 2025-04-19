import { useAnalyzer } from "../hooks/useAnalyzer.js"
import Dropdown from "./Dropdown"
import SubmitButton from "./SubmitButton"
import AnalysisResults from "./AnalysisResults"

export default function AnalyzerSection() {
  const {
    locations,
    selectedCity,
    selectedPlace,
    loading,
    results,
    setSelectedCity,
    setSelectedPlace,
    handleSubmit,
  } = useAnalyzer()

  return (
    <section className="min-h-[100svh] flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4 sm:px-6 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
          Analyzer
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-4 sm:gap-5 md:gap-6 justify-center">
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
            <div className="mt-4 md:mt-0">
              <SubmitButton onClick={handleSubmit} disabled={!selectedCity || !selectedPlace} loading={loading} />
            </div>
          </div>
        </div>

        {results && <AnalysisResults results={results} />}
      </div>
    </section>
  )
}
