import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const urls = [
    'https://vidsrc.to/embed/movie/tt0111161',
    'https://vidlink.pro/movie/tt0111161',
    'https://embed.su/embed/movie/tt0111161',
    'https://autoembed.to/movie/imdb/tt0111161',
    'https://multiembed.mov/directstream.php?video_id=tt0111161',
    'https://vidsrc.cc/v2/embed/movie/tt0111161',
    'https://moviesapi.club/movie/tt0111161',
    'https://www.2embed.cc/embed/tt0111161'
  ];

  for (const url of urls) {
    console.log('Testing', url);
    const html = `
      <html>
        <body>
          <iframe id="test-frame" sandbox="allow-scripts allow-same-origin" src="${url}" width="800" height="600"></iframe>
        </body>
      </html>
    `;
    
    await page.setContent(html);
    await new Promise(r => setTimeout(r, 3000));
    
    const frames = page.frames();
    const frame = frames.find(f => f.url().includes(new URL(url).hostname));
    if (frame) {
      try {
        const text = await frame.evaluate(() => document.body.innerText);
        console.log('Result:', text.substring(0, 100).replace(/\n/g, ' '));
      } catch (e) {
        console.log('Error evaluating frame:', e.message);
      }
    } else {
      console.log('Frame not found');
    }
  }
  
  await browser.close();
})();
