import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';

import { OrbSpin } from '../src/scripts/orb-spin.ts';

const component = readFileSync(new URL('../src/components/HeroOrb.astro', import.meta.url), 'utf8');
const script = stripTypeScriptTypes(component.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/import .*? from .*?;/, ''));
function setup({ reduced = false, compact = false } = {}) {
  const emitter = (extra = {}) => ({ listeners: {}, addEventListener(name, cb) { this.listeners[name] = cb; }, ...extra });
  const frames = new Map();
  let next = 0;
  let paints = 0;
  let visibility;
  const ctx = { clearRect() { paints++; }, setTransform() {}, beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, stroke() {}, arc() {}, fill() {} };
  const canvas = emitter({ width: 1, height: 1, getContext: () => ctx });
  const button = emitter({ setAttribute() {} });
  const hero = emitter({ getBoundingClientRect: () => ({ left: 0, top: 0, width: 1400, height: 500 }) });
  const host = { clientWidth: 700, closest: () => hero, querySelector: s => s === 'canvas' ? canvas : button };
  const document = emitter({ hidden: false, querySelector: () => host });
  const motion = emitter({ matches: reduced });
  const mobile = emitter({ matches: compact });
  runInNewContext(script, {
    OrbSpin, document, window: emitter(), devicePixelRatio: 3,
    matchMedia: q => q.includes('reduced-motion') ? motion : mobile,
    requestAnimationFrame: cb => { frames.set(++next, cb); return next; },
    cancelAnimationFrame: id => frames.delete(id),
    IntersectionObserver: class { constructor(cb) { visibility = cb; } observe() {} },
    ResizeObserver: class { observe() {} },
  });
  return { canvas, button, document, frames, motion,
    get paints() { return paints; },
    show(value) { visibility([{ isIntersecting: value }]); },
  };
}

test('orb bounds its backing canvas and stops when offscreen or the tab is hidden', () => {
  const app = setup();
  assert.equal(app.canvas.width, 900);
  assert.equal(app.frames.size, 0);
  app.show(true);
  assert.equal(app.frames.size, 1);
  app.show(false);
  assert.equal(app.frames.size, 0);
  app.show(true);
  app.document.hidden = true;
  app.document.listeners.visibilitychange();
  assert.equal(app.frames.size, 0);
});

test('reduced motion paints a still image without scheduling animation', () => {
  const app = setup({ reduced: true });
  app.show(true);
  assert.equal(app.paints, 1);
  assert.equal(app.frames.size, 0);
});

test('small screens do not allocate the large canvas or run frames', () => {
  const app = setup({ compact: true });
  app.show(true);
  assert.equal(app.canvas.width, 1);
  assert.equal(app.paints, 0);
  assert.equal(app.frames.size, 0);
});

test('changing motion preference stops the animation loop', () => {
  const app = setup();
  app.show(true);
  assert.equal(app.frames.size, 1);
  app.motion.matches = true;
  app.motion.listeners.change();
  assert.equal(app.frames.size, 0);
});

test('drag imparts persistent spin along horizontal, vertical and roll axes', () => {
  for (const [from, to, axis] of [
    [[0, 0, 1], [0.6, 0, 0.8], 1],
    [[0, 0, 1], [0, 0.6, 0.8], 0],
    [[1, 0, 0], [0, 1, 0], 2],
  ]) {
    const spin = new OrbSpin();
    spin.drag(from, to, 0.016);
    assert.ok(Math.abs(spin.velocity[axis]) > 0);
    assert.ok(Math.hypot(...spin.velocity) <= 3.000001);
    const before = [...spin.orientation];
    for (let i = 0; i < 600; i++) spin.advance(1 / 60);
    assert.notDeepEqual(spin.orientation, before);
    assert.ok(Math.abs(Math.hypot(...spin.orientation) - 1) < 1e-12);
    assert.ok(Math.abs(Math.hypot(...spin.project(1, 0, 0)) - 1) < 1e-12);
  }
});
