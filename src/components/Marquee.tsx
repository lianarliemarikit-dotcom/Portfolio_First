import { useEffect, useId, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export function Marquee({reduced}:{reduced:boolean}){
 const host=useRef<HTMLDivElement>(null);
 const id=useId().replaceAll(':','');
 useEffect(()=>{
  if(reduced)return;
  const ctx=gsap.context(()=>{
   const text=host.current!.querySelector('text')!;
   const path=host.current!.querySelector('textPath')!;
   const cycle=text.getComputedTextLength()/4;
   const tween=gsap.fromTo(path,{attr:{startOffset:0}},{attr:{startOffset:-cycle},duration:30,repeat:-1,ease:'none'});
   const trigger=ScrollTrigger.create({onUpdate:self=>gsap.to(tween,{timeScale:1+Math.min(Math.abs(self.getVelocity())/2200,1.5),duration:.5,overwrite:true})});
   return ()=>trigger.kill();
  },host);
  return ()=>ctx.revert();
 },[reduced]);
 const phrase='EXPLORE MY WORK ✦ KEEP CREATING ✦ KEEP LEARNING ✦ ';
 return <div ref={host} className="kinetic-banner" aria-label="Explore my work. Keep creating. Keep learning.">
  <svg className="kinetic-svg" viewBox="0 0 1400 320" aria-hidden="true">
   <defs><path id={id} d="M-1800 160Q-1450 0 -1100 160T300 160T1700 160T3100 160T4500 160"/></defs>
   <text><textPath href={'#'+id} startOffset="0">{phrase.repeat(4)}</textPath></text>
  </svg>
 </div>;
}
