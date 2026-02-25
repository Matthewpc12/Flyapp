async function testVidsrccc() {
  const res = await fetch('https://vidsrc.cc/v2/embed/movie/tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
testVidsrccc();
