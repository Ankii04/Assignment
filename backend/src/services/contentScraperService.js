import axios from 'axios';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import logger from '../utils/logger.js';

class ContentScraperService {
    async scrapeArticleContent(url) {
        try {
            logger.info(`Scraping content from: ${url}`);

            // Fetch the HTML
            const response = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 30000
            });

            const html = response.data;

            // Use Readability to extract main content
            const dom = new JSDOM(html, { url });
            const reader = new Readability(dom.window.document);
            const article = reader.parse();

            if (!article) {
                logger.warn(`Could not extract content from: ${url}`);
                return null;
            }

            // Clean the content (remove HTML tags for LLM processing)
            const cleanContent = this.stripHtml(article.content);

            logger.info(`Successfully scraped content from: ${url} (${cleanContent.length} chars)`);

            return {
                title: article.title,
                content: cleanContent,
                excerpt: article.excerpt,
                length: cleanContent.length
            };

        } catch (error) {
            logger.error(`Content scraping error for ${url}: ${error.message}`);
            return null;
        }
    }

    stripHtml(html) {
        // Remove HTML tags and clean up whitespace
        return html
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    async scrapeMultipleArticles(urls) {
        const results = [];

        for (const url of urls) {
            const content = await this.scrapeArticleContent(url);
            if (content) {
                results.push({ url, ...content });
            }

            // Add delay to avoid rate limiting
            await this.delay(2000);
        }

        return results;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

export default new ContentScraperService();
