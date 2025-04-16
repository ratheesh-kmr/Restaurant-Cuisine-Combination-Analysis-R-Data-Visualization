export const submitLocation = async (city, place) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "body": JSON.stringify({ location: `${place}, ${city}` })
      },
      body: JSON.stringify({ city, place }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to submit location");
    }
  
    return await response.json();
};
