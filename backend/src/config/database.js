import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        logger.error(`❌ MongoDB Connection Error: ${error.message}`);
        logger.warn(`⚠️  Server will start without database connection`);
        logger.warn(`⚠️  Please check your MONGODB_URI in .env file`);
        // Don't exit - allow server to start for debugging
        // process.exit(1);
    }
};

export default connectDB;
