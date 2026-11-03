import { useEffect, useRef, type RefObject } from 'react';

export function useMouseTracking(section: RefObject<HTMLElement | null>) {
  const pointer = useRef({ x: 0, y: 0, speed: 0, time: 0, active: false, inside: false, interactive: false, fine: false });
  useEffect(() => {
    const element = section.current;
    if (!element) return;
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => { pointer.current.fine = fine.matches; };
    update();
    const move = (event: PointerEvent) => {
      const p = pointer.current, now = performance.now();
      p.speed = p.active ? Math.hypot(event.clientX - p.x, event.clientY - p.y) / Math.max(8, now - p.time) : 0;
      p.x = event.clientX; p.y = event.clientY; p.time = now; p.active = true;
      p.inside = event.target instanceof Node && element.contains(event.target);
      p.interactive = event.target instanceof Element && !!event.target.closest('a,button,[role="button"]');
    };
    const leave = () => { pointer.current.inside = false; pointer.current.active = false; };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('blur', leave);
    document.documentElement.addEventListener('pointerleave', leave);
    fine.addEventListener('change', update);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('blur', leave); document.documentElement.removeEventListener('pointerleave', leave); fine.removeEventListener('change', update); };
  }, [section]);
  return pointer;
}
