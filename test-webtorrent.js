import WebTorrent from 'webtorrent';

const client = new WebTorrent();
const magnet = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com';

client.add(magnet, (torrent) => {
  console.log('Torrent ready:', torrent.name);
  const file = torrent.files.find(f => f.name.endsWith('.mp4'));
  console.log('Selected file:', file.name, file.length);
  
  let downloaded = 0;
  const stream = file.createReadStream({ start: 0, end: 1024 * 1024 });
  
  stream.on('data', (chunk) => {
    downloaded += chunk.length;
    console.log(`Downloaded ${downloaded} bytes`);
    if (downloaded >= 1024 * 1024) {
      console.log('Successfully downloaded 1MB');
      client.destroy();
      process.exit(0);
    }
  });
});

setTimeout(() => {
  console.log(`Timeout reached.`);
  client.destroy();
  process.exit(1);
}, 10000);
