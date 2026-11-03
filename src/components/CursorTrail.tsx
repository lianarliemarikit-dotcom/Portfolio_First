import { useEffect, useRef } from 'react';

/** A decorative ribbon; the native cursor and every pointer target stay intact. */
export function CursorTrail({ disabled }: { disabled: boolean }) {
  const svg = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  useEffect(() => {
    if (disabled || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const points = Array.from({ length: 18 }, () => ({ x: 0, y: 0 }));
    let frame = 0, last = 0, previous = 0, started = false;
    let x = 0, y = 0;
    const stop = () => {
      cancelAnimationFrame(frame); frame = 0; started = false;
      if (svg.current) svg.current.style.opacity = '0';
    };
    const draw = (time: number) => {
      frame = 0;
      const age = time - last;
      if (document.hidden || age > 850) { stop(); return; }
      const ease = 1 - Math.exp(-Math.min(40, time - previous) / 24);
      previous = time;
      points[0] = { x, y };
      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * ease;
        points[i].y += (points[i - 1].y - points[i].y) * ease;
      }
      path.current?.setAttribute('d', points.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
      if (svg.current) svg.current.style.opacity = String(Math.min(.85, Math.max(0, (850 - age) / 350)));
      frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      x = event.clientX; y = event.clientY; last = performance.now();
      if (!started) { points.forEach(p => { p.x = x; p.y = y; }); previous = last; started = true; }
      if (!frame) frame = requestAnimationFrame(draw);
    };
    window.addEventListener('pointermove', move, { passive: true });
    document.documentElement.addEventListener('pointerleave', stop);
    document.addEventListener('visibilitychange', stop);
    window.addEventListener('blur', stop);
    return () => { stop(); window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', stop); document.removeEventListener('visibilitychange', stop); window.removeEventListener('blur', stop); };
  }, [disabled]);
  return disabled ? null : <svg ref={svg} className="cursor-trail" aria-hidden="true"><path ref={path} fill="none" stroke="#f2df42" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
