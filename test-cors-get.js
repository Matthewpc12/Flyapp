async function testCorsGet() {
  const res = await fetch('https://yts.lt/api/v2/list_movies.json', {
    method: 'GET',
    headers: {
      'Origin': 'http://localhost:3000'
    }
  });
  console.log('CORS Headers:', res.headers.get('access-control-allow-origin'));
}
testCorsGet();
