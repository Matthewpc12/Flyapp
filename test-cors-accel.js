async function testCorsAccel() {
  const res = await fetch('https://movies-api.accel.li/api/v2/list_movies.json', {
    method: 'GET',
    headers: {
      'Origin': 'http://localhost:3000'
    }
  });
  console.log('CORS Headers:', res.headers.get('access-control-allow-origin'));
}
testCorsAccel();
