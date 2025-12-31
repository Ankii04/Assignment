import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import scraperService from '../services/scraperService.js';
import Article from '../models/Article.js';
import logger from '../utils/logger.js';

dotenv.config();

async function runScraper() {
    try {
        logger.info('🕷️  Starting web scraper...');

        // Connect to database
        await connectDB();

        // Run scraper
        const scrapedArticles = await scraperService.scrapeArticles();

        logger.info(`Scraped ${scrapedArticles.length} articles`);

        // Save to database
        let savedCount = 0;
        for (const articleData of scrapedArticles) {
            try {
                // Check if article already exists
                const existing = await Article.findOne({ url: articleData.url });

                if (!existing) {
                    await Article.create(articleData);
                    savedCount++;
                    logger.info(`✅ Saved: ${articleData.title}`);
                } else {
                    // Update existing article with new content to ensure it's complete
                    await Article.findByIdAndUpdate(existing._id, articleData);
                    savedCount++;
                    logger.info(`🔄 Updated existing: ${articleData.title}`);
                }
            } catch (error) {
                logger.error(`❌ Failed to save: ${articleData.title} - ${error.message}`);
            }
        }

        logger.info(`\n✅ Scraping completed!`);
        logger.info(`   Total scraped: ${scrapedArticles.length}`);
        logger.info(`   Newly saved: ${savedCount}`);
        logger.info(`   Already existed: ${scrapedArticles.length - savedCount}`);

        process.exit(0);

    } catch (error) {
        logger.error(`Scraper failed: ${error.message}`);
        process.exit(1);
    }
}

runScraper();
