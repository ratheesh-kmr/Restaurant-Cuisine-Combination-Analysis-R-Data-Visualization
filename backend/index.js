import express from 'express';
import processCSV from './middlewares/processZomatoCSV.js';
import dotenv from 'dotenv';

const app = express();
const port = 3000;
dotenv.config();

app.use('/', router);

app.use(cors({
  origin: true,
  credentials: true
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
