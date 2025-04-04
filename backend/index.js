import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import processCSV from './middlewares/processZomatoCSV.js';
import router from './routes/appRoutes.js';

dotenv.config();

const app = express();
const port = 3000;

processCSV();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(router);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
