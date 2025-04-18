import { getAllLocations } from "../models/locationModel.js";

export const fetchLocations = (req, res) => {
    const locations = getAllLocations();

    if (!locations || Object.keys(locations).length === 0) {
        return res.status(404).json({ error: "No location data found" });
    }

    res.status(200).json(locations);
};
