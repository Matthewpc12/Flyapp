async function testCodetabsParams() {
  try {
    const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=https://movies-api.accel.li/api/v2/list_movies.json&page=2`);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Page:', data.data.page_number);
  } catch (e) {
    console.error('Error:', e.message);
  }
}
testCodetabsParams();
