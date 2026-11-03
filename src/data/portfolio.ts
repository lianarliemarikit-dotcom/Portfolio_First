import images from './assets.json';
import compilationInfo from './compilation.json';
const media: Record<string, string> = images;
export const photo = (source: string) => media[source] || '';
export type Entry = {
  title: string; description: string; term?: string; technologies?: string[];
  image?: string; gallery?: string[]; pdf?: string; downloadName?: string; repository?: string;
  video?: string; embed?: string; organization?: string; role?: string;
  duration?: string; responsibilities?: string[]; skills?: string[]; date?: string;
  evidenceType?: 'certificate' | 'photo' | 'document'; source?: string;
};
export type Category = { id: string; title: string; short: string; description: string; entries: Entry[] };
export const personal = {
  name: 'Lian Arlie I. Marikit', displayName: 'Lian Arlie Marikit',
  course: 'BSIT 103i', university: 'Jose Rizal University',
  subject: 'Computer Programming 1', role: 'Aspiring Software Developer',
  intro: "I'm Lian Arlie, a first-year Information Technology student at Jose Rizal University and an aspiring software developer.",
  about: "This portfolio brings together my Computer Programming 1 activities, the experiences I've documented, and the work I'm learning to create.",
  goal: "I'm exploring programming and design as I work toward becoming a software developer. This is a space for the things I make, the questions I ask, and the lessons I choose to carry forward.",
  photo: photo('formal picture/1X1.jpg'),
  candid: photo('award/IMG_3201.JPG'),
  resume: 'documents/profile/resume.pdf',
};
export const skills = [
  {name:'Figma',logo:'figma'}, {name:'Canva',logo:'canva'}, {name:'Java',logo:'java'},
  {name:'C++',logo:'cplusplus'}, {name:'HTML',logo:'html5'}, {name:'CSS',logo:'css3'},
  {name:'JavaScript',logo:'javascript'}, {name:'GitHub',logo:'github'},
];
export const socials = { email: 'lianarliemarikit01@gmail.com', github: 'https://github.com/lianarliemarikit-dotcom', linkedin: '' };
export const compilation = {
  title: 'Computer Programming 1 — Academic Compilation',
  description: 'Flowcharts, algorithms, Java activities, and program screenshots, collected in one PDF from the supplied academic files.',
  pdf: 'documents/academic-compilation/compilation.pdf',
  outputCount: compilationInfo.outputCount,
  pageCount: compilationInfo.pageCount,
  sourceFiles: compilationInfo.sourceFiles,
};
const activity = (title:string,filename:string,description:string,term?:string):Entry => ({
  title, description, image:photo('activities/'+filename), term, technologies:['Java'],
  pdf:compilation.pdf, source:'Pictures/activities/'+filename,
});
export const categories: Category[] = [
  {id:'performance',title:'Performance Tasks & Products',short:'Performance tasks',description:'The academic compilation brings the available tasks, products, algorithms, flowcharts, and programming screenshots together in one document.',entries:[
    {title:'Flowchart symbols',description:'Prelim PT1: symbols, names, and functions used in flowcharts.',term:'Prelim',pdf:compilation.pdf,evidenceType:'document'},
    {title:'Algorithms',description:'Prelim PT2: algorithms for arithmetic, grade evaluation, password checking, and a counting loop. Submitted with James Patrick S. Cadigal.',term:'Prelim',pdf:compilation.pdf,evidenceType:'document'},
    {title:'Daily wage flowchart',description:'A flowchart that accepts an employee name, rate per hour, and hours worked, then calculates daily wage.',term:'Prelim',image:photo('activities/PrelimP2_DailyWage_ManapolMarikit.png'),pdf:compilation.pdf},
    activity('Student information program','MPT1 (1).png','Java source code and console output for a student information program.'),
    activity('Digit count','Screenshot_2-11-2026_211023_jru.codechum.com.jpeg','A supplied CodeChum practice screenshot for counting the digits of a positive integer.'),
    {...activity('Difference of digits','Screenshot_2-11-2026_21102_jru.codechum.com.jpeg','Two supplied screenshots of the digit subtraction activity.'),gallery:[photo('activities/Screenshot_2-11-2026_21927_jru.codechum.com.jpeg')]},
    activity('All or not','Screenshot_2-11-2026_21844_jru.codechum.com.jpeg','A supplied practice screenshot of a Java conditional exercise.'),
    activity('Addition and subtraction','Screenshot_2-11-2026_2184_jru.codechum.com.jpeg','A supplied practice screenshot of integer arithmetic and conditional logic.'),
    activity('Divisible by?','Screenshot_2-11-2026_2192_jru.codechum.com.jpeg','A supplied screenshot of a Java divisibility exercise.'),
  ]},
  {id:'documentation',title:'Project Documentation',short:'Project documentation',description:'A place for complete project write-ups, documentation PDFs, and repository links. No separate project documentation has been supplied yet.',entries:[]},
  {id:'video',title:'Video Project Presentation',short:'Video presentation',description:'Recorded walkthroughs and project presentations will appear here when supplied.',entries:[]},
  {id:'experience',title:'Work Experience / Internship / Immersion',short:'Experience & immersion',description:'Practical experience documented in my supplied résumé and photographs.',entries:[
    {title:'Psy Systems and Innovations, OPC',description:'Work immersion listed in my résumé, with a supplied photograph from the post-interview.',organization:'Psy Systems and Innovations, OPC',role:'Work immersion',duration:'February 9–26, 2026',image:photo('immersions/IMG_3196.JPG'),evidenceType:'photo',source:'Supplied résumé and immersion photo'},
    {title:'Bureau of Fire Protection, Pasig City',description:'SPES employment in customer service, as listed in my supplied résumé.',organization:'Bureau of Fire Protection, Pasig City',role:'SPES employee · Customer Service',duration:'April 28–May 27, 2025',pdf:personal.resume,source:'Supplied résumé'},
  ]},
  {id:'seminars',title:'Seminars & Trainings Attended',short:'Seminars & trainings',description:'Training records and the certificates available in my portfolio.',entries:[
    {title:'Do it like an IBMer',description:'Certificate of Achievement for completing the IBM immersive experience. Listed as IBM SILIP Training in my résumé.',organization:'IBM',date:'March 27, 2026',image:photo('trainings/download.jpg'),gallery:[photo('award/6b0da103-6af4-470a-bd25-def81b2c2f39.jpg'),photo('award/f091bebf-4f1b-436c-90c6-39eaa285d653.jpg'),photo('award/f2b47cf7-5fb7-4a70-9edb-e5406afe074a.jpg')],evidenceType:'certificate'},
    {title:'Nagpayoung Leaders Convergence',description:'Seminar listed in my supplied résumé. A certificate has not been supplied.',organization:'Nagpayong High School Function Hall',date:'December 2025',source:'Supplied résumé'},
    {title:'Gender Sensitivity Training',description:'Training listed in my supplied résumé. A certificate has not been supplied.',organization:'Nagpayong High School Function Hall',date:'August 2025',source:'Supplied résumé'},
  ]},
  {id:'community',title:'Organization & Community Involvement',short:'Community involvement',description:'Leadership, group activities, and moments shared with the communities around me.',entries:[
    {title:'The Cloud Grand Prix',description:'Supplied event photographs from The Cloud Grand Prix at JRU, carrying the AWS Student Builder Group – JRU chapter branding.',image:photo('club/860781586_122219204018579104_2962731068516866617_n.jpg'),gallery:[photo('club/864469763_122219204096579104_3694936036826934762_n.jpg'),photo('club/867421738_122219203328579104_4396831441608410149_n.jpg')],evidenceType:'photo'},
    {title:'Elite Math Circle',description:'President of Elite Math Circle (ELMAC), as listed in my supplied résumé.',role:'President',organization:'Elite Math Circle · Nagpayong High School',image:photo('club/IMG_1109.JPG'),evidenceType:'photo'},
    {title:'Research robotics',description:'Research Robotics Leader, as listed in my supplied résumé. Photographs document the research activities.',role:'Research Robotics Leader',image:photo('award/IMG_1119.JPG'),gallery:[photo('award/IMG_3198.JPG')],evidenceType:'photo'},
  ]},
  {id:'awards',title:'Awards & Recognitions',short:'Awards & recognitions',description:'Academic recognitions supported by the supplied résumé and photographs.',entries:[
    {title:'With High Honors',description:'School year 2025–2026 recognition listed in my résumé, accompanied by the supplied diploma and graduation photographs.',date:'S.Y. 2025–2026',image:photo('award/53024e42-89e8-4f6e-b983-82a6e708fb8f.jpg'),gallery:[photo('award/b9a646bf-a327-493f-bb8e-fdb066be3231.jpg'),photo('award/6b8b968a-d9e9-48c7-8b87-4ce0943d35a2.jpg')],evidenceType:'photo'},
    {title:'Academic honors',description:'With Honors recognitions for school years 2021–2022, 2022–2023, 2023–2024, and 2024–2025, as listed in my résumé.',date:'S.Y. 2021–2025',pdf:personal.resume,source:'Supplied résumé'},
    {title:'Division Science and Technology Fair',description:'Participation listed in my résumé, accompanied by a supplied group photograph. The photograph is an event record, not an individual award certificate.',image:photo('award/IMG_3202.JPG'),evidenceType:'photo'},
  ]},
  {id:'other',title:'Other Professional Information',short:'Beyond the classroom',description:'Additional portfolio records, photographs, and a concise résumé.',entries:[
    {title:'Résumé',description:'A public summary of the education, experience, leadership, training, and recognitions supplied for this portfolio.',pdf:personal.resume,image:personal.photo,evidenceType:'document'},
    {title:'Chess & school activities',description:'Supplied photographs documenting a chess event and school activities. No competition ranking is claimed.',image:photo('award/IMG_3195.JPG'),gallery:[photo('award/IMG_3199.JPG')],evidenceType:'photo'},
  ]},
];
export const reflections = [
  {term:'Prelim term',subtitle:'The beginning.',paragraphs:[] as string[],prompts:['Which programming topics did I study during Prelim?','What did I learn from the flowchart and algorithm activities?','What challenged me, and what did I realize?']},
  {term:'Midterm',subtitle:'Finding my rhythm.',paragraphs:[] as string[],prompts:['Which topics and activities belonged to Midterm?','Where did I notice improvement in my programming skills?','What difficulties did I encounter, and how did I respond?']},
  {term:'Final term',subtitle:'Looking forward.',paragraphs:[] as string[],prompts:['Which final-term topics, activities, and projects did I complete?','What skills did I acquire and what challenges remained?','What did these experiences teach me about my next steps?']},
];
export function portfolioCounts(){
  const academicDocuments=new Set([compilation.pdf,...categories[1].entries.map(e=>e.pdf)].filter(Boolean));
  return [
    ['Uploaded projects',categories[1].entries.length],
    ['Academic documents',academicDocuments.size],
    ['Training certificates',categories[4].entries.filter(e=>e.evidenceType==='certificate').length],
    ['Documented experiences',categories[3].entries.length],
  ] as const;
}
export function asset(path?: string) {
  if (!path) return '';
  if (/^(https:\/\/|blob:)/i.test(path)) return path;
  if (/^[a-z]+:/i.test(path) || path.startsWith('//')) return '';
  return import.meta.env.BASE_URL + path.replace(/^\//, '');
}
export function webLink(url?: string) { return url && /^https:\/\//i.test(url) ? url : ''; }
export function videoEmbed(url?: string) {
  if (!url) return '';
  try { const u = new URL(url); return ((u.hostname === 'www.youtube-nocookie.com' && u.pathname.startsWith('/embed/')) || (u.hostname === 'player.vimeo.com' && u.pathname.startsWith('/video/'))) ? u.href : ''; } catch { return ''; }
}
