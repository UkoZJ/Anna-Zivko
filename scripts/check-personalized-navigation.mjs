// Browser regression using only synthetic invitation data and a stub private form.
import {createServer} from 'vite';
import {pathToFileURL} from 'node:url';
const {chromium}=process.env.PLAYWRIGHT_MODULE_PATH?await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE_PATH).href):await import('playwright');
const server=await createServer({server:{host:'127.0.0.1',port:5173,strictPort:false},logLevel:'silent'});
await server.listen();
const origin='http://127.0.0.1:'+server.httpServer.address().port;
const browser=await chromium.launch({headless:true,channel:'msedge'});
const token='a'.repeat(64);
let failures=0;
try {
 for(const variant of ['A','B','C'])for(const [name,selector] of [
  ['header','header .header-actions .button'],['hero','#home-confirmation'],['section','#open-rsvp'],
 ]) {
  const page=await browser.newPage();
  // Isolate the test server's random port from the fixed development allowlist.
  await page.route('**/src/navigation.js',async route=>{
   const response=await route.fetch();
   await route.fulfill({response,body:(await response.text()).replace('http://127.0.0.1:5173/',origin+'/')});
  });
  let opened=false;
  await page.route('https://script.google.com/**',async route=>{
   const url=new URL(route.request().url());
   opened=url.searchParams.get('invite')===token;
   await route.fulfill({contentType:'text/html',body:'<h1>Synthetic private form</h1>'});
  });
  await page.goto(`${origin}/?variant=${variant}#invite=${token}`);
  await page.locator(selector).click();
  await page.waitForTimeout(150);
  const passed=opened&&await page.locator('h1').textContent()==='Synthetic private form';
  console.log(`${passed?'PASS':'FAIL'} ${variant}/${name}: personalized confirmation opens private form`);
  if(!passed)failures++;
  await page.close();
 }
 for(const selector of ['#header-confirmation','#home-confirmation']) {
  const page=await browser.newPage();let opened=false;
  await page.route('https://script.google.com/**',async route=>{opened=true;await route.abort();});
  await page.goto(origin+'/');await page.locator(selector).click();
  const passed=!opened&&new URL(page.url()).hash==='#rsvp'&&(await page.locator('#rsvp-message').textContent()).length>15;
  console.log(`${passed?'PASS':'FAIL'} generic ${selector}: shows personal-link instructions`);
  if(!passed)failures++;
  await page.close();
 }
} finally {await browser.close();await server.close();}
if(failures)process.exitCode=1;
