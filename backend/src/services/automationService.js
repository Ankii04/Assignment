import dotenv from 'dotenv';
import apiService from '../services/apiService.js';
import googleSearchService from '../services/googleSearchService.js';
import contentScraperService from '../services/contentScraperService.js';
import llmService from '../services/llmService.js';
import logger from '../utils/logger.js';

dotenv.config();

class AutomationService {
    constructor() {
        this.batchSize = parseInt(process.env.BATCH_SIZE) || 1;
        this.retryAttempts = parseInt(process.env.RETRY_ATTEMPTS) || 3;
        this.rateLimitDelay = parseInt(process.env.RATE_LIMIT_DELAY) || 5000;
    }

    async run() {
        try {
            logger.info('🚀 Starting automation process...');

            // Step 1: Fetch original articles
            const originalArticles = await apiService.getOriginalArticles();

            if (originalArticles.length === 0) {
                logger.info('No original articles found to process');
                return;
            }

            logger.info(`Found ${originalArticles.length} articles to process`);

            // Process articles in batches
            for (let i = 0; i < originalArticles.length; i += this.batchSize) {
                const batch = originalArticles.slice(i, i + this.batchSize);

                for (const article of batch) {
                    await this.processArticle(article);

                    // Rate limiting delay
                    await this.delay(this.rateLimitDelay);
                }
            }

            logger.info('✅ Automation process completed successfully');

        } catch (error) {
            logger.error(`Automation error: ${error.message}`);
            throw error;
        }
    }

    async processArticle(article) {
        try {
            logger.info(`\n${'='.repeat(60)}`);
            logger.info(`Processing: ${article.title}`);
            logger.info(`${'='.repeat(60)}`);

            // Step 2: Google Search
            logger.info('Step 1: Searching Google for competitor articles...');
            let searchResults = await googleSearchService.searchArticles(article.title);

            if (searchResults.length === 0) {
                logger.warn('No competitor articles found from Google Search');
                logger.info('Using fallback competitor URLs for demonstration...');

                // Fallback: Use curated competitor URLs based on article topic
                searchResults = this.getFallbackCompetitorUrls(article.title);
                logger.info(`Using ${searchResults.length} fallback URLs`);
            }

            if (searchResults.length === 0) {
                logger.warn('No competitor articles available (even with fallback), skipping...');
                return;
            }

            logger.info(`Found ${searchResults.length} competitor articles`);

            // Step 3: Scrape competitor content
            logger.info('Step 2: Scraping competitor article content...');
            const competitorUrls = searchResults.map(r => r.url);
            const competitorArticles = await contentScraperService.scrapeMultipleArticles(competitorUrls);

            if (competitorArticles.length === 0) {
                logger.warn('Could not scrape competitor content, skipping...');
                return;
            }

            logger.info(`Successfully scraped ${competitorArticles.length} competitor articles`);

            // Step 4: Rewrite using LLM
            logger.info('Step 3: Rewriting article using AI...');
            const rewrittenContent = await llmService.rewriteArticle(
                {
                    title: article.title,
                    content: article.content
                },
                competitorArticles
            );

            // Step 5: Publish updated article
            logger.info('Step 4: Publishing updated article...');
            const updatedArticle = {
                title: article.title,
                url: article.url + '-updated',
                author: article.author,
                publishedDate: new Date(),
                content: rewrittenContent,
                excerpt: rewrittenContent.substring(0, 200).replace(/<[^>]*>/g, '') + '...',
                imageUrl: article.imageUrl,
                isUpdated: true,
                originalArticleId: article._id,
                references: competitorUrls
            };

            const publishedArticle = await apiService.createUpdatedArticle(updatedArticle);

            logger.info(`✅ Successfully processed: ${article.title}`);
            logger.info(`   Updated article ID: ${publishedArticle._id}`);
            logger.info(`   References: ${competitorUrls.length} competitor articles`);

        } catch (error) {
            logger.error(`Failed to process article "${article.title}": ${error.message}`);

            // Retry logic
            if (this.retryAttempts > 0) {
                logger.info(`Retrying... (${this.retryAttempts} attempts left)`);
                this.retryAttempts--;
                await this.delay(5000);
                await this.processArticle(article);
            }
        }
    }

    getFallbackCompetitorUrls(articleTitle) {
        // Curated competitor URLs for common topics
        const fallbackUrls = {
            chatbot: [
                { url: 'https://www.zendesk.com/blog/chatbot-guide/', title: 'Complete Guide to Chatbots' },
                { url: 'https://www.intercom.com/blog/chatbots/', title: 'How to Build a Chatbot' }
            ],
            ai: [
                { url: 'https://www.ibm.com/topics/artificial-intelligence', title: 'What is Artificial Intelligence' },
                { url: 'https://www.forbes.com/advisor/business/software/what-is-ai/', title: 'AI Guide for Businesses' }
            ],
            healthcare: [
                { url: 'https://www.healthit.gov/topic/artificial-intelligence', title: 'AI in Healthcare' },
                { url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6616181/', title: 'Artificial Intelligence in Healthcare' }
            ],
            customer: [
                { url: 'https://www.salesforce.com/resources/articles/customer-service/', title: 'Customer Service Best Practices' },
                { url: 'https://www.zendesk.com/blog/customer-service-skills/', title: 'Essential Customer Service Skills' }
            ],
            support: [
                { url: 'https://www.helpscout.com/blog/customer-support/', title: 'Customer Support Guide' },
                { url: 'https://www.freshworks.com/freshdesk/customer-support/', title: 'What is Customer Support' }
            ]
        };

        const titleLower = articleTitle.toLowerCase();

        // Match keywords to fallback URLs
        for (const [keyword, urls] of Object.entries(fallbackUrls)) {
            if (titleLower.includes(keyword)) {
                logger.info(`Matched keyword "${keyword}" for fallback URLs`);
                return urls;
            }
        }

        // Default fallback
        logger.info('Using default fallback URLs');
        return [
            { url: 'https://www.zendesk.com/blog/customer-service-skills/', title: 'Customer Service Guide' },
            { url: 'https://www.intercom.com/blog/customer-support/', title: 'Customer Support Best Practices' }
        ];
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default new AutomationService();
