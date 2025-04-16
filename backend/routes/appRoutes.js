import express from 'express';
import { fetchLocations } from '../controller/locationController.js';

const router = express.Router();

router.get('/locations', fetchLocations);

export default router;
