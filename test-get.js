async function testGet() {
  try {
    const res = await fetch('https://yts.lt/api/v2/list_movies.json');
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body start:', text.substring(0, 100));
  } catch (e) {
    console.error('Error:', e);
  }
}
testGet();
