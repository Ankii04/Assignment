import axios from 'axios';
import logger from '../utils/logger.js';

class GoogleSearchService {
    constructor() {
        this.apiKey = process.env.GOOGLE_API_KEY;
        this.cseId = process.env.GOOGLE_CSE_ID;
        this.baseUrl = 'https://www.googleapis.com/customsearch/v1';
    }

    async searchArticles(query, retryCount = 0) {
        const maxRetries = 3;

        try {
            logger.info(`Searching Google for: ${query}`);

            // Extract keywords from query (remove special chars, get main terms)
            const keywords = this.extractKeywords(query);
            logger.info(`Extracted keywords: ${keywords}`);

            let response;
            try {
                // Add delay before request to avoid rate limiting
                if (retryCount > 0) {
                    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
                    logger.info(`Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }

                response = await axios.get(this.baseUrl, {
                    params: {
                        key: this.apiKey,
                        cx: this.cseId,
                        q: keywords,
                        num: 10
                    },
                    timeout: 30000 // 30 second timeout
                });
            } catch (error) {
                logger.error(`Google search error: ${error.message}`);

                // Retry on 403 or 429 errors
                if ((error.response?.status === 403 || error.response?.status === 429) && retryCount < maxRetries) {
                    logger.warn(`Got ${error.response.status} error, retrying (${retryCount + 1}/${maxRetries})...`);
                    return this.searchArticles(query, retryCount + 1);
                }

                // If still failing, try fallback search
                if (error.response?.status === 403 || error.response?.status === 429) {
                    logger.warn('API error after retries, trying fallback search');
                    const fallbackQuery = this.getFallbackQuery(query);
                    logger.info(`Fallback query: ${fallbackQuery}`);

                    await new Promise(resolve => setTimeout(resolve, 2000));

                    response = await axios.get(this.baseUrl, {
                        params: {
                            key: this.apiKey,
                            cx: this.cseId,
                            q: fallbackQuery,
                            num: 10
                        },
                        timeout: 30000
                    });
                } else {
                    throw error;
                }
            }

            if (!response.data.items) {
                logger.warn(`No search results found for: ${query}`);
                return [];
            }

            // Filter results to get only blog articles
            logger.info(`Google returned ${response.data.items.length} total results`);

            const filteredResults = response.data.items.filter(item => {
                const url = item.link.toLowerCase();

                // Exclude unwanted domains (only exclude obvious non-articles)
                const excludeDomains = [
                    'beyondchats.com',
                    'youtube.com',
                    'facebook.com',
                    'twitter.com',
                    'instagram.com',
                    '.pdf'
                ];

                const isExcluded = excludeDomains.some(domain => url.includes(domain));

                if (isExcluded) {
                    logger.info(`Excluded: ${url}`);
                }

                return !isExcluded; // Accept all non-excluded results
            });

            logger.info(`After filtering: ${filteredResults.length} results remain`);

            // Get top 2 results
            const topResults = filteredResults.slice(0, 2).map(item => ({
                title: item.title,
                url: item.link,
                snippet: item.snippet
            }));

            logger.info(`Found ${topResults.length} competitor articles`);
            return topResults;

        } catch (error) {
            logger.error(`Google search error: ${error.message}`);

            // Fallback: return empty array if API fails
            if (error.response?.status === 429) {
                logger.warn('Google API rate limit reached');
            }

            return [];
        }
    }

    extractKeywords(title) {
        // Remove special characters and extract main keywords
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might', 'must', 'can'];

        const words = title
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 2 && !stopWords.includes(word));

        // Return first 3-4 meaningful keywords
        return words.slice(0, 4).join(' ');
    }

    getFallbackQuery(originalQuery) {
        // Generate a more generic query based on the original
        const keywords = this.extractKeywords(originalQuery);
        const words = keywords.split(' ');

        // Use first 2 keywords + generic term
        if (words.length >= 2) {
            return `${words[0]} ${words[1]} guide tutorial`;
        }
        return keywords + ' guide';
    }
}

export default new GoogleSearchService();
