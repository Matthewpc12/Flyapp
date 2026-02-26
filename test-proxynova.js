async function testProxyNova() {
  try {
    const res = await fetch('https://yts.proxynova.com/api/v2/list_movies.json');
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body start:', text.substring(0, 50));
  } catch (e) {
    console.error('Error:', e.message);
  }
}
testProxyNova();
