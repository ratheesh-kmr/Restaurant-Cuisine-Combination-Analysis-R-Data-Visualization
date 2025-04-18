const API_BASE = import.meta.env.VITE_API_URL;

export const submitCoreAnalysis = async (city, place) => {
  const response = await fetch(`${API_BASE}/analyze/core`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ location: `${place}, ${city}` }),
  });

  if (!response.ok) {
    throw new Error("Core analysis request failed");
  }

  return await response.json();
};
