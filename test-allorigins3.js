async function testAllOrigins() {
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent('https://yts.mx/api/v2/list_movies.json')}`);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Body start:', data.contents.substring(0, 100));
  } catch (e) {
    console.error('Error:', e);
  }
}
testAllOrigins();
