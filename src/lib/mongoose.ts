import config from '@/config';
import mongoose from "mongoose";

const {
  MONGODB_USER,
  MONGODB_PASS,
  MONGODB_HOST,
  MONGODB_PORT,
} = config;

mongoose.set('strictQuery', true);
export function connectToDatabase() {
  return mongoose.connect(`mongodb://${MONGODB_USER}:${MONGODB_PASS}@${MONGODB_HOST}:${MONGODB_PORT}`, { dbName: 'tic-online' });
};

export function isConnectedToDatabase() {
  return mongoose.connection.readyState == 1;
}