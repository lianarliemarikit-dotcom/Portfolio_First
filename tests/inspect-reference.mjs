import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--allow-file-access-from-files']});
const page=await browser.newPage({viewport:{width:1280,height:800}});
await page.goto('file:///C:/Users/Arlie/Downloads/e96e2680-c6df-494a-92d3-3808b07f6cf0.mp4');
await page.waitForSelector('video');
await page.evaluate(async()=>{const v=document.querySelector('video');v.pause(); if(v.readyState<1) await new Promise(r=>v.addEventListener('loadedmetadata',r,{once:true}));});
for (const time of [6,18,35,62,85]) {
 await page.evaluate(async t=>{const v=document.querySelector('video');await new Promise(r=>{v.addEventListener('seeked',r,{once:true});v.currentTime=t;});},time);
 await page.screenshot({path:'test-results/reference-'+time+'.png'});
}
await browser.close();
console.log('Reference frames captured.');
