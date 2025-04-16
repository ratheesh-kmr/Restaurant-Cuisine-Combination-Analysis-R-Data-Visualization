export const fetchLocations = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/locations`);

    if (!response.ok) {
      throw new Error("Failed to fetch locations");
    }
    return response.json();
};
