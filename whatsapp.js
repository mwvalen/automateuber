const puppeteer = require('puppeteer');

const fullscreen = false;

const windowWidth=1400;
const windowHeight=1080;

const windowSize = `--window-size=${windowWidth},${windowHeight}`;

(async () => {
  let launchArgs = ''
  launchArgs += windowSize
  if (fullscreen) launchArgs += '--start-fullscreen'
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: [launchArgs] });  // --> <<Browser>>
  const page = await browser.newPage();  // --> <<Page>>
  await page.goto('https://web.whatsapp.com/')
  const firstPane = await page.waitForSelector('#pane-side > div:nth-child(1) > div > div > div:nth-child(1)');  //  -->  <<First Pane>>
  console.log("hello");
  await firstPane.click();
})();