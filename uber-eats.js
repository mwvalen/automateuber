const puppeteer = require('puppeteer');

// SETTINGS ******************************************************************************************** //

const launchSettings = {
  fullscreen: false,
  windowWidth: 1400,
  windowHeight: 1000
}

const userCredentials = {
  username: "",
  password: ""
}

const orderDetails = {
  restaurant: "pizza pizza",
  size: "large",
  tip: "15%"
}

const selectors = {
  signInButton: 'a[data-test="header-sign-in"]',
  usernameSelector: 'input[name="textInputValue"]',
  usernameNextButtonSelector: 'button[class="btn btn--arrow btn--full"]',
  passwordSelector: 'input[name="password"]',
  submitPasswordButton: 'button[class="btn btn--arrow btn--full push--top"]',
  foodSearchBar: '#search-suggestions-typeahead-input'
}

launchSettings['windowSize'] = `--window-size=${launchSettings.windowWidth},${launchSettings.windowHeight}`;

// ********************************************************************************************************* //



(async () => {
  const page = await openAndNavigateTo('https://www.ubereats.com/', launchSettings);
  await logIn(userCredentials, page);
  await orderPizza(orderDetails, page);
})();



async function openAndNavigateTo (url, settings) {
  let launchArgs = '';
  launchArgs += settings.windowSize;
  if (settings.fullscreen) launchArgs += '--start-fullscreen';
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: [launchArgs] });
  const page = await browser.newPage();
  await page.goto(url);
  return page;
};

async function logIn ({ username, password }, page) {
  const button = await page.waitForSelector(selectors.signInButton);
  await Promise.all([
    button.click(),
    page.waitForNavigation({ waitUntil:'networkidle2' })
  ]);
  const usernameInput = await page.waitForSelector(selectors.usernameSelector);    // --> <<Username>>
  await usernameInput.type(username);
  await page.waitForTimeout(1000);
  const nextButton = await page.waitForSelector(selectors.usernameNextButtonSelector);     // -->  <<Username Button>>
  await Promise.all([
    await nextButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
  ]);
  const passwordInput = await page.waitForSelector(selectors.passwordSelector);     // -->  <<Password>>
  await passwordInput.type(password);
  await page.waitForTimeout(1000);
  const passwordButton = await page.waitForSelector(selectors.submitPasswordButton);   // --> <<Password Button>>
  await Promise.all([
    passwordButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
  ]);
}

async function orderPizza ({ restaurant, size, tip }, page) {
  try {
    const searchBar = await page.waitForSelector(selectors.foodSearchBar);  // --> <<Search Bar>>
    await searchBar.type(restaurant);
    await Promise.all([
      page.keyboard.press('Enter'),
    ]);
    let element = await getElementByInnerHtml('p', restaurant, page)  // --> <<Chosen Restaurant>>
    await page.evaluate(e => e.click(), element);

    element = await getElementByInnerHtml('button', 'signature pizzas', page) // --> <<Signature Pizzas>>
    await page.evaluate(e => e.click(), element);

    element = await getElementByInnerHtml('h2', 'signature pizzas', page) 
    await page.evaluate(e => {                                                // --> <<Third Choice>>
      const sigPizzasList = e.nextSibling;
      const chosenItem = sigPizzasList.children[2];
      chosenItem.children[0].click()
    }, element);

    element = await getElementByInnerHtml('label', size, page)  // --> <<Size>>
    await page.evaluate(e => e.click(), element);

    element = await getElementByInnerHtml('button', 'to order', page)  // --> <<Order Button>>
    await page.evaluate(e => e.click(), element);

    await page.waitForTimeout(2000);
    await page.evaluate(() => window.location.href="/checkout");   // --> <<Go To Checkout>>

    await page.waitForTimeout(1000);
    element = await getElementByInnerHtml('div[role="radio"]', tip, page) // --> <<Tip>>
    await page.evalute(e => e.click(), element);
  } catch (e) {
    console.error(e);
  }
}


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