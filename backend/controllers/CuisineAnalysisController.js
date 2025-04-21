import { spawn } from "child_process";
import path from "path";

export const analyzeCuisine = (req, res) => {
  const location = req.body.location;

  if (!location) {
    console.error("❌ No location received in request");
    return res.status(400).json({ error: "Location is required" });
  }

  console.log("📦 Running CuisineCoreAnalysis.R for:", location);

  const r = spawn("Rscript", ["./models/CuisineCoreAnalysis.R", location]);

  let output = "";
  let errorOutput = "";

  r.stdout.on("data", (data) => {
    output += data.toString();
  });

  r.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  r.on("close", (code) => {
    if (code !== 0) {
      console.error("💥 R script exited with code:", code);
      console.error("🔴 STDERR:\n", errorOutput || "None");
      return res.status(500).json({
        error: "R script execution failed",
        details: errorOutput || "No error output",
      });
    }

    try {
      const result = JSON.parse(output);

      // Optionally log keys
      console.log("✅ Analysis complete. Keys returned:", Object.keys(result));

      // Normalize image paths to URL format (remove "./public")
      const normalizePath = (p) => p?.replace(/^\.\/public/, "") || null;

      const response = {
        ...result,
        plotPath: normalizePath(result.plotPath),
        regressionPlot: normalizePath(result.regressionPlot),
        clusters: {
          ratings: normalizePath(result.clusters?.ratings),
          averageCost: normalizePath(result.clusters?.averageCost),
          isVegOnly: normalizePath(result.clusters?.isVegOnly),
        },
      };

      return res.json(response);
    } catch (parseError) {
      console.error("🧨 Failed to parse R JSON output:", parseError.message);
      console.error("❓ Raw output:\n", output);
      return res.status(500).json({
        error: "Failed to parse output from R script",
        raw: output,
      });
    }
  });
};
