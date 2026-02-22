const axios = require('axios');

async function findGroupBuys() {
  try {
    console.log('Searching for [GB] and [IC] posts...\n');
    
    // Check multiple subreddits
    const subreddits = ['MechanicalKeyboards', 'mechmarket', 'keyboards'];
    const allPosts = [];
    
    for (const subreddit of subreddits) {
      try {
        const response = await axios.get(`https://www.reddit.com/r/${subreddit}/new.json?limit=100`, {
          headers: { 'User-Agent': 'KeyboardTracker/1.0' },
          timeout: 15000
        });
        
        const posts = response.data.data.children;
        
        const gbPosts = posts.filter(p => 
          p.data.title.includes('[GB]') || 
          p.data.title.toLowerCase().includes('group buy') ||
          p.data.title.toLowerCase().includes('groupbuy')
        );
        
        const icPosts = posts.filter(p => 
          p.data.title.includes('[IC]') || 
          p.data.title.toLowerCase().includes('interest check') ||
          p.data.title.toLowerCase().includes('interestcheck')
        );
        
        if (gbPosts.length > 0 || icPosts.length > 0) {
          console.log(`\n📍 r/${subreddit}:`);
          
          if (gbPosts.length > 0) {
            console.log(`  [GB] Posts: ${gbPosts.length}`);
            gbPosts.slice(0, 3).forEach(p => {
              console.log(`    • ${p.data.title.substring(0, 70)}`);
            });
          }
          
          if (icPosts.length > 0) {
            console.log(`  [IC] Posts: ${icPosts.length}`);
            icPosts.slice(0, 3).forEach(p => {
              console.log(`    • ${p.data.title.substring(0, 70)}`);
            });
          }
          
          allPosts.push(...gbPosts, ...icPosts);
        }
      } catch (e) {
        console.log(`  r/${subreddit}: Error - ${e.message}`);
      }
    }
    
    console.log(`\n✅ Total [GB]/[IC] posts found: ${allPosts.length}`);
    
    if (allPosts.length === 0) {
      console.log('\n💡 Alternative: Let me check Geekhack directly...');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findGroupBuys();
