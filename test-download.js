import torrentStream from 'torrent-stream';

const magnet = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com';

const engine = torrentStream(magnet);

engine.on('ready', () => {
  console.log('Engine ready');
  const file = engine.files.reduce((a, b) => a.length > b.length ? a : b);
  console.log('Selected file:', file.name, file.length);
  
  let downloaded = 0;
  const stream = file.createReadStream({ start: 0, end: 1024 * 1024 }); // Try to read 1MB
  
  stream.on('data', (chunk) => {
    downloaded += chunk.length;
    console.log(`Downloaded ${downloaded} bytes`);
    if (downloaded >= 1024 * 1024) {
      console.log('Successfully downloaded 1MB');
      engine.destroy();
      process.exit(0);
    }
  });
  
  setTimeout(() => {
    console.log(`Timeout reached. Downloaded ${downloaded} bytes`);
    engine.destroy();
    process.exit(1);
  }, 10000);
});

engine.on('download', (piece) => {
  console.log('Downloaded piece', piece);
});
