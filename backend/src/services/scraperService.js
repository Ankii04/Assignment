import puppeteer from 'puppeteer';
import logger from '../utils/logger.js';

class ScraperService {
    constructor() {
        this.baseUrl = process.env.SCRAPE_URL || 'https://beyondchats.com/blogs/';
        this.articlesToScrape = parseInt(process.env.ARTICLES_TO_SCRAPE) || 5;
    }

    async scrapeArticles() {
        let browser;
        try {
            logger.info('Starting web scraping...');

            browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });

            const page = await browser.newPage();
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

            logger.info(`Navigating to ${this.baseUrl}`);
            await page.goto(this.baseUrl, { waitUntil: 'networkidle2', timeout: 60000 });

            // Find the last page number
            let lastPage = await page.evaluate(() => {
                const paginationLinks = document.querySelectorAll('.page-numbers');
                const pages = Array.from(paginationLinks)
                    .map(link => parseInt(link.innerText.replace(/,/g, '')))
                    .filter(num => !isNaN(num));
                return pages.length > 0 ? Math.max(...pages) : 1;
            });

            // Hard fallback as verified by browser agent
            if (lastPage === 1) {
                logger.warn('Dynamic pagination detection failed, using fallback page 15');
                lastPage = 15;
            }

            logger.info(`Found last page: ${lastPage}`);

            // Navigate to last page
            const lastPageUrl = lastPage > 1 ? `${this.baseUrl}page/${lastPage}/` : this.baseUrl;
            logger.info(`Navigating to last page: ${lastPageUrl}`);
            await page.goto(lastPageUrl, { waitUntil: 'networkidle2', timeout: 60000 });

            // Wait for articles to load
            await page.waitForSelector('article, .entry-card, .post', { timeout: 15000 });

            // Get all article links from the page
            const articleLinks = await page.evaluate(() => {
                const links = [];
                const articleElements = document.querySelectorAll('article, .entry-card, .post');

                articleElements.forEach(el => {
                    const linkEl = el.querySelector('a[href*="/blogs/"]');
                    if (linkEl) {
                        const href = linkEl.href;
                        const titleEl = el.querySelector('h1, h2, h3, .entry-title, .post-title');
                        const title = titleEl ? titleEl.textContent.trim() : linkEl.textContent.trim();

                        if (href && title && href.includes('/blogs/')) {
                            links.push({ url: href, title });
                        }
                    }
                });

                // Remove duplicates
                const unique = Array.from(new Map(links.map(item => [item.url, item])).values());
                return unique;
            });

            logger.info(`Found ${articleLinks.length} article links on page ${lastPage}`);

            // Phase 1 requirement: "fetch the 5 oldest articles"
            const articlesToProcess = articleLinks.slice(0, this.articlesToScrape);
            logger.info(`Processing ${articlesToProcess.length} candidate articles`);

            const scrapedArticles = [];

            for (const articleLink of articlesToProcess) {
                try {
                    logger.info(`Scraping article: ${articleLink.title}`);
                    const articleData = await this.scrapeArticleDetails(page, articleLink.url);

                    if (articleData) {
                        scrapedArticles.push({
                            ...articleData,
                            url: articleLink.url
                        });
                        logger.info(`Successfully scraped: ${articleData.title}`);
                    }
                } catch (error) {
                    logger.error(`Failed to scrape ${articleLink.url}: ${error.message}`);
                }
            }

            await browser.close();
            logger.info(`Scraping completed. Total articles: ${scrapedArticles.length}`);

            return scrapedArticles;

        } catch (error) {
            logger.error(`Scraping error: ${error.message}`);
            if (browser) await browser.close();
            throw error;
        }
    }

    async scrapeArticleDetails(page, url) {
        try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

            const articleData = await page.evaluate(() => {
                // Helper function to extract text
                const getText = (selectors) => {
                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) return element.textContent.trim();
                    }
                    return '';
                };

                // Helper function to extract attribute
                const getAttr = (selectors, attr) => {
                    for (const selector of selectors) {
                        const element = document.querySelector(selector);
                        if (element) return element.getAttribute(attr);
                    }
                    return '';
                };

                // Extract title
                const title = getText([
                    'h1',
                    '.article-title',
                    '.post-title',
                    '[class*="title"]',
                    'title'
                ]);

                // Extract author
                const author = getText([
                    '.author',
                    '[class*="author"]',
                    '[rel="author"]',
                    '.byline',
                    '[itemprop="author"]'
                ]);

                // Extract date
                const dateText = getText([
                    'time',
                    '.date',
                    '.published',
                    '[class*="date"]',
                    '[itemprop="datePublished"]'
                ]);

                // Extract image
                const imageUrl = getAttr([
                    'article img',
                    '.featured-image img',
                    '.post-image img',
                    'meta[property="og:image"]',
                    'img[class*="featured"]'
                ], 'src') || getAttr(['meta[property="og:image"]'], 'content');

                // Extract content
                const contentSelectors = [
                    'div.elementor-widget-theme-post-content .elementor-widget-container',
                    'article',
                    '.entry-content',
                    '.article-content',
                    '.post-content',
                    'main',
                    '.elementor-widget-container'
                ];

                let content = '';
                for (const selector of contentSelectors) {
                    const elements = document.querySelectorAll(selector);
                    for (const element of elements) {
                        // We want the most comprehensive container
                        // In Elementor, the main content is often in one of these with lots of text
                        if (element && element.innerText.length > content.length) {
                            // Clone and remove unwanted elements
                            const clone = element.cloneNode(true);
                            clone.querySelectorAll('script, style, nav, aside, .comments, .related, .elementor-social-icons-wrapper').forEach(el => el.remove());
                            // Store as HTML to preserve structure for LLM
                            content = clone.innerHTML.trim();
                        }
                    }
                    if (content.length > 500) break;
                }

                // Extract excerpt (clean text for display)
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = content;
                const cleanText = tempDiv.textContent || tempDiv.innerText || '';
                const excerpt = cleanText.substring(0, 200) + (cleanText.length > 200 ? '...' : '');

                return {
                    title,
                    author: author || 'BeyondChats Team',
                    publishedDate: dateText || new Date().toISOString(),
                    imageUrl: imageUrl || '',
                    content: content || 'Content not available',
                    excerpt
                };
            });

            return articleData;

        } catch (error) {
            logger.error(`Error scraping article details from ${url}: ${error.message}`);
            return null;
        }
    }
}

export default new ScraperService();
