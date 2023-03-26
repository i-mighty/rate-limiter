import { MonthlyQuotaRateLimiter } from '../../middlewares/MonthlyQuotaWindowRateLimiter.js';
import { Express } from 'express';
import mongoose from 'mongoose';
import { Client } from '../../models/Client';
import LeakyBucketRateLimiter from '../../middlewares/LeakyBucketRateLimiter.js';

const Client = mongoose.model<Client>('Client');

export default function(app: Express) {
  app.post(
    '/send-notification',
    LeakyBucketRateLimiter,
    async (_req, res, next) => {
      res.json({
        message: 'success',
        data: 'Notification queued successfully!',
        // TODO: update monthly quota usage
      });
      next();
    },
    MonthlyQuotaRateLimiter,
  );
}
