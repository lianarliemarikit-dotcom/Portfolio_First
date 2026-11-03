import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4174','--strictPort'],{windowsHide:true,stdio:'pipe'});
let browser;
const check=(name,value)=>{assert.ok(value,name);console.log('PASS '+name)};
try{
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:4174')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const fixture=await browser.newPage();
 await fixture.setContent('<h1>TEST FIXTURE ONLY</h1><p>Not a portfolio document.</p>');
 const pdf=await fixture.pdf();
 const fs=await import('node:fs/promises');await fs.mkdir('.tools',{recursive:true});let video;try{video=await fs.readFile('.tools/test-flower.mp4')}catch{const res=await fetch('https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4');if(!res.ok)throw new Error('Cannot download CC0 test video');video=Buffer.from(await res.arrayBuffer());await fs.writeFile('.tools/test-flower.mp4',video);}
 const page=await browser.newPage({reducedMotion:'reduce'});
 await page.route('**/fixtures/test.pdf',route=>route.fulfill({contentType:'application/pdf',body:pdf}));
 await page.route('**/fixtures/test.mp4',route=>route.fulfill({contentType:'video/mp4',body:video}));
 await page.route('**/fixtures/test.svg',route=>route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180"><rect width="320" height="180" fill="#d5fa47"/><text x="20" y="80">TEST FIXTURE</text></svg>'}));
 await page.route('**/src/data/portfolio.ts',async route=>{
  const response=await route.fetch();
  let body=await response.text();
  body+='\ncompilation.pdf="fixtures/test.pdf";compilation.outputCount=7;categories[1].entries.push({title:"TEST documentation",description:"Test-only fixture.",pdf:"fixtures/test.pdf",image:"fixtures/test.svg",repository:"https://example.com/test-repo",technologies:["Java"]});categories[2].entries.push({title:"TEST presentation",description:"Test-only fixture.",video:"fixtures/test.mp4"});categories[3].entries.push({title:"TEST experience",description:"Test-only fixture.",organization:"Test organization",role:"Test role",duration:"Test duration",responsibilities:["Test responsibility"],skills:["Test skill"]});categories[4].entries.push({title:"TEST certificate",description:"Test-only fixture.",image:"fixtures/test.svg",pdf:"fixtures/test.pdf",date:"Test date"});reflections[0].paragraphs.push("TEST reflection paragraph.");\n';
  await route.fulfill({response,body});
 });
 await page.goto('http://127.0.0.1:4174');
 await page.locator('h1').waitFor();
 check('Configured counts reflect data',JSON.stringify(await page.locator('.stat strong').allTextContents())===JSON.stringify(['01','01','01','03']));
 await page.getByRole('button',{name:'View Computer Programming 1 compilation'}).click();
 check('Configured compilation previews',await page.locator('dialog object').getAttribute('data').then(value=>value.endsWith('/fixtures/test.pdf')));
 await page.keyboard.press('Escape');
 await page.locator('.category-trigger').nth(1).click();
 await page.getByRole('button',{name:/TEST documentation/}).click();
 check('Repository link populated',await page.getByRole('link',{name:'View repository'}).getAttribute('href')==='https://example.com/test-repo');
 check('Project image loads',await page.locator('dialog img').evaluate(e=>e.complete&&e.naturalWidth>0));
 check('Documentation PDF available',await page.locator('dialog object').count()===1);
 await page.keyboard.press('Escape');
 await page.locator('.category-trigger').nth(2).click();
 await page.getByRole('button',{name:/TEST presentation/}).click();
 await page.locator('video').evaluate(v=>v.load()); await page.waitForTimeout(1000); await page.locator('video').evaluate(async v=>{v.muted=true;await v.play();});
 await page.waitForTimeout(250);
 check('Video plays with native controls',await page.locator('video').evaluate(v=>v.controls&&!v.paused&&v.currentTime>0));
 await page.keyboard.press('Escape');
 await page.locator('.category-trigger').nth(3).click();
 await page.getByRole('button',{name:/TEST experience/}).click();
 check('Experience details populated',await page.locator('dialog').innerText().then(t=>t.includes('Test responsibility')&&t.includes('Test skill')));
 await page.keyboard.press('Escape');
 await page.locator('.category-trigger').nth(4).click();
 await page.getByRole('button',{name:/TEST certificate/}).click();
 check('Certificate preview populated',await page.locator('dialog img').count()===1&&await page.locator('dialog object').count()===1);
 await page.keyboard.press('Escape');
 check('Authored reflection replaces prompts',await page.locator('.chapter').first().innerText().then(t=>t.includes('TEST reflection paragraph.')&&!t.includes('awaiting my words')));
 console.log('All populated media checks passed; fixtures were browser-only.');
}finally{await browser?.close();server.kill();}
