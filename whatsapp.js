const puppeteer = require('puppeteer');

const launchSettings = {
  fullscreen: false,
  windowWidth: 1400,
  windowHeight: 1000
}

const communication = {
  receipentName: "Anton Fisher",
  messageText: "testing"
}
const selectors = {
  newMessageButton: 'div[title="New chat"]',
  nameSelector: 'div[dir="ltr"]',
  messageSelector: 'div._2HE1Z._1hRBM'
}

launchSettings['windowSize'] = `--window-size=${launchSettings.windowWidth},${launchSettings.windowHeight}`;

(async () => {
  const page = await openAndNavigateTo('https://web.whatsapp.com/', launchSettings);
  // await page.waitForTimeout(10000);
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
  await newChat.evaluate(e => e.click())
  const name = await page.waitForSelector(selectors.nameSelector);    // --> <<Search Name>>
  await name.type(receipentName);
  let element = await getElementByInnerHtml('div._3Pwfx', receipentName.toLowerCase(), page);
  element.click();
  await typeMessage(messageText, page)
  await page.keyboard.press('Enter');
  };

// HELPERS

async function getElementByInnerHtml (selector, value, page) {
  let e = await page.evaluateHandle(async ({ selector, value }) => {
      let element = null;
      let waitTime = 0;
      while (!element && waitTime < 10000) {
        await new Promise(res => setTimeout(res, 500));
        waitTime += 500
        const elements = [...document.querySelectorAll(selector)];
        element = elements.find(element => element.innerHTML.toLowerCase().includes(value));
      }
      // console.log({ element, waitTime })
      return element;
  }, { selector, value })
  return e
}

async function typeMessage(messageText, page) {
  const messageBox = await page.waitForSelector(selectors.messageSelector);    // --> <<Type Message>>
  await page.waitForTimeout(1000);
  await messageBox.type("a" + messageText);
}
