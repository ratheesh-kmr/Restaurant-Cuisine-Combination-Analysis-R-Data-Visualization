import fs from "fs";
import csv from "csv-parser";

const csvFile = "zomato.csv";
const outputFile = "places_by_city.json";

function processCSV() {
  if (fs.existsSync(outputFile)) {
    console.log(`Skipping processing. ${outputFile} already exists.`);
    return;
  }

  if (!fs.existsSync(csvFile)) {
    console.log(`File ${csvFile} not found.`);
    return;
  }

  const placesByCity = {};

  fs.createReadStream(csvFile)
    .pipe(csv())
    .on("data", (row) => {
      const area = row.Area?.trim();
      if (area && area.includes(",")) {
        const [placeRaw, cityRaw] = area.split(",").map((s) => s.trim());
        if (placeRaw && cityRaw) {
          if (!placesByCity[cityRaw]) {
            placesByCity[cityRaw] = new Set();
          }
          placesByCity[cityRaw].add(placeRaw);
        }
      }
    })
    .on("end", () => {
      const finalOutput = {};
      for (const city in placesByCity) {
        finalOutput[city] = [...placesByCity[city]];
      }

      fs.writeFileSync(outputFile, JSON.stringify(finalOutput, null, 2));
      console.log(`Created ${outputFile} file`);
    });
}

export default processCSV;
