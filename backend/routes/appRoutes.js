import express from 'express';
import processCSV from '../middlewares/processZomatoCSV.js';

const router = express.Router();

router.get('/locations', processCSV);

export default router;
