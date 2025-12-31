import axios from 'axios';
import logger from '../utils/logger.js';

class ApiService {
    constructor() {
        this.baseUrl = process.env.API_BASE_URL || 'http://localhost:5000/api';
    }

    async getOriginalArticles() {
        try {
            logger.info('Fetching original articles from API');

            const response = await axios.get(`${this.baseUrl}/articles`, {
                params: {
                    isUpdated: false,
                    limit: 100
                }
            });

            logger.info(`Fetched ${response.data.count} original articles`);
            return response.data.data;

        } catch (error) {
            logger.error(`API fetch error: ${error.message}`);
            throw error;
        }
    }

    async createUpdatedArticle(articleData) {
        try {
            logger.info(`Publishing updated article: ${articleData.title}`);

            const response = await axios.post(`${this.baseUrl}/articles`, articleData);

            logger.info(`Article published successfully: ${response.data.data._id}`);
            return response.data.data;

        } catch (error) {
            logger.error(`API publish error: ${error.message}`);
            throw error;
        }
    }

    async getArticleById(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/articles/${id}`);
            return response.data.data;
        } catch (error) {
            logger.error(`API get article error: ${error.message}`);
            throw error;
        }
    }
}

export default new ApiService();
