const axios = require('axios');

async function testMechmarket() {
  try {
    console.log('Testing r/mechmarket...\n');
    
    const response = await axios.get('https://www.reddit.com/r/mechmarket/new.json?limit=50', {
      headers: {
        'User-Agent': 'KeyboardTracker/1.0'
      },
      timeout: 15000
    });
    
    const posts = response.data.data.children;
    console.log(`Total posts fetched: ${posts.length}\n`);
    
    const gbPosts = posts.filter(p => p.data.title.includes('[GB]'));
    const icPosts = posts.filter(p => p.data.title.includes('[IC]'));
    
    console.log(`📦 GROUP BUY posts ([GB]): ${gbPosts.length}`);
    gbPosts.forEach((post, i) => {
      console.log(`\n  ${i + 1}. ${post.data.title}`);
      console.log(`     Author: u/${post.data.author}`);
      console.log(`     Upvotes: ${post.data.ups} | Comments: ${post.data.num_comments}`);
    });
    
    console.log(`\n\n📊 INTEREST CHECK posts ([IC]): ${icPosts.length}`);
    icPosts.forEach((post, i) => {
      console.log(`\n  ${i + 1}. ${post.data.title}`);
      console.log(`     Author: u/${post.data.author}`);
      console.log(`     Upvotes: ${post.data.ups} | Comments: ${post.data.num_comments}`);
    });
    
    if (gbPosts.length === 0 && icPosts.length === 0) {
      console.log('\n⚠️  No [GB] or [IC] posts in the last 50. Showing all post titles:');
      posts.slice(0, 10).forEach((post, i) => {
        console.log(`  ${i + 1}. ${post.data.title.substring(0, 80)}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testMechmarket();
