import express from 'express';
import processCSV from '../middlewares/processZomatoCSV.js';
import { fetchLocations } from '../controller/locationController.js';

const router = express.Router();

router.get('/locations', fetchLocations);

export default router;
