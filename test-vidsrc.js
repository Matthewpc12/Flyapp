async function testVidsrc() {
  const res = await fetch('https://vidsrc.to/embed/movie/tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
testVidsrc();
