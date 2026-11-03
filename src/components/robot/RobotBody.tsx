import { RobotFace } from './RobotFace';

export function RobotBody({ id }: { id: string }) {
  return <svg viewBox="0 0 220 230" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={`${id}-shell`} x1=".15" y1="0" x2=".8" y2="1" gradientUnits="objectBoundingBox"><stop stopColor="#fff"/><stop offset=".3" stopColor="#f1f0fc"/><stop offset=".58" stopColor="#b7b8cb"/><stop offset=".83" stopColor="#fefefe"/><stop offset="1" stopColor="#8e929d"/></linearGradient>
      <linearGradient id={`${id}-metal`} x2=".2" y2="1"><stop stopColor="#fff"/><stop offset=".3" stopColor="#9296a7"/><stop offset=".5" stopColor="#f5f8ff"/><stop offset="1" stopColor="#545663"/></linearGradient>
      <radialGradient id={`${id}-screen`} cx=".35" cy=".1" r=".85"><stop stopColor="#30343d"/><stop offset=".5" stopColor="#090e14"/><stop offset="1" stopColor="#020508"/></radialGradient>
      <radialGradient id={`${id}-shadow`}><stop stopColor="#d6f343" stopOpacity=".35"/><stop offset="1" stopColor="#d6f343" stopOpacity="0"/></radialGradient>
    </defs>
    <ellipse className="robot-shadow" cx="109" cy="220" rx="56" ry="7" fill={`url(#${id}-shadow)`}/>
    <g className="robot-pose">
      <path d="M97 131h23v24H97z" fill="#383e48"/>
      <g className="robot-arm robot-arm-left"><circle cx="69" cy="157" r="12" fill="#383e48"/><path d="M66 149q-20-2-27 30l17 10 23-27Z" fill={`url(#${id}-shell)`}/><rect x="34" y="175" width="23" height="25" rx="10" fill={`url(#${id}-screen)`} transform="rotate(24 45 187)"/><path d="m40 181-3 11m9-8-3 10" stroke="#777c8d" strokeWidth="1.5"/></g>
      <g className="robot-arm robot-arm-right"><circle cx="150" cy="157" r="12" fill="#383e48"/><path d="M152 149q21-1 27 29l-17 11-23-27Z" fill={`url(#${id}-shell)`}/><rect x="164" y="176" width="23" height="25" rx="10" fill={`url(#${id}-screen)`} transform="rotate(-24 175 188)"/><path d="m178 182 3 11m-9-8 3 10" stroke="#777c8d" strokeWidth="1.5"/></g>
      <path d="M73 150q36-18 72 0c9 20-8 60-35 61-28 0-45-41-37-61Z" fill={`url(#${id}-shell)`} stroke="#f6f6fa" strokeWidth="1"/>
      <path d="M87 146q22-7 45 0l-10 24H99Z" fill="#3b424a"/><path d="m101 149 17 0-8 13Z" fill="#d9f72e"/>
      <path d="M84 173q5 22 17 25" fill="none" stroke="#fff" strokeOpacity=".65" strokeWidth="3" strokeLinecap="round"/>
      <RobotFace id={id}/>
    </g>
    <g className="robot-sparkles" fill="#d9f72e"><path d="m21 27 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/><path d="m195 22 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/><circle cx="204" cy="133" r="3"/></g>
  </svg>;
}
