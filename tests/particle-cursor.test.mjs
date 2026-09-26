import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { CursorTrail, TRAIL_LIFETIME } from '../src/scripts/cursor-trail.ts';

// Exercise the actual component script with a deterministic clock, media query
// and canvas double. No real browser or external test dependency is needed.
const component = readFileSync(new URL('../src/components/ParticleCursor.astro', import.meta.url), 'utf8');
const script = stripTypeScriptTypes(component.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/import .*? from .*?;/, ''));

class Emitter {
  listeners = new Map();
  addEventListener(type, callback) {
    const callbacks = this.listeners.get(type) ?? [];
    callbacks.push(callback);
    this.listeners.set(type, callbacks);
  }
  emit(type, event = {}) {
    for (const callback of this.listeners.get(type) ?? []) callback(event);
  }
}

class Target {
  constructor(cursor = 'url("/images/cursor-particle.svg") 12 12, auto', native = false) {
    this.cursor = cursor;
    this.native = native;
  }
  closest() { return this.native ? this : null; }
}

function setup(eligible = true, animations = true) {
  let now = 0;
  let nextFrame = 0;
  let strokes = 0;
  const circles = [];
  const frames = new Map();
  const context = {
    clearRect() {}, setTransform() {}, beginPath() {}, moveTo() {}, lineTo() {}, closePath() {},
    arc(...args) { circles.push(args); },
    fill() { strokes++; },
  };
  const canvas = { width: 1, height: 1, style: {}, getContext: () => context };
  const media = Object.assign(new Emitter(), { matches: eligible });
  const motion = Object.assign(new Emitter(), { matches: animations });
  const document = Object.assign(new Emitter(), {
    documentElement: { dataset: {} }, hidden: false, querySelector: () => canvas,
  });
  const window = Object.assign(new Emitter(), { devicePixelRatio: 3, matchMedia: query => query.includes('prefers-reduced-motion') ? motion : media });
  runInNewContext(script, {
    CursorTrail, TRAIL_LIFETIME, document, window, Element: Target,
    performance: { now: () => now },
    getComputedStyle: target => ({ cursor: target.cursor }),
    requestAnimationFrame: callback => { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame: id => frames.delete(id),
  });
  const target = new Target();
  return {
    canvas, document, window, media, motion, frames, circles,
    get strokes() { return strokes; },
    move(x, time, overrides = {}) {
      now = time;
      window.emit('pointermove', { clientX: x, clientY: 100, pointerType: 'mouse',
        isPrimary: true, buttons: 0, target, ...overrides });
    },
    tick(time) {
      now = time;
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach(callback => callback(time));
    },
  };
}

test('moving draws a bounded canvas; idle expires and schedules no more frames', () => {
  const app = setup();
  app.move(100, 0);
  app.move(120, 16);
  app.tick(17);
  assert.ok(app.strokes > 0);
  assert.equal(app.canvas.width, 768);
  assert.equal(app.canvas.height, 768);
  assert.equal(app.frames.size, 1);
  app.tick(250);
  assert.equal(app.frames.size, 0);
  assert.equal(app.canvas.style.visibility, 'hidden');
  app.move(130, 300);
  app.move(140, 320);
  app.tick(321);
  assert.equal(app.canvas.style.visibility, 'visible');
});

test('coarse pointers and high contrast leave native cursor and no canvas allocation', () => {
  const app = setup(false);
  app.move(100, 0);
  app.move(120, 16);
  assert.equal(app.document.documentElement.dataset.particleCursor, undefined);
  assert.equal(app.canvas.width, 1);
  assert.equal(app.frames.size, 0);
});

test('touch input and dragging do not activate or animate the cursor', () => {
  for (const overrides of [{ pointerType: 'touch' }, { pointerType: 'pen' }, { buttons: 1 }]) {
    const app = setup();
    app.move(100, 0, overrides);
    app.move(120, 16, overrides);
    assert.equal(app.document.documentElement.dataset.particleCursor, undefined);
    assert.equal(app.frames.size, 0);
  }
});

test('simulation canvases, resize handles and text inputs suppress the trail', () => {
  for (const target of [new Target('crosshair', true), new Target('ew-resize'), new Target('text', true)]) {
    const app = setup();
    app.move(100, 0);
    app.move(120, 16);
    app.move(125, 20, { target });
    assert.equal(app.frames.size, 0);
    assert.equal(app.canvas.style.visibility, 'hidden');
  }
});

test('releasing a mouse click restores the particle without starting animation', () => {
  const app = setup();
  app.move(100, 0);
  app.window.emit('pointerdown');
  assert.equal(app.document.documentElement.dataset.particleCursor, undefined);
  app.window.emit('pointerup', { pointerType: 'mouse', isPrimary: true });
  assert.equal(app.document.documentElement.dataset.particleCursor, 'active');
  assert.equal(app.frames.size, 0);
});

test('leaving, hiding, changing preferences and pressing clear pending animation', () => {
  for (const event of ['pointerleave', 'visibilitychange', 'change', 'blur', 'pagehide', 'pointerdown']) {
    const app = setup();
    app.move(100, 0);
    app.move(120, 16);
    if (event === 'change') app.media.emit(event);
    else if (event === 'visibilitychange') {
      app.document.hidden = true;
      app.document.emit(event);
    } else if (event === 'pointerleave') app.document.emit(event);
    else app.window.emit(event);
    assert.equal(app.frames.size, 0, event);
    assert.equal(app.document.documentElement.dataset.particleCursor, undefined, event);
  }
});


test('reduced motion preserves the particle without allocating a trail', () => {
  const app = setup(true, false);
  app.move(100, 0);
  app.move(120, 16);
  assert.equal(app.document.documentElement.dataset.particleCursor, 'active');
  assert.equal(app.canvas.width, 1);
  assert.equal(app.frames.size, 0);
});

test('motion preference changes clear only the trail and allow it to resume', () => {
  const app = setup();
  app.move(100, 0);
  app.move(120, 16);
  app.tick(17);
  app.motion.matches = false;
  app.motion.emit('change');
  assert.equal(app.document.documentElement.dataset.particleCursor, 'active');
  assert.equal(app.frames.size, 0);
  assert.equal(app.canvas.style.visibility, 'hidden');
  app.move(130, 30);
  assert.equal(app.frames.size, 0);
  app.motion.matches = true;
  app.motion.emit('change');
  app.move(140, 40);
  app.move(150, 60);
  app.tick(61);
  assert.equal(app.canvas.style.visibility, 'visible');
});

test('fast movement draws a circular head with the trail and restores the native marker on idle', () => {
  const app = setup();
  app.move(100, 0);
  app.move(290, 16);
  app.tick(17);
  assert.equal(app.document.documentElement.dataset.particleDrawing, 'active');
  assert.deepEqual(app.circles.at(-1), [256, 256, 2.5, 0, Math.PI * 2]);
  assert.equal(app.canvas.style.transform, 'translate3d(34px, -156px, 0)');
  app.tick(250);
  assert.equal(app.document.documentElement.dataset.particleDrawing, undefined);
  assert.equal(app.document.documentElement.dataset.particleCursor, 'active');
});
