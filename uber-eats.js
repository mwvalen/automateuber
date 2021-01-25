const puppeteer = require('puppeteer');

const launchSettings = {
  fullscreen: false,
  windowWidth: 1400,
  windowHeight: 1000
}

const userCredentials = {
  username: "dev.michael.valentine@gmail.com",
  password: "A.a.12345"
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
  foodSearchBar: '#search-suggestions-typeahead-input',
  thirdChoice: '#main-content > div.b7.b8.b9.ba.bb > ul > li:nth-child(6) > ul > li:nth-child(3) > div > div > div > div.ag.cu.ah.cw > div.c9 > h4 > div'
}

launchSettings['windowSize'] = `--window-size=${launchSettings.windowWidth},${launchSettings.windowHeight}`;

(async () => {
  const page = await openAndNavigateTo('https://www.ubereats.com/', launchSettings);
  await logIn(userCredentials, page);
  await orderPizza(orderDetails, page);
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

async function logIn ({ username, password }, page) {
  const button = await page.waitForSelector(selectors.signInButton);
  await Promise.all([
    button.click(),
    page.waitForNavigation({ waitUntil:'networkidle2' })
  ]);
  const usernameInput = await page.waitForSelector(selectors.usernameSelector);    // --> <<Username>>
  await usernameInput.type(username);
  await page.waitForTimeout(1000);
  const nextButton = await page.waitForSelector(selectors.usernameNextButtonSelector);                                                                 // -->  <<Username Button>>
  await Promise.all([
    await nextButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
  ]);
  const passwordInput = await page.waitForSelector(selectors.passwordSelector);     // -->  <<Password>>
  await passwordInput.type(password);
  await page.waitForTimeout(1000);
  const passwordButton = await page.waitForSelector(selectors.submitPasswordButton);             // --> <<Password Button>>
  await Promise.all([
    passwordButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
  ]);
}

async function orderPizza ({ restaurant, size, tip }, page) {
  const searchBar = await page.waitForSelector(selectors.foodSearchBar);  // --> <<Search Bar>>
  await searchBar.type(restaurant);
  await Promise.all([
    page.keyboard.press('Enter'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  await page.waitForTimeout(3000);
  await page.evaluate((restaurant) => {
    const elements = [...document.querySelectorAll('p')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes(restaurant));
    element.click();
  },restaurant);
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('button')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('signature'));
    element.click();
  });
  await page.waitForTimeout(3000);
  const pizzaChoice = await page.waitForSelector(selectors.thirdChoice);  // --> <<Third Choice>>
  pizzaChoice.click();
  await page.waitForTimeout(3000);
  await page.evaluate((size) => {
    const elements = [...document.querySelectorAll('label')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes(size));
    element.click();
  },size);
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('button')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('to order'));
    element.click();
  });
  await page.waitForTimeout(4000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('a[rel="nofollow"]')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('checkout'));
    element.click();
  });
  await page.waitForTimeout(3000);
  await page.evaluate((tip) => {
    const elements = [...document.querySelectorAll('div[role="radio"]')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes(tip));
    element.click();
  },tip);
}

  // const locationButton = await page.waitForSelector('a[class="ca cb cc bc cd ce cf cg ch ag be bf bj ci cj ck ba"]', {
  //   visible: true,
  // });                                    //  --> <<Location Button>>
  // await locationButton.click();    
  // const changelocation = await page.waitForSelector('a[class="bc cd ce cf cg ch ca cb cc ag io cj ka bf ba g5 d1"]');                                 //  --> <<Change Location Button>>
  // await Promise.all([
  //   changelocation.click()
  //   ]); 
  // await page.waitForTimeout(3000);
  // const location = await page.waitForSelector('input[name="searchTerm"]');      // -->  <<Location>>

  // // //console.log("hello",location);
  // //await location.click();
  // await location.keyboard.type("CN Tower");
                //******************************** */
  // await page.waitForTimeout(3000);
  // await page.evaluate(() => {
  //   console.log('mwv 0')
  //   const elements = [...document.querySelectorAll('h2')];
  //   console.log('mwv 1')
  //   const element = elements.find(element => element.innerHTML.toLowerCase().includes('signature pizzas'));
  //   console.log('mwv 2')
  //   const signaturePizzasUl = element.nextSibling;
  //   console.log('mwv 3')
  //   const signaturePizzasLis = signaturePizzasUl.children;
  //   console.log('mwv 4')
  //   console.log('signature pizza lis', signaturePizzasLis);
  //   // element.click();
  // })