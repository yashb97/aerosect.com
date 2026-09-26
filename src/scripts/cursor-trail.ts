export type TrailPoint = { x: number; y: number; time: number };

// Fixed work and memory bounds, independent of screen size and mouse polling rate.
export const TRAIL_LIFETIME = 200;
export const TRAIL_LIMIT = 40;
export const TRAIL_RADIUS = 220;

export class CursorTrail {
  readonly points: TrailPoint[] = [];

  clear() {
    this.points.length = 0;
  }

  add(x: number, y: number, time: number) {
    this.prune(time);
    const previous = this.points[this.points.length - 1];
    // Stationary events must not keep the animation alive.
    if (previous && previous.x === x && previous.y === y) return;
    // Coalesce high-frequency events into 5 ms buckets, retaining the latest
    // position without shortening the tail on 1000–8000 Hz gaming mice.
    if (previous && Math.floor(previous.time / 5) === Math.floor(time / 5)) {
      this.points[this.points.length - 1] = { x, y, time };
    } else {
      this.points.push({ x, y, time });
    }
    if (this.points.length > TRAIL_LIMIT) this.points.shift();
    this.prune(time);
  }

  prune(now: number) {
    const head = this.points[this.points.length - 1];
    if (!head) return;
    // Discard the prefix through any distant point: a pointer jump must never
    // draw a long bridge or require a viewport-sized backing canvas.
    let discard = 0;
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      if (now - point.time >= TRAIL_LIFETIME ||
          Math.hypot(head.x - point.x, head.y - point.y) > TRAIL_RADIUS) {
        discard = i + 1;
      }
    }
    if (discard) this.points.splice(0, discard);
  }
}
