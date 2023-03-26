import express from 'express';
import * as mongoose from 'mongoose';
import bodyParser from 'body-parser';
import multer from 'multer';
import cors from 'cors';
const upload = multer();
import redis from 'redis';
import './models/Client/index.js';
import LeakyBucketRateLimiter from './middlewares/LeakyBucketRateLimiter.js';
import NotificationRequest from './routes/NotificationRequest/index.js';
import { MonthlyQuotaRateLimiter } from './middlewares/MonthlyQuotaWindowRateLimiter.js';

const redisUrl = process.env.REDIS_URI || '';
export const redisClient = redis.createClient({
  url: redisUrl,
});
redisClient.connect();
const DB = process.env.DB;
const DB_HOST = process.env.DB_HOST;
// const dbURI = `mongodb://${DB_HOST}/${DB}`;
const dbURI = `mongodb://${DB_HOST}/${DB}`;
console.log('dbURI: ', `mongodb://${DB_HOST}/${DB}`);

//Connect to MongoDB
//@ts-ignore
mongoose
  .connect(dbURI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err: any) => console.log(err));
const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload.none());
app.use(cors());
app.options('*', cors());
// app.use(LeakyBucketRateLimiter);
// app.use(MonthlyQuotaRateLimiter);
NotificationRequest(app);

app.listen(process.env.PORT, () => {
  console.log('App is now listening on port ' + process.env.PORT);
});

export default app;
