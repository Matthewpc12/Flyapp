import fs from 'fs';

async function testVidsrc() {
  const res = await fetch('https://vidsrc.to/embed/movie/tt0111161');
  const text = await res.text();
  fs.writeFileSync('vidsrc.html', text);
  console.log('vidsrc.html saved');
}
testVidsrc();
