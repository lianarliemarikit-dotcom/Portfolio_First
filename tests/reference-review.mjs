import { chromium } from 'playwright';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
await mkdir('test-results/review',{recursive:true});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true,args:['--allow-file-access-from-files']});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('file:///C:/Users/Arlie/Downloads/e96e2680-c6df-494a-92d3-3808b07f6cf0.mp4');
await page.waitForSelector('video');
await page.evaluate(async()=>{const v=document.querySelector('video');v.pause();if(v.readyState<1)await new Promise(r=>v.addEventListener('loadedmetadata',r,{once:true}));});
console.log(await page.evaluate(()=>{const v=document.querySelector('video');return {width:v.videoWidth,height:v.videoHeight,duration:v.duration}}));
for(const start of [0,48]){
 const result=await page.evaluate(async start=>{
  const v=document.querySelector('video'),c=document.createElement('canvas');c.width=1920;c.height=1200;const ctx=c.getContext('2d');ctx.fillStyle='#222';ctx.fillRect(0,0,c.width,c.height);
  for(let i=0;i<16;i++){const t=start+i*3+.2;await new Promise(r=>{v.addEventListener('seeked',r,{once:true});v.currentTime=t;});const x=(i%4)*480,y=Math.floor(i/4)*300;ctx.drawImage(v,x,y,480,270);ctx.fillStyle='white';ctx.font='16px Arial';ctx.fillText(t.toFixed(1)+' seconds',x+10,y+290);}
  return c.toDataURL('image/jpeg',.9).split(',')[1];
 },start);
 await writeFile('test-results/review/timeline-'+start+'.jpg',Buffer.from(result,'base64'));
}
for(const t of [25,28,49,53,66,72,78,89,92]){
 const image=await page.evaluate(async t=>{const v=document.querySelector('video');await new Promise(r=>{v.addEventListener('seeked',r,{once:true});v.currentTime=t;});const c=document.createElement('canvas');c.width=v.videoWidth;c.height=v.videoHeight;c.getContext('2d').drawImage(v,0,0);return c.toDataURL('image/jpeg',.92).split(',')[1];},t);
 await writeFile('test-results/review/frame-'+t+'.jpg',Buffer.from(image,'base64'));
}
const folders=await readdir('Pictures');const files=[];
for(const folder of folders){for(const name of await readdir(path.join('Pictures',folder))){if(/\.(png|jpe?g)$/i.test(name))files.push({folder,name,url:'file:///'+path.resolve('Pictures',folder,name).replaceAll('\\','/')});}}
for(let start=0;start<files.length;start+=12){
 const list=files.slice(start,start+12);
 const data=await page.evaluate(async list=>{const c=document.createElement('canvas');c.width=1800;c.height=1600;const ctx=c.getContext('2d');ctx.fillStyle='#ddd';ctx.fillRect(0,0,c.width,c.height);
 for(let i=0;i<list.length;i++){const item=list[i],img=new Image();img.src=item.url;await img.decode();const x=(i%3)*600,y=Math.floor(i/3)*400;const scale=Math.min(580/img.width,355/img.height);ctx.drawImage(img,x+(600-img.width*scale)/2,y,img.width*scale,img.height*scale);ctx.fillStyle='#111';ctx.font='14px Arial';ctx.fillText(item.folder+' / '+item.name.slice(0,55),x+8,y+378);}
 return c.toDataURL('image/jpeg',.9).split(',')[1];},list);
 await writeFile('test-results/review/assets-'+start+'.jpg',Buffer.from(data,'base64'));
}
await browser.close();console.log('Video and asset review sheets ready.');
