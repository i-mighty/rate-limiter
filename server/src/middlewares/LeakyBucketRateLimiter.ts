import { Client } from '../models/Client/index.js';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { limiterFunction } from '../utils/limiting.js';
import {
  fetchUserMonthlyQuota,
  fetchUserRequestRate,
} from '../utils/monthlyQuota.js';

const Client = mongoose.model<Client>('Client');

export default async function(req: Request, res: Response, next: NextFunction) {
  //@ts-ignore
  // In a production scenario, proper auth would be implemented.
  const userId = req.headers['client-key'] as string;
  const cachedRate = await fetchUserRequestRate(userId);
  const cachedUsage = await fetchUserMonthlyQuota(userId);
  if (cachedRate && cachedUsage) {
    if (cachedUsage.monthlyTokensLeft < cachedRate.requestPerSecond) {
      res.status(403).send('Quota limit exceeded!');
    }
    const test = limiterFunction(cachedRate.requestPerSecond);
    const result = await test(userId);
    if (result.allow) {
      // Accept this call
      res.set('x-rate-limit-remaining-size', result.free.toFixed());
      next();
    } else {
      // Reject this call with "Too Many Requests"
      res.set('Retry-After', result.wait.toFixed());
      res.sendStatus(429);
    }
  } else {
    res.status(403).send('Forbidden!');
  }
}
