import { Document } from 'mongoose';

export interface Client extends Document {
  monthlyQuotaTotal: number;
  monthlyQuotaUsed: number;
  limitPerSecond: number;
  createdAt: string;
  updatedAt: string;
}
