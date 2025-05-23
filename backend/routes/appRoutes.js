import express from 'express';
import { fetchLocations } from '../controllers/locationController.js';
import { analyzeCuisine } from "../controllers/CuisineAnalysisController.js";

const router = express.Router();

// Send available locations
router.get('/locations', fetchLocations);

// Handle location submission and analyze cuisine
router.post("/analyze/core", analyzeCuisine);

export default router;
