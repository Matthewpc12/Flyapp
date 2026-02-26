async function testCodetabs2() {
  try {
    const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent('https://movies-api.accel.li/api/v2/list_movies.json')}`);
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Body start:', text.substring(0, 50));
  } catch (e) {
    console.error('Error:', e.message);
  }
}
testCodetabs2();
