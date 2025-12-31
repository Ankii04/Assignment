import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

async function diagnoseGoogleAPI() {
    const apiKey = process.env.GOOGLE_API_KEY;
    const cseId = process.env.GOOGLE_CSE_ID;

    console.log('\n🔍 GOOGLE CUSTOM SEARCH API DIAGNOSTIC\n');
    console.log('='.repeat(60));

    // Check 1: Credentials
    console.log('\n1️⃣  CHECKING CREDENTIALS:');
    console.log('   API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : '❌ NOT SET');
    console.log('   CSE ID:', cseId ? `${cseId.substring(0, 15)}...` : '❌ NOT SET');

    if (!apiKey || apiKey.includes('your_')) {
        console.log('\n   ❌ API Key is invalid or placeholder');
        return;
    }

    if (!cseId || cseId.includes('your_')) {
        console.log('\n   ❌ CSE ID is invalid or placeholder');
        return;
    }

    console.log('   ✅ Credentials are set');

    // Check 2: Simple API Test
    console.log('\n2️⃣  TESTING API CONNECTION:');
    try {
        const testResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: apiKey,
                cx: cseId,
                q: 'test',
                num: 1
            },
            timeout: 10000
        });

        console.log('   ✅ API is responding');
        console.log('   Total results:', testResponse.data.searchInformation.totalResults);

    } catch (error) {
        console.log('   ❌ API Error:', error.response?.status || error.code);

        if (error.response?.status === 403) {
            console.log('\n   🔴 ERROR 403 - FORBIDDEN');
            console.log('   Possible causes:');
            console.log('   • API key has IP/referrer restrictions');
            console.log('   • Custom Search API not enabled');
            console.log('   • Billing not enabled');
            console.log('   • Invalid API key');
            console.log('\n   📋 TO FIX:');
            console.log('   1. Go to: https://console.cloud.google.com/apis/credentials');
            console.log('   2. Click your API key');
            console.log('   3. Set "Application restrictions" to "None"');
            console.log('   4. Set "API restrictions" to "Custom Search API" only');
            console.log('   5. Save and wait 5 minutes');

        } else if (error.response?.status === 400) {
            console.log('\n   🔴 ERROR 400 - BAD REQUEST');
            console.log('   Possible causes:');
            console.log('   • Invalid Search Engine ID (CSE_ID)');
            console.log('   • Malformed API key');
            console.log('\n   📋 TO FIX:');
            console.log('   1. Go to: https://programmablesearchengine.google.com/');
            console.log('   2. Verify your Search Engine ID');
            console.log('   3. Make sure "Search the entire web" is enabled');

        } else if (error.response?.status === 429) {
            console.log('\n   🔴 ERROR 429 - QUOTA EXCEEDED');
            console.log('   You have exceeded your daily quota (100 searches/day)');
            console.log('\n   📋 TO FIX:');
            console.log('   1. Wait 24 hours for quota to reset');
            console.log('   2. OR enable billing for higher quota');
            console.log('   3. Check: https://console.cloud.google.com/apis/api/customsearch.googleapis.com/quotas');
        }

        if (error.response?.data?.error) {
            console.log('\n   Detailed error:', error.response.data.error.message);
        }

        return;
    }

    // Check 3: Search with article title
    console.log('\n3️⃣  TESTING REAL SEARCH QUERY:');
    try {
        const searchResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
            params: {
                key: apiKey,
                cx: cseId,
                q: 'AI in Healthcare',
                num: 10
            },
            timeout: 10000
        });

        console.log('   ✅ Search successful');
        console.log('   Results found:', searchResponse.data.items?.length || 0);

        if (searchResponse.data.items && searchResponse.data.items.length > 0) {
            console.log('\n   Top 3 results:');
            searchResponse.data.items.slice(0, 3).forEach((item, i) => {
                console.log(`   ${i + 1}. ${item.title}`);
                console.log(`      ${item.link}`);
            });

            // Check filtering
            const excludeDomains = ['beyondchats.com', 'youtube.com', 'facebook.com'];
            const filtered = searchResponse.data.items.filter(item => {
                const url = item.link.toLowerCase();
                return !excludeDomains.some(domain => url.includes(domain));
            });

            console.log(`\n   After filtering: ${filtered.length} results remain`);

            if (filtered.length >= 2) {
                console.log('   ✅ Enough results for automation');
            } else {
                console.log('   ⚠️  Not enough results after filtering');
                console.log('   Consider relaxing filter criteria');
            }
        } else {
            console.log('   ⚠️  No results returned');
        }

    } catch (error) {
        console.log('   ❌ Search failed:', error.response?.status || error.message);
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ DIAGNOSTIC COMPLETE\n');
}

diagnoseGoogleAPI();
