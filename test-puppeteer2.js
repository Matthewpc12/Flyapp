import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const urls = [
    'https://vidsrc.xyz/embed/movie/tt0111161',
    'https://vidsrc.me/embed/movie?imdb=tt0111161',
    'https://vidsrc.in/embed/movie/tt0111161',
    'https://vidsrc.pm/embed/movie/tt0111161',
    'https://vidsrc.net/embed/movie/tt0111161',
    'https://player.smashy.stream/movie/tt0111161',
    'https://vidsrc.rip/embed/movie/tt0111161',
    'https://vidsrc.pro/embed/movie/tt0111161',
    'https://2embed.org/embed/movie?imdb=tt0111161'
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
