async function testMoviesapi() {
  const res = await fetch('https://moviesapi.club/movie/tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
testMoviesapi();
