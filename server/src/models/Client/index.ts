import mongoose, { Schema } from 'mongoose';
export * from './types.js';
import { Client } from './types.js';

const clientSchema: Schema = new Schema({
  monthlyQuotaTotal: { type: Number, defaultValue: 10000 },
  monthlyQuotaUsed: { type: Number, defaultValue: 0 },
  limitPerSecond: { type: Number, defaultValue: 10 },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export default mongoose.model<Client>('Client', clientSchema, 'clients');
