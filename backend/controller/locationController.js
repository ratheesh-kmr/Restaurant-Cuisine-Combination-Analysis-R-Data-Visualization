import { getAllLocations } from "../models/locationModel.js";

export const fetchLocations = (req, res) => {
    try {
        const locations = getAllLocations();
        res.json(locations);
    } catch (error) {
        console.error("Error fetching locations:", error.message);
        res.status(500).json({ error: "Failed to retrieve locations" });
    }
};
