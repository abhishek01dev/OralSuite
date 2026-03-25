import mongoose from 'mongoose';
import { databaseConfig } from '@repo/config';

let isConnected = false;

export const connectMongo = async (): Promise<void> => {
  if (isConnected) return;

  try {
    await mongoose.connect(databaseConfig.mongodbUri, {
      minPoolSize: 5,
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.warn('MongoDB connected successfully');
  } catch (error) {
    console.warn('⚠️  MongoDB is not available — audit logging and other Mongo features will be disabled.');
  }
};

mongoose.connection.on('disconnected', () => {
  isConnected = false;
  console.warn('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

export const disconnectMongo = async (): Promise<void> => {
  await mongoose.disconnect();
  isConnected = false;
};
