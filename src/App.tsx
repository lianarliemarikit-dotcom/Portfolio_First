import { Component, lazy, Suspense, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, ArrowDown, ArrowUp, Plus, Minus, Github, Linkedin, Mail, Download, Play, RotateCcw } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Dialog } from './components/Dialog';
import { EntryCard, MediaView } from './components/MediaView';
import { Marquee } from './components/Marquee';
import { Navigation } from './components/Navigation';
import { AcademicPanel } from './components/AcademicPanel';
import { CursorTrail } from './components/CursorTrail';
import { InteractiveRobot } from './components/InteractiveRobot';
import { personal, skills, socials, compilation, categories, reflections, portfolioCounts, photo, asset, webLink, type Entry, type Category } from './data/portfolio';
gsap.registerPlugin(ScrollTrigger);
const Scene=lazy(()=>import('./components/Scene'));
const nav=[['Home','home'],['About','about'],['Academics & Works','works'],['Reflections','reflections'],['Contact','contact']];
function Label({children}:{children:ReactNode}){return <span className="eyebrow">{children}</span>}
function Arrow(){return <ArrowUpRight size={17} aria-hidden="true"/>}
class SceneBoundary extends Component<{children:ReactNode},{failed:boolean}>{
 state={failed:false};static getDerivedStateFromError(){return {failed:true}}
 render(){return this.state.failed?<div className="fallback-ring"/>:this.props.children}
}
function useReducedMotion(){
 const [reduced,setReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)');const update=()=>setReduced(q.matches);q.addEventListener('change',update);return ()=>q.removeEventListener('change',update)},[]);
 return reduced;
}
export default function App(){
 const reduced=useReducedMotion();
 const [intro,setIntro]=useState(()=>!matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [introKey,setIntroKey]=useState(0);
 const [paused,setPaused]=useState(false);
 const [failed,setFailed]=useState(false);
 const [menu,setMenu]=useState(false);
 const [activeSection,setActiveSection]=useState('home');
 const [preview,setPreview]=useState('home');
 const [detail,setDetail]=useState<Entry|null>(null);
 const [empty,setEmpty]=useState<Category|null>(null);
 const [expanded,setExpanded]=useState<string|null>(null);
 const [localPdf,setLocalPdf]=useState('');
 const [localName,setLocalName]=useState('');
 const [fileError,setFileError]=useState('');
 const root=useRef<HTMLDivElement>(null);
 const contact=useRef<HTMLElement>(null);
 const footerName=useRef<HTMLDivElement>(null);
 const home=useRef<HTMLAnchorElement>(null);
 const skip=useRef<HTMLButtonElement>(null);
 const heroEntered=useRef(false);
 const endIntro=useCallback(()=>{setIntro(false);requestAnimationFrame(()=>home.current?.focus({preventScroll:true}));},[]);
 useEffect(()=>{
  if(!intro)return;
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';skip.current?.focus();
  const timeout=setTimeout(endIntro,3400);
  return ()=>{clearTimeout(timeout);document.body.style.overflow=overflow;};
 },[intro,introKey,endIntro]);
 useEffect(()=>{if(reduced)setIntro(false)},[reduced]);
 useEffect(()=>()=>{if(localPdf)URL.revokeObjectURL(localPdf)},[localPdf]);
 useEffect(()=>{
  if(intro||reduced||paused)return;
  const ctx=gsap.context(()=>{
   if(!heroEntered.current){
    gsap.timeline({onComplete:()=>{heroEntered.current=true;}})
     .fromTo('.hero-copy > p',{y:16,autoAlpha:0},{y:0,autoAlpha:1,duration:.7,ease:'power3.out'})
     .fromTo('.hero-copy h1 > span',{y:36,autoAlpha:0},{y:0,autoAlpha:1,duration:1.05,stagger:.14,ease:'power4.out'},.12);
   }
   const hero=gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom 15%',scrub:1}});
   hero.to('.hero-copy',{y:-80,opacity:0,ease:'none'},0).to('.scene-canvas',{y:-45,scale:.94,ease:'none'},0);
   // A single coordinated curved wipe bridges the light hero and dark statement.
   gsap.fromTo('.statement',{clipPath:'ellipse(75% 75% at 50% 100%)'},{clipPath:'ellipse(150% 150% at 50% 100%)',ease:'none',scrollTrigger:{trigger:'.statement',start:'top 100%',end:'top 10%',scrub:true}});
   gsap.fromTo('.statement-copy',{y:65,opacity:.15},{y:0,opacity:1,ease:'none',scrollTrigger:{trigger:'.statement',start:'top 70%',end:'top 5%',scrub:true}});
   gsap.utils.toArray<HTMLElement>('.reveal').forEach(el=>gsap.fromTo(el,{y:24,opacity:0},{y:0,opacity:1,duration:.95,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 93%',once:true}}));
   gsap.fromTo('.stat',{y:25,autoAlpha:0},{y:0,autoAlpha:1,stagger:.1,duration:.8,ease:'power3.out',scrollTrigger:{trigger:'.stats',start:'top 90%',once:true}});
   gsap.fromTo('.skill',{y:16,autoAlpha:0},{y:0,autoAlpha:1,stagger:.045,duration:.6,ease:'power3.out',scrollTrigger:{trigger:'.skills',start:'top 92%',once:true}});
   gsap.utils.toArray<HTMLElement>('.image-mask').forEach(el=>{
    gsap.fromTo(el,{clipPath:'inset(10% 0 10% 0 round 32px)'},{clipPath:'inset(0% 0 0% 0 round 24px)',ease:'none',scrollTrigger:{trigger:el,start:'top 90%',end:'top 15%',scrub:1}});
    const img=el.querySelector('img');if(img)gsap.fromTo(img,{scale:1.08},{scale:1,ease:'none',scrollTrigger:{trigger:el,start:'top bottom',end:'bottom top',scrub:1}});
   });
   gsap.utils.toArray<SVGPathElement>('.draw-line').forEach(path=>{const length=path.getTotalLength();gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});gsap.to(path,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:path.closest('section'),start:'top 75%',end:'bottom 70%',scrub:1}})});
   gsap.utils.toArray<HTMLElement>('.chapter-line').forEach(el=>gsap.fromTo(el,{scaleX:0},{scaleX:1,ease:'none',scrollTrigger:{trigger:el.parentElement,start:'top 85%',end:'bottom 55%',scrub:true}}));
   gsap.utils.toArray<HTMLElement>('[data-count]').forEach(el=>{const val={n:0};gsap.to(val,{n:Number(el.dataset.count),duration:1.4,scrollTrigger:{trigger:el,start:'top 94%',once:true},onUpdate:()=>{el.textContent=String(Math.round(val.n)).padStart(2,'0')}})});
   const journey=gsap.timeline({scrollTrigger:{trigger:'.journey-stage',start:'top 88px',end:()=>'+='+innerHeight*.55,pin:innerWidth>800,scrub:1,invalidateOnRefresh:true}});
   journey.fromTo('.journey-title',{y:35,opacity:.3},{y:0,opacity:1},0).fromTo('.journey-item',{opacity:.2,y:40},{opacity:1,y:0,stagger:.15},.1);
   gsap.utils.toArray<HTMLElement>('.work-row').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 53%',end:'bottom 47%',toggleClass:'is-current'}));
   gsap.to('.footer-name',{xPercent:-3,ease:'none',scrollTrigger:{trigger:'.contact',start:'top bottom',end:'bottom bottom',scrub:1}});
  },root);
  return ()=>ctx.revert();
 },[intro,reduced,paused]);
 const replay=()=>{heroEntered.current=false;setPaused(false);window.scrollTo({top:0,behavior:'instant'});setIntroKey(n=>n+1);setIntro(true)};
 const openCompilation=()=>setDetail({title:compilation.title,description:localPdf?'Local preview only. This selected file is not uploaded or published.':compilation.description,pdf:localPdf||compilation.pdf,downloadName:localPdf?localName:undefined});
 const openCategory=(cat:Category)=>{if(cat.entries[0])setDetail(cat.entries[0]);else setEmpty(cat)};
 const pdf=localPdf||asset(compilation.pdf);
 const previewImage=preview==='about'?personal.photo:preview==='works'?photo('activities/MPT1 (1).png'):preview==='reflections'?photo('activities/PrelimP2_DailyWage_ManapolMarikit.png'):personal.candid;
 const count=portfolioCounts();
 const selectFile=(file?:File)=>{
  setFileError('');if(!file)return;
  if(!file.name.toLowerCase().endsWith('.pdf')||(file.type&&file.type!=='application/pdf')){setFileError('Please choose a PDF document.');return}
  if(file.size>50*1024*1024){setFileError('Please choose a PDF smaller than 50 MB.');return}
  setLocalPdf(URL.createObjectURL(file));setLocalName(file.name);
 };
 return <div ref={root} className={paused?'motion-paused':''}>
  <CursorTrail disabled={reduced||paused||intro||menu||!!detail||!!empty}/>
  <a className="skip-link" href="#main">Skip to content</a>
  {intro&&<div className="intro-overlay" key={introKey} role="dialog" aria-modal="true" aria-label="Welcome animation" onKeyDown={e=>{if(e.key==='Escape')endIntro();if(e.key==='Tab'){e.preventDefault();skip.current?.focus()}}}>
   <div className="intro-message"><span className="intro-hello">· Hello.</span><span className="intro-welcome">· Welcome to my portfolio.</span></div>
   <button className="intro-skip" ref={skip} onClick={endIntro}>Skip intro <Arrow/></button>
  </div>}
  <div inert={intro}>
   <Navigation links={nav} homeRef={home} menuOpen={menu} onMenu={()=>setMenu(true)} onActiveChange={setActiveSection} reduced={reduced||paused}/>
   <main id="main">
    <section className="hero" id="home">
     <div className="hero-stage" aria-hidden="true"><SceneBoundary><Suspense fallback={<div className="fallback-ring"/>}>{failed?<div className="fallback-ring"/>:<Scene reduced={reduced||paused} onFailure={()=>setFailed(true)}/>}</Suspense></SceneBoundary></div>
     <div className="hero-copy"><p>HI, I'M LIAN ARLIE</p><h1><span>BSIT STUDENT.</span><span>ASPIRING DEVELOPER.</span></h1></div>
     <div className="hero-rail" aria-hidden="true"/><div className="hero-socials"><a href={'mailto:'+socials.email} aria-label="Email Lian"><Mail size={16}/></a>{webLink(socials.github)&&<a href={socials.github} aria-label="GitHub"><Github size={16}/></a>}{webLink(socials.linkedin)&&<a href={socials.linkedin} aria-label="LinkedIn"><Linkedin size={16}/></a>}<span>BSIT 103i</span></div>
     <a className="scroll-hint" href="#statement">scroll down <ArrowDown size={14}/></a><span className="hero-signature">LIAN ARLIE I. MARIKIT</span>
    </section>
    <section className="statement dark" id="statement"><div className="statement-copy"><h2>{personal.intro}</h2><p>{personal.about}</p><a className="pill lime-pill" href="#about">About me <Arrow/></a></div><div className="statement-footer"><Label>↓ SCROLL TO EXPLORE</Label><Label>CODE. CREATE. LEARN.</Label></div></section>
    <section className="about section-pad" id="about">
     <div className="section-label reveal"><Label>01 / ABOUT ME</Label><span>{personal.university}</span></div>
     <div className="about-layout"><div className="portrait-wide image-mask"><img src={asset(personal.photo)} alt="Lian Arlie I. Marikit, formal portrait" fetchPriority="high"/><span className="portrait-caption">Lian Arlie I. Marikit <span>BSIT 103i</span></span></div><div className="about-content">
     <svg className="about-curve" viewBox="0 0 1000 900" fill="none" aria-hidden="true"><path className="draw-line" d="M520 -30C950 150 750 250 500 400S460 600 620 740 290 820 80 870" stroke="currentColor" strokeWidth="15" strokeLinecap="round"/></svg>
     <div className="about-caption reveal"><h2>Creating, learning, and growing through technology.</h2><p>{personal.goal}</p></div>
     <div className="education-row reveal"><div><Label>MY CURRENT CHAPTER</Label><strong>BSIT <span>103i</span></strong><p>First-year Information Technology student</p></div><div><Label>WHERE I'M LEARNING</Label><h3>Jose Rizal<br/>University</h3><p>Computer Programming 1</p></div></div></div></div>
     <div className="photo-pair"><button className="image-mask" onClick={()=>openCategory(categories[5])}><img src={asset(categories[5].entries[0].image)} alt="The Cloud Grand Prix event at JRU" loading="lazy"/><span>Community & involvement <Arrow/></span></button><button className="image-mask" onClick={()=>setDetail(categories[4].entries[0])}><img src={asset(photo('award/6b0da103-6af4-470a-bd25-def81b2c2f39.jpg'))} alt="IBM immersive experience photograph" loading="lazy"/><span>Learning beyond the classroom <Arrow/></span></button></div>
    </section>
    <section className="journey-stage dark">
     <div className="journey-heading"><Label>02 / LEARNING IN PRACTICE</Label><h2 className="journey-title">The experiences<br/>that shape my path.</h2></div>
     <svg className="journey-curve" viewBox="0 0 1200 600" fill="none" aria-hidden="true"><path className="draw-line" d="M-100 340C200 50 860 20 1030 290S700 650 610 440 820 180 1280 370" stroke="currentColor" strokeWidth="25" strokeLinecap="round"/></svg>
     <div className="journey-items">{categories[3].entries.map((entry,i)=><button className="journey-item" key={entry.title} onClick={()=>setDetail(entry)}><span className="journey-marker"/><Label>0{i+1} / {entry.duration}</Label><h3>{entry.organization}</h3><p>{entry.role}</p><span className="text-link">View experience <Arrow/></span></button>)}</div>
    </section>
    <section className="profile section-pad">
     <div className="profile-grid"><div className="profile-copy reveal"><Label>A LITTLE MORE ABOUT ME</Label><h2>A student today.<br/>A developer<br/>in the making.</h2><p>{personal.intro}</p><p>{personal.about}</p><a className="text-link" href={asset(personal.resume)} download>Download résumé <Download size={15}/></a></div><div className="profile-photo image-mask"><img src={asset(personal.candid)} alt="A supplied photograph of Lian at a school activity" loading="lazy"/></div></div>
     <div className="stats">{count.map(([title,value])=><div className="stat" key={title}><strong data-count={value}>{String(value).padStart(2,'0')}</strong><h3>{title}</h3><p>{title==='Uploaded projects'?'Complete project documentation added to the archive.':title==='Academic documents'?'One PDF bringing the supplied programming work together.':title==='Training certificates'?'Certificates supplied with this portfolio.':'Experiences documented in the supplied records.'}</p></div>)}</div>
     <div className="technology"><h2>Technology interests</h2><p>Tools and languages I'm exploring.</p><div className="skills">{skills.map(skill=><div className="skill" key={skill.name}><img src={asset('logos/'+skill.logo+'.svg')} alt="" loading="lazy"/><span>{skill.name}</span></div>)}</div></div>
    </section>
    <section className="works" id="works"><div className="works-heading section-pad reveal"><Label>03 / ACADEMICS & RELEVANT WORKS</Label><h2>My Work</h2><p>Programming activities, documented experiences, and the work behind my learning.<br/>A collection of the things I've made and the moments I've kept.</p></div>
     <div className="academic-index">{categories.map((cat,i)=><div className="category" key={cat.id}><button className="work-row category-trigger" id={"category-trigger-"+cat.id} aria-expanded={expanded===cat.id} aria-controls={'category-'+cat.id} onClick={()=>setExpanded(expanded===cat.id?null:cat.id)}><span className="row-number">0{i+1}</span><span className="row-title">{cat.title}</span><span className="row-meta">{cat.entries.length?String(cat.entries.length).padStart(2,'0')+' records':'Coming soon'}</span><div className="row-marquee" aria-hidden="true"><div>{[0,1,2,3].map(n=><span key={n}>{cat.short.toUpperCase()}{cat.entries.find(e=>e.image)?.image?<img src={asset(cat.entries.find(e=>e.image)!.image)} alt=""/>:<span className="strip-symbol">✦</span>}</span>)}</div></div><span className="row-toggle">{expanded===cat.id?<Minus size={16}/>:<Plus size={16}/>}</span></button>
      <AcademicPanel id={cat.id} expanded={expanded===cat.id} reduced={reduced||paused}><div className={'category-body '+(cat.id==='experience'?'experience-timeline':'')}><p>{cat.description}</p>{cat.id==='performance'&&<button className="pill" onClick={openCompilation}>Preview complete compilation <Arrow/></button>}{cat.entries.length?<div className="entry-grid">{cat.entries.map(entry=><EntryCard key={entry.title} entry={entry} onOpen={setDetail}/>)}</div>:<div className="empty-inline"><h3>This chapter is still taking shape.</h3><p>{cat.description}</p>{cat.id==='video'&&<Play size={30}/>}</div>}</div></AcademicPanel>
     </div>)}</div>
    </section>
    <section className="featured section-pad"><div className="feature-heading reveal"><div><Label>FEATURED / COMPUTER PROGRAMMING 1</Label><h2>One collection.<br/>Every supplied output.</h2></div><p>{compilation.pageCount} pages · {compilation.outputCount} academic outputs<br/>Flowcharts. Algorithms. Java.</p></div>
     <button className="compilation-cover image-mask" onClick={openCompilation} aria-label="View Computer Programming 1 compilation"><div className="document-cover"><span>JOSE RIZAL UNIVERSITY / BSIT 103i</span><h3>COMPUTER<br/>PROGRAMMING<br/><b>01</b></h3><div>LIAN ARLIE I. MARIKIT<br/>ACADEMIC COMPILATION</div><span className="cover-star">✦</span></div><img className="cover-screen" src={asset(photo('activities/MPT1 (1).png'))} alt="Java student information program and console output"/><span className="view-badge">VIEW PDF ↗</span><span className="cover-bottom">THE SUPPLIED WORK, TOGETHER IN ONE PDF.</span></button>
     <div className="compilation-info"><p>{compilation.description}</p><div className="actions"><button className="pill" onClick={openCompilation}>Preview PDF <Arrow/></button><a className="text-link" href={pdf} download={localName||undefined}>Download PDF <Download size={15}/></a></div></div>
     <details className="local-preview"><summary>Preview a replacement PDF locally</summary><p>This preview stays in your browser and does not publish a file.</p><label className="file-picker">Choose PDF<input type="file" accept=".pdf,application/pdf" onChange={e=>selectFile(e.target.files?.[0])}/></label>{localPdf&&<p>{localName} <button onClick={()=>{setLocalPdf('');setLocalName('')}}>Clear</button></p>}{fileError&&<p role="alert">{fileError}</p>}</details>
    </section>
    <section className="project-story dark section-pad"><div className="story-top"><div><Label>FROM THE COMPILATION</Label><h2>Turning a problem<br/>into a program.</h2></div><p>The supplied activities include flowcharts, algorithms, and Java source code.<br/><button className="text-link" onClick={openCompilation}>Explore the compilation <Arrow/></button></p></div><div className="story-images"><button className="image-mask" onClick={()=>setDetail(categories[0].entries[2])}><img src={asset(photo('activities/PrelimP2_DailyWage_ManapolMarikit.png'))} alt="Daily wage flowchart" loading="lazy"/><span>Daily wage / Flowchart <Arrow/></span></button><button className="image-mask" onClick={()=>setDetail(categories[0].entries[4])}><img src={asset(photo('activities/Screenshot_2-11-2026_211023_jru.codechum.com.jpeg'))} alt="Digit count Java activity" loading="lazy"/><span>Digit count / Java <Arrow/></span></button></div><div className="showcase-list">{['JAVA PROGRAMMING','PERFORMANCE TASKS','MACHINE PROBLEMS','PROJECT DOCUMENTATION','ACADEMIC ACTIVITIES'].map((title,i)=><button className="showcase-row" key={title} onClick={()=>i===3?openCategory(categories[1]):openCompilation()}><span>0{i+1}</span><span>{title}</span><Arrow/></button>)}</div></section>
    <Marquee reduced={reduced||paused}/>
    <section className="reflections section-pad" id="reflections"><div className="reflection-heading reveal"><Label>04 / COMPUTER PROGRAMMING 1</Label><h2>My learning journey.</h2><p>THREE TERMS. NEW EXPERIENCES. CONTINUOUS GROWTH.</p></div>{reflections.map((chapter,i)=><article className="chapter" key={chapter.term}><div className="chapter-line"/><span className="chapter-number">0{i+1}</span><div className="chapter-copy reveal"><Label>CHAPTER 0{i+1}</Label><h3>{chapter.term.toUpperCase()}</h3>{chapter.paragraphs.length?chapter.paragraphs.map((text,j)=><p key={j}>{text}</p>):<><p className="reflection-status">My reflection is still to come.</p><p>This space is reserved for my own account of the topics, activities, challenges, and lessons from {chapter.term.toLowerCase()}.</p><details><summary>Open reflection prompts <Plus size={15}/></summary><ol>{chapter.prompts.map(prompt=><li key={prompt}>{prompt}</li>)}</ol></details></>}</div></article>)}</section>
    <section ref={contact} className="contact dark section-pad" id="contact"><div className="contact-top"><div><Label>05 / THE NEXT CONVERSATION</Label><h2>LET'S CONNECT.</h2><p>Let's turn ideas into something meaningful.</p><a className="contact-email" href={'mailto:'+socials.email}>{socials.email}<Arrow/></a></div><div className="footer-links"><Label>LINKS</Label>{nav.map(([title,id])=><a key={id} href={'#'+id}>{title}</a>)}</div><div className="footer-links"><Label>SOCIALS</Label><a href={'mailto:'+socials.email}>Email <Arrow/></a>{webLink(socials.github)?<a href={socials.github}>GitHub <Arrow/></a>:<span>GitHub · to come</span>}{webLink(socials.linkedin)?<a href={socials.linkedin}>LinkedIn <Arrow/></a>:<span>LinkedIn · to come</span>}</div></div>
     <InteractiveRobot section={contact} heading={footerName} disabled={reduced||paused||intro||menu||!!detail||!!empty}/>
     <div ref={footerName} className="footer-name" role="button" tabIndex={0} aria-label="Lian Arlie — celebrate with the robot">LIAN ARLIE</div><footer><span>{personal.name}<br/>{personal.course} · {personal.university}</span><a className="back-top" href="#home">Back to top <ArrowUp size={18}/></a></footer><div className="footer-controls"><span>© {new Date().getFullYear()} · A WORK IN PROGRESS</span><div><button disabled={reduced} onClick={replay}><RotateCcw size={12}/>{reduced?'Intro: reduced motion':'Replay intro'}</button><button aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Resume':'Pause'} motion</button></div></div>
    </section>
   </main>
  </div>
  {menu&&<Dialog title="Navigation" className="menu-dialog" onClose={()=>setMenu(false)}><div className="menu-layout"><nav aria-label="Fullscreen navigation">{nav.map(([title,id])=><a key={id} href={'#'+id} aria-current={activeSection===id?'location':undefined} onMouseEnter={()=>setPreview(id)} onFocus={()=>setPreview(id)} onClick={()=>setMenu(false)}>{title}<Plus size={12}/></a>)}</nav><div className="menu-preview"><Label>✦ MAKE YOUR MARK.</Label><p>Lian Arlie I. Marikit<br/>BSIT 103i · JRU</p><div className="preview-frame">{preview==='home'?<div className="mini-ring" aria-hidden="true"/>:<img src={asset(previewImage)} alt=""/>}</div></div></div><div className="menu-bottom"><span>Made with curiosity.</span><span>01 — 05</span></div></Dialog>}
  {detail&&<Dialog key={detail.title} title={detail.title} onClose={()=>setDetail(null)}><MediaView entry={detail}/></Dialog>}
  {empty&&<Dialog title={empty.title} onClose={()=>setEmpty(null)}><Label>THE ACADEMIC ARCHIVE</Label><h2>{empty.title}</h2><div className="empty-inline"><h3>A space for what's next.</h3><p>{empty.description}</p></div></Dialog>}
 </div>;
}
