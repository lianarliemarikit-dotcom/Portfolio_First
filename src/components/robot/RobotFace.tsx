import { RobotEyes } from './RobotEyes';

export function RobotFace({ id }: { id: string }) {
  return <g className="robot-head">
    <ellipse cx="26" cy="88" rx="14" ry="28" fill={`url(#${id}-metal)`}/><ellipse cx="26" cy="88" rx="8" ry="22" fill="#283238" stroke="#d9f54a" strokeWidth="3"/>
    <ellipse cx="190" cy="88" rx="14" ry="28" fill={`url(#${id}-metal)`}/><ellipse cx="190" cy="88" rx="8" ry="22" fill="#283238" stroke="#d9f54a" strokeWidth="3"/>
    <path d="M26 77C27 8 188 6 191 77l-1 30c-3 50-158 51-162 0Z" fill={`url(#${id}-shell)`} stroke="#fff" strokeWidth="1.3"/>
    <path d="M38 80C43 37 169 34 180 77l-2 29c-6 30-130 35-138 0Z" fill={`url(#${id}-screen)`} stroke="#646b79" strokeWidth="2"/>
    <path d="M52 66q57-31 111-4" fill="none" stroke="#fff" strokeOpacity=".18" strokeWidth="4" strokeLinecap="round"/>
    <RobotEyes/>
    <g fill="#d7faff" fillOpacity=".035" stroke={`url(#${id}-metal)`} strokeWidth="4">
      <rect x="42" y="72" width="53" height="48" rx="15" transform="rotate(-5 68 96)"/>
      <rect x="120" y="71" width="53" height="48" rx="15" transform="rotate(-5 145 95)"/>
      <path d="M95 87q13-10 25-2M29 81l13 4m131-9 16-6" fill="none"/>
    </g>
    <path d="m48 83 9-5m69 4 10-5" stroke="white" strokeOpacity=".6" strokeWidth="2" strokeLinecap="round"/>
  </g>;
}
