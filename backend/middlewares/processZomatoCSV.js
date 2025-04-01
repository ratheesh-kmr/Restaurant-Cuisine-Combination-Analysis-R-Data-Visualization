import fs from "fs";
import csv from "csv-parser";

const csvFile = "zomato.csv";
const jsonFile = "locations.json";

function processCSV() {
    // Check if JSON file already exists
    if (fs.existsSync(jsonFile)) {
        console.log(`Skipping processing. ${jsonFile} already exists.`);
        return;
    }

    if (!fs.existsSync(csvFile)) {
        console.log(`File ${csvFile} not found.`);
        return;
    }

    const locations = new Set();

    fs.createReadStream(csvFile)
        .pipe(csv())
        .on("data", (row) => {
            if (row.City) {
                locations.add(row.City.trim());
            }
        })
        .on("end", () => {
            fs.writeFileSync(jsonFile, JSON.stringify([...locations], null, 2));
            console.log(`Distinct locations saved to ${jsonFile}`);
        });
}

export default processCSV;
