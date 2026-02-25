async function testVidsrcxyz() {
  const res = await fetch('https://vidsrc.xyz/embed/movie/tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
testVidsrcxyz();
