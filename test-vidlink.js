async function testVidlink() {
  const res = await fetch('https://vidlink.pro/movie/tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
testVidlink();
