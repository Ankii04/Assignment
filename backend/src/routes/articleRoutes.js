import express from 'express';
import { body } from 'express-validator';
import {
    getArticles,
    getArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    scrapeArticles
} from '../controllers/articleController.js';

const router = express.Router();

// Validation middleware
const articleValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('url').notEmpty().isURL().withMessage('Valid URL is required'),
    body('content').notEmpty().withMessage('Content is required')
];

// Routes
router.get('/', getArticles);
router.get('/:id', getArticle);
router.post('/', articleValidation, createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);

// Scraping route
router.post('/scrape/trigger', scrapeArticles);

export default router;
