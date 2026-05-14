import mongoose from 'mongoose';
import { config } from './index';

class DatabaseConfig {
  static async connect(): Promise<void> {
    try {
      const uri = config.MONGODB.URI;

      if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }

      const options = {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      };

      await mongoose.connect(uri, options);
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      console.error('Error connecting to MongoDB:', errorMessage);
      throw new Error(`Database connection failed: ${errorMessage}`);
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}

export default DatabaseConfig;
