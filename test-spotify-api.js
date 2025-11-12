const axios = require('axios');

async function testSpotifyAPI() {
  try {
    // Test getting an artist (public endpoint, no auth needed)
    const artistResponse = await axios.get('https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg', {
      headers: {
        'User-Agent': 'WreckshopApp/1.0'
      }
    });

    console.log('✅ Spotify API is accessible!');
    console.log('\n📊 Artist Profile:');
    console.log(`  Name: ${artistResponse.data.name}`);
    console.log(`  Followers: ${artistResponse.data.followers.total.toLocaleString()}`);
    console.log(`  Popularity: ${artistResponse.data.popularity}/100`);
    console.log(`  Genres: ${artistResponse.data.genres.join(', ')}`);
    console.log(`  URL: ${artistResponse.data.external_urls.spotify}`);

  } catch (error) {
    console.error('❌ Spotify API error:', error.message);
  }
}

testSpotifyAPI();
