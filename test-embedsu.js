async function testEmbedsu() {
  const res = await fetch('https://embed.su/embed/movie/tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
testEmbedsu();
