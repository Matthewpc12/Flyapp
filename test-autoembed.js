async function testAutoembed() {
  const res = await fetch('https://autoembed.to/movie/imdb/tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
testAutoembed();
