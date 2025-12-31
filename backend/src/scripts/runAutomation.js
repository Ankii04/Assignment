import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import automationService from '../services/automationService.js';
import logger from '../utils/logger.js';

dotenv.config();

async function runAutomation() {
    try {
        logger.info('🤖 Starting automation process...');

        // Connect to database
        await connectDB();

        // Run automation
        await automationService.run();

        logger.info('\n✅ Automation completed successfully!');
        process.exit(0);

    } catch (error) {
        logger.error(`Automation failed: ${error.message}`);
        process.exit(1);
    }
}

runAutomation();
