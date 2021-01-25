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

const selectors = {
  signInButton: 'a[data-test="header-sign-in"]',
  usernameSelector: 'input[name="textInputValue"]',
  usernameNextButtonSelector: 'button[class="btn btn--arrow btn--full"]',
  passwordSelector: 'input[name="password"]',
  submitPasswordButton: 'button[class="btn btn--arrow btn--full push--top"]'
}

launchSettings['windowSize'] = `--window-size=${launchSettings.windowWidth},${launchSettings.windowHeight}`;

(async () => {
  const page = await openAndNavigateTo('https://www.ubereats.com/', launchSettings);
  await logIn(userCredentials, page);
  

  const searchBar = await page.waitForSelector('#search-suggestions-typeahead-input');  // --> <<Search Bar>>
  await searchBar.type("Pizza pizza");
  await Promise.all([
    page.keyboard.press('Enter'),
    page.waitForNavigation({ waitUntil: 'networkidle2' }),
  ]);
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('p')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('pizza pizza'));
    element.click();
  });
  await page.waitForTimeout(3000);
  await page.evaluate(async () => {
    const elements = [...document.querySelectorAll('button')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('signature pizzas'));
  });

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

  await page.waitForTimeout(1000);
  const thirdChoice = await page.waitForSelector('#main-content > div.b7.b8.b9.ba.bb > ul > li:nth-child(6) > ul > li:nth-child(3) > div > div > div > div.ag.cu.ah.cw > div.c9 > h4 > div');  // --> <<Third Choice>>
  thirdChoice.click();
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('div.ca.cb.cc')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('large'));
    element.click();
  });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('div.cu.an')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('to order'));
    element.click();
  });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('a.ag.e4.bf.lp.cw')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('checkout'));
    element.click();
  });
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('div.cv.cp.cc.l9.ba')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('15%'));
    element.click();
  });

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
  const passwordButton = await page.waitForSelector(selectors.submitPasswordButton);                                   // --> <<Password Button>>
  await Promise.all([
    passwordButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
  ]);
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