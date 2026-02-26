import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const urls = [
    'https://vidsrc.to/embed/movie/tt0111161',
    'https://autoembed.to/movie/imdb/tt0111161',
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
    await new Promise(r => setTimeout(r, 5000));
    
    await page.screenshot({ path: `screenshot-${new URL(url).hostname}.png` });
    console.log(`Saved screenshot-${new URL(url).hostname}.png`);
  }
  
  await browser.close();
})();
