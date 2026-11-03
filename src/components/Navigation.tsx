import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Maximize2, Minimize2, Menu } from 'lucide-react';
import gsap from 'gsap';

type Props = {
  links: string[][];
  homeRef: RefObject<HTMLAnchorElement | null>;
  menuOpen: boolean;
  onMenu: () => void;
  onActiveChange: (id: string) => void;
  reduced: boolean;
};

export function Navigation({ links, homeRef, menuOpen, onMenu, onActiveChange, reduced }: Props) {
  const [active, setActive] = useState('home');
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [message, setMessage] = useState('');
  const navRef = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const progress = useRef<HTMLSpanElement>(null);
  const indicatorReady = useRef(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const threshold = (document.querySelector('.header')?.getBoundingClientRect().height || 90) + 45;
      let current = 'home';
      for (const [, id] of links) {
        const section = document.getElementById(id);
        if (section && section.getBoundingClientRect().top <= threshold) current = id;
      }
      const distance = document.documentElement.scrollHeight - innerHeight;
      if (distance > 0 && scrollY >= distance - 3) current = 'contact';
      setActive(current);
      setScrolled(scrollY > 24);
      if (progress.current) progress.current.style.transform = 'scaleX(' + Math.min(1, Math.max(0, scrollY / Math.max(1, distance))) + ')';
    };
    const queue = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(queue);
    observer.observe(document.body);
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue);
    update();
    return () => { cancelAnimationFrame(frame); observer.disconnect(); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue); };
  }, [links]);

  useEffect(() => onActiveChange(active), [active, onActiveChange]);
  useLayoutEffect(() => {
    const nav = navRef.current;
    const line = indicator.current;
    if (!nav || !line) return;
    let tween: gsap.core.Tween | undefined;
    let disposed = false;
    const position = () => {
      if (disposed) return;
      const link = nav.querySelector<HTMLElement>('[data-section="' + (hovered || active) + '"]');
      if (!link) return;
      tween?.kill();
      const target = { x: link.offsetLeft + 8, width: Math.max(12, link.offsetWidth - 16), opacity: 1 };
      if (reduced || !indicatorReady.current) gsap.set(line, target);
      else tween = gsap.to(line, { ...target, duration: .42, ease: 'power3.out', overwrite: true });
      indicatorReady.current = true;
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(nav);
    document.fonts.ready.then(position);
    return () => { disposed = true; observer.disconnect(); tween?.kill(); };
  }, [active, hovered, reduced]);

  useEffect(() => {
    const update = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', update);
    update();
    return () => document.removeEventListener('fullscreenchange', update);
  }, []);

  const maximize = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setMessage('');
    } catch { setMessage('Fullscreen is unavailable in this browser.'); }
  };

  return <header className={'header' + (scrolled ? ' is-scrolled' : '')}>
    <div className="nav-shell">
      <a className="brand" href="#home" ref={homeRef} aria-label="Lian Marikit home"><span className="monogram"><svg viewBox="0 0 40 42" aria-hidden="true"><path d="M3 3h12v23h14v13H3zM18 3h19L27 18H15z" fill="currentColor"/><path d="m21 21 9-5 10 18-10 5z" fill="currentColor"/></svg></span><span className="brand-name">LIAN ARLIE<br/>MARIKIT</span></a>
      <div className="nav-scroller"><nav ref={navRef} className="header-nav" aria-label="Main navigation" onPointerLeave={() => setHovered(null)} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) setHovered(null); }}>
        {links.map(([title, id]) => <a href={'#' + id} key={id} data-section={id} aria-current={active === id ? 'location' : undefined} onPointerEnter={() => setHovered(id)} onFocus={() => setHovered(id)}>{id === 'works' ? 'Works' : title}</a>)}
        <span ref={indicator} className="nav-indicator" aria-hidden="true" />
      </nav></div>
      <div className="nav-actions">
        {document.fullscreenEnabled && <button className="maximize-trigger" onClick={maximize} aria-label={fullscreen ? 'Restore view' : 'Maximize view'} aria-pressed={fullscreen} title={fullscreen ? 'Restore view' : 'Maximize view'}>{fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>}
        <button className="menu-trigger" aria-label="Menu" aria-expanded={menuOpen} aria-haspopup="dialog" onClick={onMenu}><Menu size={18} /></button>
      </div>
    </div>
    <span className="nav-progress" aria-hidden="true"><span ref={progress} /></span>
    {message && <p className="nav-message" role="status">{message}</p>}
  </header>;
}
