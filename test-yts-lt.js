async function testYtsLt() {
  const res = await fetch('https://yts.lt/api/v2/list_movies.json');
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
}
testYtsLt();
