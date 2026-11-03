import { useState } from 'react';
import { ArrowUpRight, Download, FileText } from 'lucide-react';
import { asset, webLink, videoEmbed, type Entry } from '../data/portfolio';

export function EntryCard({entry,onOpen}:{entry:Entry;onOpen:(entry:Entry)=>void}){
  return <button className="entry-card" onClick={()=>onOpen(entry)}>
    <div className="entry-image">{entry.image?<img src={asset(entry.image)} alt="" loading="lazy"/>:<FileText size={48}/>}<span className="view-badge">VIEW ↗</span></div>
    <span className="eyebrow">{entry.term||entry.date||entry.role||'PORTFOLIO RECORD'}</span>
    <h3>{entry.title} <ArrowUpRight size={18}/></h3><p>{entry.description}</p>
  </button>;
}
export function MediaView({entry}:{entry:Entry}){
  const [selected,setSelected]=useState(0);
  const [error,setError]=useState(false);
  const gallery=[entry.image,...(entry.gallery||[])].filter(Boolean) as string[];
  const embed=videoEmbed(entry.embed);
  return <>
    <span className="eyebrow">{entry.term||entry.date||'THE PORTFOLIO ARCHIVE'}</span>
    <h2>{entry.title}</h2><p>{entry.description}</p>
    {entry.organization&&<p className="entry-facts"><b>{entry.organization}</b><br/>{entry.role}{entry.duration&&<> · {entry.duration}</>}</p>}
    {entry.technologies?.length?<div className="tags">{entry.technologies.map(t=><span key={t}>{t}</span>)}</div>:null}
    {gallery.length>0&&<div className="detail-gallery"><img className="detail-image" key={gallery[selected]} src={asset(gallery[selected])} alt={entry.title+(selected?' — supporting photograph '+selected:'')} onError={()=>setError(true)}/>{gallery.length>1&&<div className="gallery-thumbnails" aria-label="Supporting photographs">{gallery.map((src,i)=><button key={src} aria-label={'View photograph '+(i+1)} aria-pressed={selected===i} onClick={()=>{setSelected(i);setError(false)}}><img src={asset(src)} alt=""/></button>)}</div>}</div>}
    {entry.responsibilities?.map(text=><p key={text}>{text}</p>)}
    {!!entry.skills?.length&&<p>Skills learned: {entry.skills.join(' · ')}</p>}
    {entry.pdf&&<><object className="pdf-frame" data={asset(entry.pdf)} type="application/pdf"><p>Your browser does not display embedded PDFs. Use the download or open link below.</p></object><div className="actions"><a className="pill" href={asset(entry.pdf)} download={entry.downloadName||true}><Download size={16}/> Download PDF</a><a className="text-link" href={asset(entry.pdf)} target="_blank" rel="noreferrer">Open PDF in a new tab <ArrowUpRight size={16}/></a></div></>}
    {entry.video&&<video className="video-player" controls playsInline preload="metadata" src={asset(entry.video)} onError={()=>setError(true)}/>}
    {embed&&<iframe className="video-player" src={embed} title={entry.title} allow="fullscreen; picture-in-picture" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/>}
    {error&&<p role="status">This media could not be loaded. Please try opening the file directly.</p>}
    {webLink(entry.repository)&&<a className="text-link" href={webLink(entry.repository)} target="_blank" rel="noreferrer">View repository <ArrowUpRight size={16}/></a>}
  </>;
}
