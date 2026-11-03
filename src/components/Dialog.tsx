import { useEffect, useRef, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
export function Dialog({title,children,onClose,className=''}:{title:string;children:ReactNode;onClose:()=>void;className?:string}){
 const ref=useRef<HTMLDialogElement>(null);
 const [closing,setClosing]=useState(false);
 const closeCallback=useRef(onClose);
 closeCallback.current=onClose;
 const close=()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches){onClose();}else{setClosing(true);}};
 useEffect(()=>{if(!closing)return;const timer=setTimeout(()=>closeCallback.current(),200);return ()=>clearTimeout(timer)},[closing]);
 useEffect(()=>{
  const dialog=ref.current!;
  const before=document.activeElement as HTMLElement;
  const overflow=document.body.style.overflow;
  document.body.style.overflow='hidden';
  dialog.showModal();
  return ()=>{dialog.close();document.body.style.overflow=overflow;before?.focus({preventScroll:true});};
 },[]);
 return <dialog ref={ref} className={className+(closing?' dialog-closing':'')} aria-label={title}
 onKeyDown={e=>{
  if(e.key!=='Tab')return;
  const items=Array.from(ref.current!.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),summary,video[controls],[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
  const first=items[0],last=items[items.length-1];
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
 }}
 onCancel={e=>{e.preventDefault();close();}} onClick={e=>{if(e.target===e.currentTarget)close();}}>
  <div className="dialog-inside"><button autoFocus className="round close" aria-label="Close dialog" onClick={close}><X size={23}/></button>{children}</div>
 </dialog>;
}
