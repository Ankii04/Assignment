import Article from '../models/Article.js';
import scraperService from '../services/scraperService.js';
import automationService from '../services/automationService.js';
import logger from '../utils/logger.js';

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
export const getArticles = async (req, res) => {
    try {
        const { limit = 10, page = 1, isUpdated } = req.query;

        const query = {};
        if (isUpdated !== undefined) {
            query.isUpdated = isUpdated === 'true';
        }

        const articles = await Article.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit))
            .populate('originalArticleId', 'title url');

        const total = await Article.countDocuments(query);

        res.status(200).json({
            success: true,
            count: articles.length,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit)),
            data: articles
        });
    } catch (error) {
        logger.error(`Get articles error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
export const getArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id)
            .populate('originalArticleId', 'title url content');

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        logger.error(`Get article error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create new article
// @route   POST /api/articles
// @access  Public
export const createArticle = async (req, res) => {
    try {
        const article = await Article.create(req.body);

        logger.info(`Article created: ${article.title}`);

        res.status(201).json({
            success: true,
            data: article
        });
    } catch (error) {
        logger.error(`Create article error: ${error.message}`);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Article with this URL already exists'
            });
        }

        res.status(400).json({
            success: false,
            message: 'Invalid article data',
            error: error.message
        });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Public
export const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        logger.info(`Article updated: ${article.title}`);

        res.status(200).json({
            success: true,
            data: article
        });
    } catch (error) {
        logger.error(`Update article error: ${error.message}`);
        res.status(400).json({
            success: false,
            message: 'Update failed',
            error: error.message
        });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Public
export const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);

        if (!article) {
            return res.status(404).json({
                success: false,
                message: 'Article not found'
            });
        }

        logger.info(`Article deleted: ${article.title}`);

        res.status(204).json({
            success: true,
            data: {}
        });
    } catch (error) {
        logger.error(`Delete article error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Delete failed',
            error: error.message
        });
    }
};

// @desc    Trigger web scraping
// @route   POST /api/scrape
// @access  Public
export const scrapeArticles = async (req, res) => {
    try {
        logger.info('Scraping triggered via API');

        const scrapedArticles = await scraperService.scrapeArticles();

        // Save to database
        const savedArticles = [];
        for (const articleData of scrapedArticles) {
            try {
                // Check if article already exists
                const existing = await Article.findOne({ url: articleData.url });

                if (!existing) {
                    const article = await Article.create(articleData);
                    savedArticles.push(article);
                } else {
                    logger.info(`Article already exists: ${articleData.url}`);
                }
            } catch (error) {
                logger.error(`Failed to save article: ${error.message}`);
            }
        }

        res.status(200).json({
            success: true,
            message: `Scraped and saved ${savedArticles.length} articles`,
            data: savedArticles
        });
    } catch (error) {
        logger.error(`Scrape error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Scraping failed',
            error: error.message
        });
    }
};

// @desc    Delete all updated articles (cleanup)
// @route   DELETE /api/articles/cleanup/updated
// @access  Public
export const deleteUpdatedArticles = async (req, res) => {
    try {
        logger.info('Deleting all updated articles (cleanup)');

        const result = await Article.deleteMany({ isUpdated: true });

        logger.info(`Deleted ${result.deletedCount} updated articles`);

        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} updated articles`,
            deletedCount: result.deletedCount
        });
    } catch (error) {
        logger.error(`Cleanup error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Cleanup failed',
            error: error.message
        });
    }
};

// @desc    Trigger AI automation process
// @route   POST /api/articles/automate/trigger
// @access  Public
export const triggerAutomation = async (req, res) => {
    try {
        logger.info('Automation triggered via API');

        // Send immediate response
        res.status(202).json({
            success: true,
            message: 'Automation process started. This may take several minutes. Check logs for progress.'
        });

        // Run automation in background
        automationService.run().catch(error => {
            logger.error(`Automation failed: ${error.message}`);
        });

    } catch (error) {
        logger.error(`Automation trigger error: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to trigger automation',
            error: error.message
        });
    }
};

