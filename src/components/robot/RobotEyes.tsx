export function RobotEyes() {
  return <g className="robot-gaze" fill="none" stroke="#61f2ff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <g className="robot-expression" data-face="neutral"><path d="M65 91v10M142 91v10" /></g>
    <g className="robot-expression" data-face="happy"><path d="M56 100Q67 78 79 100M133 100Q145 78 157 100" /></g>
    <g className="robot-expression" data-face="excited"><path d="m57 86 19 11-19 9m100-20-19 11 19 9"/><path d="M100 112q8 10 16 0" strokeWidth="3"/></g>
    <g className="robot-expression" data-face="surprised"><ellipse cx="68" cy="96" rx="10" ry="13"/><ellipse cx="145" cy="96" rx="10" ry="13"/><ellipse cx="107" cy="116" rx="4" ry="5" strokeWidth="3"/></g>
    <g className="robot-expression" data-face="thinking"><path d="M56 95h22M134 101h22M103 116h10"/></g>
    <g className="robot-expression" data-face="sad"><path d="M56 102q12-15 23-5M133 97q12-10 23 5"/></g>
    <g className="robot-expression" data-face="sleepy"><path d="M56 99q12 12 23 0M133 99q12 12 23 0" strokeWidth="3"/></g>
    <g className="robot-expression" data-face="blink"><path d="M56 99h23M133 99h23" strokeWidth="3"/></g>
  </g>;
}
