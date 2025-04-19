import { spawn } from "child_process";

export const analyzeCuisine = (req, res) => {
  const location = req.body.location;

  if (!location) {
    console.error("❌ No location received in request");
    return res.status(400).json({ error: "Location is required" });
  }

  console.log("📦 Running R script for location:", location);

  const r = spawn("Rscript", ["./models/CuisineCoreAnalysis.R", location]);

  let output = "";
  let errorOutput = "";

  r.stdout.on("data", data => {
    output += data.toString();
  });

  r.stderr.on("data", data => {
    errorOutput += data.toString();
  });

  r.on("close", code => {
    if (code !== 0) {
      console.error("💥 R script exited with code:", code);
      console.error("🔴 STDERR:\n", errorOutput);
      return res.status(500).json({ error: errorOutput || "Unknown error from R script" });
    }

    try {
      const result = JSON.parse(output);
      return res.json(result);
    } catch (parseError) {
      console.error("🧨 JSON Parse Error:\n", parseError.message);
      console.error("❓ Raw output:\n", output);
      return res.status(500).json({ error: "Failed to parse R output", raw: output });
    }
  });
};
