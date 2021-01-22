const puppeteer = require('puppeteer');

(async () => {

  const browser = await puppeteer.launch({ headless: false });  // --> <<Browser>>
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
    await passwordButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
    ]);
  const locationButton = await page.waitForSelector('a[class="ca cb cc bc cd ce cf cg ch ag be bf bj ci cj ck ba"]', {
    visible: true,
  });                                    //  --> <<Location Button>>
  await Promise.all([
    await locationButton.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
    ]);
  await page.waitForTimeout(1000);
  const changelocation = await page.waitForSelector('a[class="bc cd ce cf cg ch ca cb cc ag io cj ka bf ba g5 d1"]', {
  visible: true,
  });
  console.l                                  //  --> <<Change Location Button>>
  await Promise.all([
    await changelocation.click(),
    page.waitForNavigation({waitUntil:'networkidle2'})
    ]); //
})();
