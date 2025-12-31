import dotenv from 'dotenv';
import googleSearchService from './src/services/googleSearchService.js';
import logger from './src/utils/logger.js';

dotenv.config();

async function testSearch() {
    try {
        console.log('\n🔍 Testing Google Search for article title...\n');

        const testTitle = "AI in Healthcare";
        console.log(`Searching for: "${testTitle}"\n`);

        const results = await googleSearchService.searchArticles(testTitle);

        console.log(`\n✅ Found ${results.length} competitor articles:\n`);
        results.forEach((result, index) => {
            console.log(`${index + 1}. ${result.title}`);
            console.log(`   URL: ${result.url}`);
            console.log(`   Snippet: ${result.snippet.substring(0, 100)}...\n`);
        });

        if (results.length === 0) {
            console.log('⚠️  No results found. This might be because:');
            console.log('   1. All results are filtered out (beyondchats.com, social media, etc.)');
            console.log('   2. Google returned no results for this query');
            console.log('   3. API quota exhausted\n');
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
    }
}

testSearch();
