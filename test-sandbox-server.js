import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send(`
    <html>
      <body>
        <h1>Test Sandbox</h1>
        <iframe sandbox="allow-scripts allow-same-origin" src="https://vidsrc.to/embed/movie/tt0111161" width="600" height="400"></iframe>
        <iframe sandbox="allow-scripts allow-same-origin" src="https://vidlink.pro/movie/tt0111161" width="600" height="400"></iframe>
        <iframe sandbox="allow-scripts allow-same-origin" src="https://embed.su/embed/movie/tt0111161" width="600" height="400"></iframe>
        <iframe sandbox="allow-scripts allow-same-origin" src="https://autoembed.to/movie/imdb/tt0111161" width="600" height="400"></iframe>
        <iframe sandbox="allow-scripts allow-same-origin" src="https://multiembed.mov/directstream.php?video_id=tt0111161" width="600" height="400"></iframe>
      </body>
    </html>
  `);
});

app.listen(3001, () => console.log('Listening on 3001'));
