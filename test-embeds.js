import https from 'https';

const urls = [
  'https://vidsrc.me/embed/movie?imdb=tt0111161',
  'https://vidsrc.to/embed/movie/tt0111161',
  'https://vidsrc.xyz/embed/movie/tt0111161',
  'https://multiembed.mov/directstream.php?video_id=tt0111161',
  'https://www.2embed.cc/embed/tt0111161'
];

async function testUrls() {
  for (const url of urls) {
    try {
      console.log(`Testing ${url}...`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  }
}

testUrls();
