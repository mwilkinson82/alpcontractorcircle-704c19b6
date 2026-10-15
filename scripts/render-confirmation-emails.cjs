// Offline browser QA. Run after verify-confirmation-emails.mjs from the repository root.
// Requires Playwright and Microsoft Edge; PLAYWRIGHT_MODULE may point to an existing installation.
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
(async()=>{
 const browser = await chromium.launch({headless:true, channel:'msedge'});
 const results=[];
 for(const name of ['delay-october','delay','delay-company','delay-named-seat','cpm','cpm-fallback']) {
  for(const [label,width,scheme] of [['desktop',800,'light'],['mobile',375,'light'],['dark',375,'dark']]) {
   const page=await browser.newPage({viewport:{width,height:900},colorScheme:scheme});
   await page.route('**/*',route=>route.abort());
   await page.setContent(fs.readFileSync(path.join('artifacts/confirmation-emails',name+'.html'),'utf8'));
   const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,headings:document.querySelectorAll('h1').length,hero:getComputedStyle(document.querySelector('.hero')).backgroundColor}));
   if(metrics.scroll>width) throw Error(name+' '+label+' overflow: '+JSON.stringify(metrics));
   await page.screenshot({path:path.join('artifacts/confirmation-emails',name+'-'+label+'.png'),fullPage:true});
   results.push({name,label,...metrics});
   await page.close();
  }
 }
 fs.writeFileSync('artifacts/confirmation-emails/render-results.json',JSON.stringify(results,null,2));
 await browser.close(); console.log('PASS: 18 offline Edge renders; no horizontal overflow at 375px or 800px.');
})().catch(e=>{console.error(e);process.exit(1)});
