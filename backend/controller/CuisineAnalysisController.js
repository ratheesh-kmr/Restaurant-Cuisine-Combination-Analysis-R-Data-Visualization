import { exec } from "child_process";
import path from "path";

export const handleLocationSubmit = (req, res) => {
  const { location } = req.body;
  if (!location) {
    return res.status(400).json({ error: "Area is required" });
  }

  const rScriptPath = "../models/CuisineAnalysisModel.R";

  exec(`Rscript "${rScriptPath}" "${location}"`, (error, stdout, stderr) => {
    if (error) {
      console.error("R Script Error:", stderr);
      return res.status(500).json({ error: "R script failed", details: stderr });
    }

    console.log(stdout); // log cuisine analysis
    res.json({ message: "Analysis complete", output: stdout });
  });
};
