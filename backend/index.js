import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import processCSV from './middlewares/processZomatoCSV.js';
import router from './routes/appRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
const port = 3000;

processCSV();

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(router);

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
