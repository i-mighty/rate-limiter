import { Client } from '../models/Client';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import * as redis from 'redis';
import limiter from 'redis-bucket';
import {
  fetchUserMonthlyQuota,
  persistMonthlyUsage,
  UserRate,
} from '../utils/monthlyQuota.js';
import dayjs from 'dayjs';

const Client = mongoose.model<Client>('Client');
const redisUrl = process.env.REDIS_URI || '';
const redisClient = redis.createClient({
  url: redisUrl,
});
redisClient.on('error', () => {});

export const MonthlyQuotaRateLimiter = async function(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.headers['client-key'] as string;
  const cachedUsage = await fetchUserMonthlyQuota(userId);
  if (cachedUsage) {
    const newUsage: UserRate = {
      ...cachedUsage,
      monthlyTokensLeft: cachedUsage.monthlyTokensLeft - 1,
      monthlyTokenUsed: cachedUsage.monthlyTokenUsed + 1,
      cacheUpdated: dayjs().toISOString(),
    };
    persistMonthlyUsage(userId, newUsage);
    next();
  } else {
    res.status(403).send('Forbidden! User profile not found');
  }
};
