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
  await page.goto('https://web.whatsapp.com/');
  const newChat = await page.waitForSelector('div[title="New chat"]', {
    visible: true,
  });                                       // --> <<New Chat>>
  await newChat.click();
  const name = await page.waitForSelector('div[dir="ltr"]');    // --> <<Search Name>>
  await name.type("Michael Valentine");
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('div._1MZWu')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('michael valentine'));
    element.click();
  });
  await page.waitForTimeout(3000);
  const typeMessage = await page.waitForSelector('div._1awRl"]');    // --> <<Type Message>>
  await typeMessage.type("testing");
  await page.keyboard.press('Enter');
  
    
  // while (i = undefined) {
  //   const newChat = await page.waitForSelector('div[title="New chat"]');    // --> <<New Chat>>
  //   i = newChat };
  // console.log("hello");
})();