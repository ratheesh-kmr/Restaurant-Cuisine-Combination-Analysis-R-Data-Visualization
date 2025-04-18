import { exec } from "child_process";

// Utility to run any R script with location as argument
const runRScript = (scriptName, location, res) => {
  const scriptPath = `./models/${scriptName}`;
  exec(`Rscript "${scriptPath}" "${location}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Rscript (${scriptName}) Error:\n`, stderr || stdout || error.message);
      return res.status(500).json({
        error: `R script failed: ${scriptName}`,
        details: stderr || stdout || error.message,
      });
    }

    // Add fallback if no output
    if (!stdout.trim()) {
      stdout = "No output from script.";
    }

    const imageFile = `/plots/${location.replace(/, /g, "_")}_top10.png`;
    res.json({
      message: `Analysis complete: ${scriptName}`,
      output: stdout,
      image: imageFile
    });
  });
};

// -------- Controllers --------

export const handleCuisineCoreAnalysis = (req, res) => {
  const { location } = req.body;
  if (!location) return res.status(400).json({ error: "Area is required" });
  runRScript("CuisineCoreAnalysis.R", location, res);
};
