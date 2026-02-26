import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const html = `
    <html>
      <body>
        <iframe id="test-frame" sandbox="allow-scripts allow-same-origin allow-forms" src="https://vidsrc.xyz/embed/movie/tt0111161" width="800" height="600"></iframe>
      </body>
    </html>
  `;
  
  await page.setContent(html);
  await new Promise(r => setTimeout(r, 5000));
  
  const frames = page.frames();
  const frame = frames.find(f => f.url().includes('vidsrc.xyz'));
  if (frame) {
    const text = await frame.evaluate(() => document.body.innerText);
    console.log('Result:', text.substring(0, 100).replace(/\n/g, ' '));
  } else {
    console.log('Frame not found');
  }
  
  await browser.close();
})();
