import { useEffect, useRef, type RefObject } from 'react';
import { RobotMachine, type RobotState } from './RobotEmotions';
import { useMouseTracking } from './useMouseTracking';

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(max, n));
export function useRobotAnimation(section: RefObject<HTMLElement | null>, heading: RefObject<HTMLDivElement | null>, anchor: RefObject<HTMLDivElement | null>, disabled: boolean) {
  const pointer = useMouseTracking(section);
  const react = useRef<(state: RobotState) => void>(() => {});
  useEffect(() => {
    const area = section.current, name = heading.current, node = anchor.current;
    if (!area || !name || !node) return;
    const machine = new RobotMachine();
    let frame = 0, measureFrame = 0, visible = false, last = 0, entered = false;
    let x = 0, velocity = 0, min = 0, max = 0, home = 0, top = 0, size = 80;
    let areaLeft = 0, areaTop = 0, lastMove = performance.now(), nextBlink = lastMove + 3800;
    let gazeX = 0, gazeY = 0, lastSurprise = 0, staticTimer = 0;
    const paintState = () => { node.dataset.state = machine.state; node.dataset.emotion = machine.emotion; };
    const measure = () => {
      measureFrame = 0;
      const bounds = area.getBoundingClientRect(), text = name.getBoundingClientRect();
      const content = area.querySelector('.contact-top')!.getBoundingClientRect();
      areaLeft = bounds.left; areaTop = bounds.top;
      // Fit in the existing whitespace. Typography, margins and footer height stay intact.
      size = clamp(text.top - content.bottom - 6, 44, 128);
      node.style.width = `${size * 220 / 230}px`;
      node.style.height = `${size}px`;
      min = Math.max(0, text.left - bounds.left) + size / 2 + 8;
      max = Math.min(bounds.width, text.right - bounds.left) - size / 2 - 8;
      home = (min + max) / 2;
      top = text.top - bounds.top - size - 3;
      if (!last || disabled) x = home;
      x = clamp(x, min, max);
      node.style.top = `${top}px`;
      node.style.transform = `translate3d(${x}px,0,0) translateX(-50%)`;
    };
    const scheduleMeasure = () => { if (visible && !measureFrame) measureFrame = requestAnimationFrame(measure); };
    const render = (now: number) => {
      frame = 0;
      if (!visible || document.hidden || disabled) return;
      const dt = Math.min(.032, Math.max(.001, (now - last) / 1000)); last = now;
      const p = pointer.current;
      if (p.time > lastMove) lastMove = p.time;
      const idle = now - lastMove;
      const tracking = p.inside && p.fine && p.active;
      const target = tracking ? clamp(p.x - areaLeft, min, max) : home;
      velocity += ((target - x) * 75 - velocity * 15) * dt;
      x = clamp(x + velocity * dt, min, max);
      const dx = p.active ? p.x - areaLeft - x : 0;
      const dy = p.active ? p.y - areaTop - top - size * .4 : 0;
      const near = tracking && Math.hypot(dx, dy) < size * 1.4;
      if (tracking && !entered) { machine.react('happy', now); entered = true; }
      if (!tracking) entered = false;
      if (near && p.speed > 1.8 && now - p.time < 80 && now - lastSurprise > 2500) {
        machine.react('surprised', now); lastSurprise = now;
      }
      let base: RobotState = 'idle';
      if (idle > 12000) base = 'sleepy';
      else if (tracking) {
        if (Math.abs(target - x) > 4) base = 'follow';
        else if ((near && idle > 1300) || p.interactive) base = 'thinking';
        else if (near) base = 'hover';
        else if (Math.abs(dx) > Math.abs(dy)) base = dx < 0 ? 'lookLeft' : 'lookRight';
        else base = dy < 0 ? 'lookUp' : 'lookDown';
      } else if (Math.abs(home - x) > 2) base = 'returnHome';
      if (idle < 12000 && now >= nextBlink) { base = 'blink'; if (now > nextBlink + 140) nextBlink = now + 3500 + Math.random() * 2200; }
      machine.update(now, base); paintState();
      const phase = now / 1000, reaction = clamp((now - machine.since) / Math.max(1, machine.until - machine.since), 0, 1);
      const jumping = machine.state === 'excited' || machine.state === 'bounce';
      const jump = jumping ? Math.sin(reaction * Math.PI) * 10 : 0;
      const float = Math.sin(phase * (base === 'sleepy' ? 1 : 1.8)) * 1.8;
      const tilt = clamp(velocity / 70, -7, 7);
      const startled = machine.state === 'surprised' ? Math.sin(reaction * Math.PI) : 0;
      const head = machine.emotion === 'thinking' ? -9 : clamp(dx / 40, -8, 8) - startled * 8;
      const wave = machine.state === 'wave' || machine.state === 'happy';
      gazeX += (clamp(dx / 45, -6, 6) - gazeX) * .12;
      gazeY += (clamp(dy / 55, -4, 4) - gazeY) * .12;
      node.style.transform = `translate3d(${x - Math.sign(dx) * startled * 3}px,${float - jump - startled * 2 + (machine.emotion === 'sad' ? 2 : 0)}px,0) translateX(-50%)`;
      node.style.setProperty('--robot-tilt', `${tilt}deg`);
      node.style.setProperty('--robot-head', `${head}deg`);
      node.style.setProperty('--robot-gaze-x', `${gazeX}px`);
      node.style.setProperty('--robot-gaze-y', `${gazeY}px`);
      node.style.setProperty('--robot-arm-left', `${jumping ? 125 * Math.sin(reaction * Math.PI) : tilt * 2}deg`);
      node.style.setProperty('--robot-arm-right', `${wave ? -125 + Math.sin(phase * 13) * 18 : jumping ? -125 * Math.sin(reaction * Math.PI) : tilt * 2}deg`);
      node.style.setProperty('--robot-scale', `${1 + Math.sin(phase * 1.8) * .007 + (jumping ? Math.sin(reaction * Math.PI * 2) * .025 : 0)}`);
      node.style.setProperty('--robot-shadow', `${1 - jump / 40}`);
      frame = requestAnimationFrame(render);
    };
    const start = () => {
      if (!disabled && visible && !document.hidden && !frame) { last = performance.now(); frame = requestAnimationFrame(render); }
      node.dataset.running = String(!disabled && visible && !document.hidden);
    };
    const stop = () => { cancelAnimationFrame(frame); frame = 0; node.dataset.running = 'false'; };
    react.current = state => {
      lastMove = performance.now(); machine.react(state, lastMove); paintState(); start();
      if (disabled) { clearTimeout(staticTimer); staticTimer = window.setTimeout(() => { machine.update(performance.now(), 'idle'); paintState(); }, 1900); }
    };
    const visibility = () => { if (document.hidden) stop(); else start(); };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) { measure(); start(); } else stop();
    });
    observer.observe(name);
    const resize = new ResizeObserver(scheduleMeasure);
    resize.observe(area); resize.observe(name);
    window.addEventListener('scroll', scheduleMeasure, { passive: true });
    window.addEventListener('resize', scheduleMeasure);
    document.addEventListener('visibilitychange', visibility);
    const click = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest('.contact-email,.back-top')) react.current('excited');
    };
    area.addEventListener('click', click);
    const celebrate = () => { if (!window.getSelection()?.toString()) react.current('excited'); };
    const key = (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); react.current('excited'); } };
    name.addEventListener('click', celebrate);
    name.addEventListener('keydown', key);
    measure(); paintState();
    if (disabled) {
      node.style.cssText = `width:${size * 220 / 230}px;height:${size}px;top:${top}px;transform:translate3d(${home}px,0,0) translateX(-50%)`;
      node.dataset.running = 'false';
    }
    return () => { stop(); clearTimeout(staticTimer); cancelAnimationFrame(measureFrame); observer.disconnect(); resize.disconnect(); window.removeEventListener('scroll', scheduleMeasure); window.removeEventListener('resize', scheduleMeasure); document.removeEventListener('visibilitychange', visibility); area.removeEventListener('click', click); name.removeEventListener('click', celebrate); name.removeEventListener('keydown', key); react.current = () => {}; };
  }, [section, heading, anchor, disabled, pointer]);
  return react;
}
