import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
await mkdir('test-results/navigation',{recursive:true});
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','--host','127.0.0.1','--port','4175','--strictPort'],{windowsHide:true,stdio:'pipe'});
let browser;
const errors=[];
const check=(label,value)=>{assert.ok(value,label);console.log('PASS '+label)};
try{
 for(let i=0;i<60;i++){try{if((await fetch('http://127.0.0.1:4175')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({executablePath:process.env.BROWSER_PATH||'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4175/');
 const nav=page.getByRole('navigation',{name:'Main navigation',exact:true});
 await page.locator('.nav-indicator').waitFor();
 check('Home is initially active',await nav.getByRole('link',{name:'Home',exact:true}).getAttribute('aria-current')==='location');
 await nav.getByRole('link',{name:'Works',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('.header-nav a[aria-current="location"]')?.getAttribute('href')==='#works');
 check('Active section follows navigation',await nav.getByRole('link',{name:'Works',exact:true}).getAttribute('aria-current')==='location');
 check('Navigation remains pinned',await page.locator('.header').evaluate(e=>Math.abs(e.getBoundingClientRect().top)<1));
 check('Section is below navigation',await page.locator('#works').evaluate(e=>e.getBoundingClientRect().top>=document.querySelector('.header').getBoundingClientRect().height));
 check('Yellow page progress updates',await page.locator('.nav-progress > span').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).a>0));
 if(await page.getByRole('button',{name:'Maximize view',exact:true}).count()){
  await page.getByRole('button',{name:'Maximize view',exact:true}).click();
  await page.waitForFunction(()=>!!document.fullscreenElement);
  check('Maximize enters fullscreen',await page.getByRole('button',{name:'Restore view',exact:true}).getAttribute('aria-pressed')==='true');
  await page.getByRole('button',{name:'Restore view',exact:true}).click();
  await page.waitForFunction(()=>!document.fullscreenElement);
  check('Restore exits fullscreen',await page.getByRole('button',{name:'Maximize view',exact:true}).count()===1);
 }
 for(const width of [320,390,768,1440]){
  await page.setViewportSize({width,height:900});
  check('All five navigation links fit at '+width,await nav.locator('a').evaluateAll(list=>list.length===5&&list.every(e=>{const r=e.getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth})));
  check('No horizontal overflow at '+width,await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 }
 await page.locator('.header').screenshot({path:'test-results/navigation/desktop-header.png'});
 await page.setViewportSize({width:390,height:844});
 await page.locator('.header').screenshot({path:'test-results/navigation/mobile-header.png'});
 const animated=await browser.newPage({viewport:{width:1280,height:850}});
 animated.on('pageerror',e=>errors.push(e.message));
 await animated.goto('http://127.0.0.1:4175/');
 await animated.getByRole('button',{name:'Skip intro'}).click();
 await animated.waitForTimeout(1600);
 check('Headline stagger completes',await animated.locator('.hero-copy h1 > span').evaluateAll(list=>list.every(e=>getComputedStyle(e).opacity==='1')));
 const animatedNav=animated.getByRole('navigation',{name:'Main navigation',exact:true});
 await animatedNav.getByRole('link',{name:'About',exact:true}).hover();
 await animated.waitForTimeout(550);
 const aligned=()=>animated.locator('.header-nav').evaluate(nav=>{const link=nav.querySelector('[data-section="about"]'),line=nav.querySelector('.nav-indicator');return Math.abs(line.getBoundingClientRect().left-link.getBoundingClientRect().left-8)<2});
 check('Yellow underline glides to hover target',await aligned());
 await animated.getByRole('button',{name:'Menu',exact:true}).focus();
 await animatedNav.getByRole('link',{name:'About',exact:true}).focus();
 await animated.waitForTimeout(550);
 check('Yellow underline supports keyboard focus',await aligned());
 await animated.locator('.category-trigger').first().click();
 await animated.waitForTimeout(100);
 const during=await animated.locator('#category-performance').evaluate(e=>e.getBoundingClientRect().height);
 await animated.waitForTimeout(700);
 const full=await animated.locator('#category-performance').evaluate(e=>e.getBoundingClientRect().height);
 check('Academic panel expands smoothly',during>0&&full>during);
 await animated.locator('.category-trigger').first().click();
 await animated.waitForTimeout(500);
 check('Collapsed panel hides its controls',await animated.locator('#category-performance').evaluate(e=>e.hidden&&e.inert));
 await animated.getByRole('button',{name:'Menu',exact:true}).click();
 await animated.waitForTimeout(900);
 check('Menu links finish their stagger',await animated.locator('.menu-layout nav a').evaluateAll(list=>list.every(e=>getComputedStyle(e).opacity==='1')));
 await animated.keyboard.press('Escape');
 await animated.waitForTimeout(350);
 check('Animated menu closes cleanly',await animated.locator('dialog[open]').count()===0);
 check('No navigation or animation runtime errors',errors.length===0);
}finally{await browser?.close();server.kill()}
