const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ['--start-fullscreen'] });  // --> <<Browser>>
  const page = await browser.newPage();  // --> <<Page>>
  page.setDefaultNavigationTimeout(0);
  page.setDefaultTimeout(0);
  await page.goto('https://web.whatsapp.com/')
  const firstPane = await page.waitForSelector('#pane-side > div:nth-child(1) > div > div > div:nth-child(1)');  //  -->  <<First Pane>>
  console.log("hello");
  await firstPane.click();
})();