const puppeteer = require('puppeteer');

const launchSettings = {
  fullscreen: false,
  windowWidth: 1400,
  windowHeight: 1000
}

const communication = {
  receipentName: "Michael Valentine",
  messageText: "a"+"hello"
}
const selectors = {
  newMessageButton: 'div[title="New chat"]',
  nameSelector: 'div[dir="ltr"]',
  messageSelector: 'div._2HE1Z._1hRBM'
}

launchSettings['windowSize'] = `--window-size=${launchSettings.windowWidth},${launchSettings.windowHeight}`;

(async () => {
  const page = await openAndNavigateTo('https://web.whatsapp.com/', launchSettings);
  await page.waitForTimeout(10000);
  await sendMessage(communication, page);
})();
    

async function openAndNavigateTo (url, settings) {
  let launchArgs = '';
  launchArgs += settings.windowSize;  // --> 
  if (settings.fullscreen) launchArgs += '--start-fullscreen';
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: [launchArgs] });  // --> <<Browser>>
  const page = await browser.newPage();  // --> <<Page>>
  await page.goto(url);
  return page;
};

async function sendMessage ({ receipentName, messageText }, page) {
  const newChat = await page.waitForSelector(selectors.newMessageButton);                              // --> <<New Chat>>
  await newChat.click();
  const name = await page.waitForSelector(selectors.nameSelector);    // --> <<Search Name>>
  await name.type(receipentName);
  await page.waitForTimeout(3000);
  await page.evaluate((receipentName) => {
    const elements = [...document.querySelectorAll('div._3Pwfx')];
    const element = elements.find(element => element.innerHTML.includes(receipentName));
    element.click();
  },receipentName);
  await page.waitForTimeout(3000);
  const typeMessage = await page.waitForSelector(selectors.messageSelector);    // --> <<Type Message>>
  await typeMessage.type(messageText);
  await page.keyboard.press('Enter');
  };

  // while (i = undefined) {
  //   const newChat = await page.waitForSelector('div[title="New chat"]');    // --> <<New Chat>>
  //   i = newChat };
  // console.log("hello");
