import { useLayoutEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function AcademicPanel({id, expanded, reduced, children}:{id:string;expanded:boolean;reduced:boolean;children:ReactNode}) {
  const host = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);
  useLayoutEffect(() => {
    const node = host.current!;
    const refresh = () => ScrollTrigger.refresh();
    if (reduced || (!initialized.current && !expanded)) {
      node.hidden = !expanded;
      gsap.set(node, { height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 });
      initialized.current = true;
      refresh();
      return;
    }
    initialized.current = true;
    const start = node.hidden ? 0 : node.getBoundingClientRect().height;
    node.hidden = false;
    const target = expanded ? node.firstElementChild!.getBoundingClientRect().height : 0;
    const tween = gsap.fromTo(node, {height: start}, {
      height: target, opacity: expanded ? 1 : 0, duration: expanded ? .5 : .32,
      ease: expanded ? 'power3.out' : 'power2.inOut', overwrite: true,
      onComplete: () => {
        node.hidden = !expanded;
        if (expanded) gsap.set(node, {height:'auto'});
        refresh();
      },
    });
    return () => { tween.kill(); };
  }, [expanded, reduced]);
  return <div ref={host} id={'category-'+id} className="academic-panel" inert={!expanded} aria-hidden={!expanded} role="region" aria-labelledby={'category-trigger-'+id}>{children}</div>;
}
