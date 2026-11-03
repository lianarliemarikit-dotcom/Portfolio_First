import {readFile,writeFile} from 'node:fs/promises';
import {getDocument} from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';
for(const f of ['Pictures/activities/PrelimPT1_MarikitLianArlie.pdf','Pictures/resume/Copy of Copy of RESUME 2.pdf']){
 const doc=await getDocument({data:new Uint8Array(await readFile(f)),useSystemFonts:true}).promise;
 console.log(f);
 for(let i=1;i<=doc.numPages;i++){const p=await doc.getPage(i);console.log((await p.getTextContent()).items.map(x=>x.str).join(' '));}
}
console.log((await mammoth.extractRawText({path:'Pictures/activities/PrelimPT2_Cadigal1Marikit2..docx'})).value);
