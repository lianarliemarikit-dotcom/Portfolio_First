import { useId, useRef, type RefObject } from 'react';
import { RobotBody } from './robot/RobotBody';
import { useRobotAnimation } from './robot/useRobotAnimation';

export function InteractiveRobot({ section, heading, disabled }: { section: RefObject<HTMLElement | null>; heading: RefObject<HTMLDivElement | null>; disabled: boolean }) {
  const anchor = useRef<HTMLDivElement>(null);
  const id = useId().replace(/:/g, '');
  const react = useRobotAnimation(section, heading, anchor, disabled);
  // Share the heading's existing DOM node so its layout and lettering remain intact.
  return <div ref={anchor} className="robot-anchor" data-emotion="neutral" data-state="idle">
    <button className="robot-button" aria-label="Wave to the floating robot" onClick={() => react.current('wave')} onFocus={() => react.current('happy')}>
      <RobotBody id={id}/>
    </button>
  </div>;
}
