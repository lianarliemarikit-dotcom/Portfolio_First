export type RobotState = 'idle' | 'blink' | 'hover' | 'follow' | 'lookLeft' | 'lookRight' | 'lookUp' | 'lookDown' | 'happy' | 'excited' | 'surprised' | 'thinking' | 'sad' | 'sleepy' | 'wave' | 'bounce' | 'returnHome';
export type Emotion = 'neutral' | 'happy' | 'excited' | 'surprised' | 'thinking' | 'sad' | 'sleepy' | 'blink';
const reactions: Partial<Record<RobotState, { priority: number; duration: number; emotion: Emotion }>> = {
  happy: { priority: 2, duration: 1600, emotion: 'happy' },
  wave: { priority: 3, duration: 1800, emotion: 'happy' },
  excited: { priority: 5, duration: 1300, emotion: 'excited' },
  bounce: { priority: 4, duration: 900, emotion: 'happy' },
  surprised: { priority: 4, duration: 700, emotion: 'surprised' },
  sad: { priority: 3, duration: 1500, emotion: 'sad' },
};
/** One temporary reaction owns the pose; lower priority input cannot interrupt it. */
export class RobotMachine {
  state: RobotState = 'idle';
  emotion: Emotion = 'neutral';
  until = 0;
  since = 0;
  priority = 0;
  react(state: RobotState, now: number) {
    const reaction = reactions[state];
    if (!reaction || (now < this.until && reaction.priority < this.priority)) return;
    this.state = state; this.emotion = reaction.emotion; this.priority = reaction.priority;
    this.since = now; this.until = now + reaction.duration;
  }
  update(now: number, base: RobotState) {
    if (now < this.until) return;
    this.priority = 0; this.state = base;
    this.emotion = base === 'sleepy' ? 'sleepy' : base === 'thinking' ? 'thinking' : base === 'hover' ? 'happy' : base === 'blink' ? 'blink' : 'neutral';
  }
}
