const axios = require('axios');

async function testReddit() {
  try {
    console.log('Testing Reddit API...');
    
    const response = await axios.get('https://www.reddit.com/r/MechanicalKeyboards.json?limit=5', {
      headers: {
        'User-Agent': 'KeyboardTracker/1.0 (Test)'
      },
      timeout: 15000
    });
    
    console.log('✅ Reddit API responded');
    console.log('Posts found:', response.data.data.children.length);
    
    response.data.data.children.forEach((post, i) => {
      console.log(`\n${i + 1}. ${post.data.title}`);
      console.log(`   Author: ${post.data.author}`);
      console.log(`   Upvotes: ${post.data.ups}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.response?.status || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
  }
}

testReddit();
