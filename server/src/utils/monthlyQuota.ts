import * as redis from 'redis';
import mongoose from 'mongoose';
import { Client } from '../models/Client';
import { redisClient } from '../index.js';
import dayjs, { Dayjs } from 'dayjs';

const clientRepo = mongoose.model<Client>('Client');
const redisUrl = process.env.REDIS_URI || '';
const client = redis.createClient({
  url: redisUrl,
});
client.connect();

export interface UserRate {
  monthlyTokensLeft: number;
  monthlyTokenUsed: number;
  monthlyQuotaTotal: number;
  cacheAdded: string;
  cacheUpdated: string;
}

export interface RequestRate {
  requestPerSecond: number;
  cacheAdded: string;
  cacheUpdated: string;
}

const monthlyQuotaKey = (userId: string) => {
  return `${userId}-monthly-usage`;
};
const requestRateKey = (userId: string) => {
  return `${userId}-request_rate`;
};
export const fetchUserRequestRate = async (userId: string) => {
  const res = await redisClient.get(requestRateKey(userId));
  if (res) {
    const userRate = JSON.parse(res) as RequestRate;
    return userRate;
  } else {
    const clientData = await clientRepo.findById(userId);
    if (clientData) {
      const rateData = {
        requestPerSecond: clientData.limitPerSecond,
        cacheAdded: dayjs().toISOString(),
        cacheUpdated: dayjs().toISOString(),
      } as RequestRate;

      redisClient.set(requestRateKey(userId), JSON.stringify(rateData));
      return rateData;
    } else {
      null;
    }
  }
};

export const userRateCleanUp = async (userId: string) => {};

export const fetchUserMonthlyQuota = async (userId: string) => {
  const res = await redisClient.get(monthlyQuotaKey(userId));
  if (res) {
    const userData = JSON.parse(res) as UserRate;
    return userData;
  } else {
    const clientData = await clientRepo.findById(userId);
    if (clientData) {
      const userUsage = {
        monthlyTokensLeft:
          clientData.monthlyQuotaTotal - clientData.monthlyQuotaUsed,
        monthlyTokenUsed: clientData.monthlyQuotaUsed,
        monthlyQuotaTotal: clientData.monthlyQuotaTotal,
        cacheAdded: dayjs().toISOString(),
        cacheUpdated: dayjs().toISOString(),
      } as UserRate;
      redisClient.set(monthlyQuotaKey(userId), JSON.stringify(userUsage));
      return userUsage;
    } else {
      return null;
    }
  }
};

export const persistMonthlyUsage = async (userId: string, rate: UserRate) => {
  const newUsage = rate?.monthlyTokenUsed;
  if (
    Math.abs(dayjs(rate.cacheUpdated).diff(dayjs(rate.cacheAdded), 's')) >= 5
  ) {
    // cache is older than 5 seconds
    // we need to save to db and invalidate
    // this logic may be transferred to a worker or a cron job
    await clientRepo.findByIdAndUpdate(userId, {
      monthlyQuotaUsed: newUsage,
    });
    redisClient.del(monthlyQuotaKey(userId));
  } else {
    // store to cache
    redisClient.set(monthlyQuotaKey(userId), JSON.stringify(rate));
  }
};
