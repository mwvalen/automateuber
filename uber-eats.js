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
  await page.goto('https://www.ubereats.com/');
  const button = await page.waitForSelector('a[data-test="header-sign-in"]', {
    visible: true,
  });                                       // --> <<Button>>
  await Promise.all([
    await button.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
    ]);
  const username = await page.waitForSelector('input[name="textInputValue"]');    // --> <<Username>>
  await username.type("dev.michael.valentine@gmail.com");
  await page.waitForTimeout(1000);
  const nextButton = await page.waitForSelector('button[class="btn btn--arrow btn--full"]', {
    visible: true,
  });                                                                 // -->  <<Username Button>>
  await Promise.all([
    await nextButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
    ]);
  const password = await page.waitForSelector('input[name="password"]');     // -->  <<Password>>
  await password.type("A.a.12345");
  await page.waitForTimeout(1000);
  const passwordButton = await page.waitForSelector('button[class="btn btn--arrow btn--full push--top"]', {
    visible: true,
  });                                   // --> <<Password Button>>
  await Promise.all([
    passwordButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
    ]);
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
  await page.evaluate(() => {
    const elements = [...document.querySelectorAll('button')];
    const element = elements.find(element => element.innerHTML.toLowerCase().includes('signature pizzas'));
    if (element === undefined) {
      page.evaluate(() => {
        const elements = [...document.querySelectorAll('button')];
        const element = elements.find(element => element.innerHTML.toLowerCase().includes('more'));
        element.click();
      });
      page.waitForTimeout(2000);
      page.evaluate(() => {
        const elements = [...document.querySelectorAll('div.f6.nd.ba.lk.lj.ne')];
        const element = elements.find(element => element.innerHTML.toLowerCase().includes('signature pizzas'));
        element.click();
      });      
      } else {
      element.click();
      };
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
  await page.waitForTimeout(5000);
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

