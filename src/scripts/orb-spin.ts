type Vector = [number, number, number];

export class OrbSpin {
  orientation = [0, 0, 0, 1];
  velocity: Vector = [0, 0.075, 0];

  rotate(axis: Vector, angle: number) {
    const s = Math.sin(angle / 2);
    const [a, b, c] = axis.map(value => value * s);
    const d = Math.cos(angle / 2);
    const [x, y, z, w] = this.orientation;
    const q = [d*x+a*w+b*z-c*y, d*y-a*z+b*w+c*x,
      d*z+a*y-b*x+c*w, d*w-a*x-b*y-c*z];
    const length = Math.hypot(...q);
    this.orientation = q.map(value => value / length);
  }

  advance(seconds: number) {
    const speed = Math.hypot(...this.velocity);
    if (speed) this.rotate(this.velocity.map(v => v / speed) as Vector, speed * seconds);
  }

  drag(from: Vector, to: Vector, seconds: number) {
    const axis: Vector = [from[1]*to[2]-from[2]*to[1],
      from[2]*to[0]-from[0]*to[2], from[0]*to[1]-from[1]*to[0]];
    const length = Math.hypot(...axis);
    if (length < 1e-6) return;
    const unit = axis.map(v => v / length) as Vector;
    const dot = from.reduce((sum, value, i) => sum + value * to[i], 0);
    const angle = Math.atan2(length, dot);
    this.rotate(unit, angle);
    const speed = Math.min(3, angle / Math.max(seconds, 0.008));
    this.velocity = unit.map(v => v * speed) as Vector;
  }

  project(x: number, y: number, z: number) {
    const [a, b, c, w] = this.orientation;
    const tx = 2 * (b*z-c*y), ty = 2 * (c*x-a*z), tz = 2 * (a*y-b*x);
    return [x+w*tx+b*tz-c*ty, y+w*ty+c*tx-a*tz, z+w*tz+a*ty-b*tx];
  }
}
