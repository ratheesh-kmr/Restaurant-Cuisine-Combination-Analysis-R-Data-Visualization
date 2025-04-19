import { useState, useEffect } from "react"
import { fetchLocations } from "../services/locationService.js"
import { submitCoreAnalysis } from "../services/submitService.js"

export function useAnalyzer() {
  const [locations, setLocations] = useState({})
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedPlace, setSelectedPlace] = useState("")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)

  useEffect(() => {
    fetchLocations()
      .then(setLocations)
      .catch((err) => console.error("Error:", err))
  }, [])

  const handleSubmit = async () => {
    if (!selectedCity || !selectedPlace) {
      alert("Please select both city and place")
      return
    }

    setLoading(true)

    try {
      const data = await submitCoreAnalysis(selectedCity, selectedPlace)
      setResults(data)
    } catch (error) {
      console.error("Submission Error:", error)
      alert("Failed to complete analysis. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return {
    locations,
    selectedCity,
    selectedPlace,
    loading,
    results,
    setSelectedCity,
    setSelectedPlace,
    handleSubmit,
  }
}
