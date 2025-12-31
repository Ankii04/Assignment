import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function testGoogleAPI() {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.GOOGLE_CSE_ID;

    console.log('\n🔍 Testing Google Custom Search API...\n');
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : '❌ NOT SET');
    console.log('CSE ID:', cseId ? `${cseId.substring(0, 10)}...` : '❌ NOT SET');
    console.log('\n---\n');

    if (!apiKey || apiKey.includes('your_') || apiKey === 'your_google_api_key_here') {
        console.log('❌ ERROR: GOOGLE_API_KEY is not set or still has placeholder value');
        console.log('   Please update backend/.env with your real API key\n');
        return;
    }

    if (!cseId || cseId.includes('your_') || cseId === 'your_custom_search_engine_id_here') {
        console.log('❌ ERROR: GOOGLE_CSE_ID is not set or still has placeholder value');
        console.log('   Please update backend/.env with your real Search Engine ID\n');
        return;
    }

    try {
        console.log('📡 Making test request to Google...\n');

        const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: apiKey,
                cx: cseId,
                q: 'test search',
                num: 1
            }
        });

        console.log('✅ SUCCESS! Google API is working!\n');
        console.log('Search Results:', response.data.searchInformation.totalResults, 'results found');
        console.log('First result:', response.data.items?.[0]?.title || 'N/A');
        console.log('\n✅ Your API credentials are valid and working!\n');

    } catch (error) {
        console.log('❌ ERROR: Google API request failed\n');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data?.error?.message || error.message);
        console.log('\n');

        if (error.response?.status === 403) {
            console.log('💡 Error 403 means:');
            console.log('   1. API key is invalid or restricted');
            console.log('   2. Custom Search API is not enabled');
            console.log('   3. Billing is not enabled in Google Cloud');
            console.log('   4. Search Engine ID is incorrect\n');
        } else if (error.response?.status === 400) {
            console.log('💡 Error 400 means:');
            console.log('   1. Search Engine ID (CSE_ID) is incorrect');
            console.log('   2. API key format is wrong\n');
        }
    }
}

testGoogleAPI();
