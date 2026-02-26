async function testYtsProxies() {
  const proxies = ['yts.do', 'yts.rs', 'yts.pm', 'yts.unblockit.cat'];
  for (const p of proxies) {
    try {
      const res = await fetch(`https://${p}/api/v2/list_movies.json`);
      console.log(p, 'Status:', res.status);
      const text = await res.text();
      console.log(p, 'Body start:', text.substring(0, 50));
    } catch (e) {
      console.error(p, 'Error:', e.message);
    }
  }
}
testYtsProxies();
