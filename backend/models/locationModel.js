import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "places_by_city.json");

export const getAllLocations = () => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error("places_by_city.json not found");
        }

        const data = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(data);

        // Optional: ensure all place arrays are sorted
        for (const city in parsed) {
            parsed[city] = parsed[city].sort();
        }

        return parsed; // returns { Bangalore: ["Ulsoor", "Indiranagar", ...], ... }
    } catch (error) {
        console.error("Error reading places_by_city.json:", error.message);
        return {};
    }
};
