import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import mammoth from 'mammoth';
import { chromium } from 'playwright';

const images={};
for(const folder of await readdir('Pictures')){
 for(const name of await readdir(path.join('Pictures',folder))){
  if(!/\.(png|jpe?g)$/i.test(name))continue;
  const slug=(folder+'-'+path.parse(name).name).toLowerCase().replace(/[^a-z0-9]+/g,'-');
  const dest='images/archive/'+slug+'.webp';
  await mkdir('public/images/archive',{recursive:true});
  if(folder==='formal picture'){
   const { data, info } = await sharp(path.join('Pictures',folder,name)).rotate().ensureAlpha().raw().toBuffer({ resolveWithObject: true });
   const { width, height, channels } = info;
   const fadeX = 95;
   const fadeY = 75;
   for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
     const idx = (y * width + x) * channels;
     let factor = 1.0;
     if (x < fadeX) { const t = x / fadeX; factor *= t * t * (3 - 2 * t); }
     if (x > width - 1 - fadeX) { const t = (width - 1 - x) / fadeX; factor *= t * t * (3 - 2 * t); }
     if (y > height - 1 - fadeY) { const t = (height - 1 - y) / fadeY; factor *= t * t * (3 - 2 * t); }
     data[idx] = Math.round(data[idx] * factor + 255 * (1 - factor));
     data[idx + 1] = Math.round(data[idx + 1] * factor + 255 * (1 - factor));
     data[idx + 2] = Math.round(data[idx + 2] * factor + 255 * (1 - factor));
    }
   }
   await sharp(data, { raw: { width, height, channels } })
    .resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true})
    .webp({quality:90})
    .toFile('public/'+dest);
  } else {
   let source=sharp(path.join('Pictures',folder,name)).rotate();
   if(folder==='trainings')source=sharp(path.join('Pictures',folder,name)).rotate(90);
   await source.resize({width:1600,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile('public/'+dest);
  }
  images[folder+'/'+name]=dest;
 }
}
await writeFile('src/data/assets.json',JSON.stringify(images,null,2));
await mkdir('public/documents/academic-compilation',{recursive:true});
await mkdir('test-results/review',{recursive:true});

// Preserve the supplied Word text, tables and embedded diagrams when converting.
const word=await mammoth.convertToHtml({path:'Pictures/activities/PrelimPT2_Cadigal1Marikit2..docx'});
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const page=await browser.newPage();
await page.setContent('<html><head><meta charset="utf-8"><style>body{font:12px/1.5 Arial;color:#111}img{max-width:100%;max-height:650px;object-fit:contain}p{margin:10px 0}table{border-collapse:collapse;width:100%}td{border:1px solid #aaa;padding:5px}h1{font-size:24px}img,table{break-inside:avoid}</style></head><body>'+word.value+'</body></html>');
await page.evaluate(()=>Promise.all(Array.from(document.images).map(i=>i.decode())));
const wordPdf=await page.pdf({format:'A4',printBackground:true,margin:{top:'20mm',bottom:'20mm',left:'18mm',right:'18mm'}});
await browser.close();
await writeFile('test-results/review/prelim-pt2-converted.pdf',wordPdf);
const doc=await PDFDocument.create();
const regular=await doc.embedFont(StandardFonts.Helvetica);
const bold=await doc.embedFont(StandardFonts.HelveticaBold);
const intro=doc.addPage([595,842]);
intro.drawRectangle({x:0,y:0,width:595,height:842,color:rgb(.96,.96,.96)});
intro.drawText('LIAN ARLIE I. MARIKIT',{x:48,y:770,size:12,font:regular});
intro.drawText('COMPUTER',{x:48,y:645,size:42,font:bold});
intro.drawText('PROGRAMMING 1',{x:48,y:590,size:42,font:bold});
intro.drawText('Academic compilation',{x:48,y:535,size:23,font:regular});
intro.drawText('BSIT 103i  |  Jose Rizal University',{x:48,y:490,size:12,font:regular});
intro.drawRectangle({x:48,y:435,width:499,height:3,color:rgb(.84,1,.26)});
const lines=['Contents of the supplied activities folder','01  Flowchart symbols - Prelim PT1 (original PDF)','02  Algorithms - Prelim PT2 (converted Word document)','03  Daily wage flowchart','04  Student information program','05  Digit count','06  Difference of digits (two screenshots)','07  All or not','08  Addition and subtraction','09  Divisible by?'];
lines.forEach((line,i)=>intro.drawText(line,{x:48,y:385-i*25,size:i?11:13,font:i?regular:bold}));
intro.drawText('Contains the supplied work only; additional activities may be added later.',{x:48,y:70,size:10,font:regular});
async function appendPdf(buffer){const original=await PDFDocument.load(buffer);const pages=await doc.copyPages(original,original.getPageIndices());pages.forEach(p=>doc.addPage(p));}
await appendPdf(await readFile('Pictures/activities/PrelimPT1_MarikitLianArlie.pdf'));
await appendPdf(wordPdf);
const labels={
 'PrelimP2_DailyWage_ManapolMarikit.png':'Daily wage flowchart',
 'MPT1 (1).png':'Student information program',
 'Screenshot_2-11-2026_211023_jru.codechum.com.jpeg':'Digit count',
 'Screenshot_2-11-2026_21102_jru.codechum.com.jpeg':'Difference of digits - screenshot 1',
 'Screenshot_2-11-2026_21927_jru.codechum.com.jpeg':'Difference of digits - screenshot 2',
 'Screenshot_2-11-2026_21844_jru.codechum.com.jpeg':'All or not',
 'Screenshot_2-11-2026_2184_jru.codechum.com.jpeg':'Addition and subtraction',
 'Screenshot_2-11-2026_2192_jru.codechum.com.jpeg':'Divisible by?',
};
for(const [name,title] of Object.entries(labels)){
 const image=await doc.embedPng(await sharp(path.join('Pictures/activities',name)).rotate().png().toBuffer());
 const landscape=image.width>image.height;
 const [w,h]=landscape?[842,595]:[595,842];
 const p=doc.addPage([w,h]);const scale=Math.min((w-56)/image.width,(h-100)/image.height);
 p.drawText(title,{x:28,y:h-35,size:14,font:bold});
 p.drawImage(image,{x:(w-image.width*scale)/2,y:(h-60-image.height*scale)/2,width:image.width*scale,height:image.height*scale});
 p.drawText('Computer Programming 1 | Supplied academic work',{x:28,y:20,size:9,font:regular,color:rgb(.4,.4,.4)});
}
doc.setTitle('Computer Programming 1 - Academic Compilation');doc.setAuthor('Lian Arlie I. Marikit');
await writeFile('public/documents/academic-compilation/compilation.pdf',await doc.save());
await writeFile('src/data/compilation.json',JSON.stringify({pageCount:doc.getPageCount(),sourceFiles:10,outputCount:9},null,2));
// The source resume contains third-party contact information. The public PDF
// contains only the user's career and education information needed here.
const resume=await PDFDocument.create();const font=await resume.embedFont(StandardFonts.Helvetica);const rp=resume.addPage([595,842]);
const resumeLines=[['LIAN ARLIE I. MARIKIT',23],['BSIT 103i - Jose Rizal University',12],['Aspiring Software Developer',12],['lianarliemarikit01@gmail.com',11],['',12],['EXPERIENCE',15],['Psy Systems and Innovations, OPC - Work immersion',12],['February 9-26, 2026',11],['Bureau of Fire Protection, Pasig City - SPES / Customer Service',12],['April 28-May 27, 2025',11],['',12],['LEADERSHIP & INVOLVEMENT',15],['President, Elite Math Circle (ELMAC)',12],['Research Robotics Leader',12],['Participant, Division Science and Technology Fair',12],['',12],['TRAININGS',15],['IBM SILIP Training - March 2026',12],['Gender Sensitivity Training - August 2025',12],['Nagpayoung Leaders Convergence - December 2025',12],['',12],['RECOGNITIONS',15],['With Honors - school years 2021-2022 through 2024-2025',12],['With High Honors - school year 2025-2026',12]];
let y=790;for(const [line,size] of resumeLines){if(line)rp.drawText(line,{x:44,y,size,font});y-=size+12;}
rp.drawText('Summary from supplied resume; current university details from portfolio brief.',{x:44,y:45,size:9,font});
await mkdir('public/documents/profile',{recursive:true});await writeFile('public/documents/profile/resume.pdf',await resume.save());
console.log(JSON.stringify({optimizedImages:Object.keys(images).length,compilationPages:doc.getPageCount(),academicSourceFiles:10,uniqueOutputs:9,docxWarnings:word.messages}));
