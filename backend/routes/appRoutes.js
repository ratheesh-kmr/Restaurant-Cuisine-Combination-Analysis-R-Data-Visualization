import express from 'express';
import { fetchLocations } from '../controller/locationController.js';
import { handleLocationSubmit } from '../controller/CuisineAnalysisController.js';

const router = express.Router();

// Send available locations
router.get('/locations', fetchLocations);

// Handle location submission and analyze cuisine
router.post("/submit", handleLocationSubmit);

export default router;
