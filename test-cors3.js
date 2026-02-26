async function testCors() {
  const res = await fetch('https://yts.lt/api/v2/list_movies.json', {
    method: 'OPTIONS',
    headers: {
      'Origin': 'https://my-vercel-app.vercel.app',
      'Access-Control-Request-Method': 'GET'
    }
  });
  console.log('CORS Headers:', res.headers.get('access-control-allow-origin'));
}
testCors();
