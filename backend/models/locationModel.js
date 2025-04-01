import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "locations.json");

export const getAllLocations = () => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error("locations.json not found");
        }

        const data = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading locations.json:", error.message);
        return [];
    }
};
