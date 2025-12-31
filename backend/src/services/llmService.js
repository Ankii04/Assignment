import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

class LLMService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    }

    async rewriteArticle(originalArticle, competitorArticles) {
        try {
            logger.info(`Rewriting article: ${originalArticle.title}`);

            const prompt = this.buildPrompt(originalArticle, competitorArticles);

            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const rewrittenContent = response.text();

            logger.info(`Article rewritten successfully (${rewrittenContent.length} chars)`);

            return rewrittenContent;

        } catch (error) {
            logger.error(`LLM rewriting error: ${error.message}`);
            throw error;
        }
    }

    buildPrompt(originalArticle, competitorArticles) {
        const comp1 = competitorArticles[0] || { title: 'N/A', content: 'Not available' };
        const comp2 = competitorArticles[1] || { title: 'N/A', content: 'Not available' };

        return `You are a professional content writer and SEO expert. Your task is to rewrite an article by analyzing competitor articles and incorporating their best practices.

**INSTRUCTIONS:**
1. Analyze the structure, formatting, and depth of the two competitor articles
2. Rewrite the original article to be more comprehensive and engaging
3. Incorporate relevant sections and topics from competitors that the original lacks
4. Maintain the core message and intent of the original article
5. Use proper HTML formatting with headings (h2, h3), paragraphs, lists, and bold text
6. Make the content SEO-friendly with clear structure
7. Aim for similar or greater word count than competitors
8. Use a professional, informative tone
9. Add a "References" section at the end with the competitor article links

**ORIGINAL ARTICLE:**
Title: ${originalArticle.title}
Content: ${originalArticle.content.substring(0, 3000)}

**COMPETITOR ARTICLE 1:**
Title: ${comp1.title}
Content: ${comp1.content.substring(0, 3000)}

**COMPETITOR ARTICLE 2:**
Title: ${comp2.title}
Content: ${comp2.content.substring(0, 3000)}

**COMPETITOR URLS FOR REFERENCES:**
1. ${competitorArticles[0]?.url || 'N/A'}
2. ${competitorArticles[1]?.url || 'N/A'}

Please provide the complete rewritten article in HTML format with proper structure. Include a References section at the end with the competitor URLs.`;
    }

    async testConnection() {
        try {
            const result = await this.model.generateContent('Say "Hello, I am working!"');
            const response = await result.response;
            logger.info('LLM connection test successful');
            return true;
        } catch (error) {
            logger.error(`LLM connection test failed: ${error.message}`);
            return false;
        }
    }
}

export default new LLMService();
