async function test2embed() {
  const res = await fetch('https://www.2embed.cc/embed/tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
test2embed();
