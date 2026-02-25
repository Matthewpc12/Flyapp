async function testMultiembed() {
  const res = await fetch('https://multiembed.mov/directstream.php?video_id=tt0111161');
  const text = await res.text();
  console.log(text.includes('sandbox'));
}
testMultiembed();
