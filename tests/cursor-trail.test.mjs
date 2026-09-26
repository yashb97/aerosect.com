import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CursorTrail } from '../src/scripts/cursor-trail.ts';

test('high polling-rate mice cannot grow the trail without bound', () => {
  const trail = new CursorTrail();
  for (let i = 0; i < 8000; i++) trail.add(i % 100, 20, i / 100);
  assert.ok(trail.points.length <= 40);
  assert.equal(trail.points.at(-1).x, 99);
});

test('stationary input expires instead of keeping an idle trail alive', () => {
  const trail = new CursorTrail();
  trail.add(10, 10, 0);
  trail.add(20, 20, 10);
  trail.add(20, 20, 150);
  trail.prune(211);
  assert.deepEqual(trail.points, []);
});

test('leaving and re-entering after a pause cannot bridge old positions', () => {
  const trail = new CursorTrail();
  trail.add(10, 10, 0);
  trail.add(30, 30, 10);
  trail.add(50, 50, 1000);
  assert.deepEqual(trail.points, [{ x: 50, y: 50, time: 1000 }]);
  trail.clear();
  trail.add(60, 60, 1010);
  assert.equal(trail.points.length, 1);
});

test('fast pointer jumps remain inside the small canvas', () => {
  const trail = new CursorTrail();
  trail.add(0, 0, 0);
  trail.add(100, 100, 10);
  trail.add(1500, 800, 20);
  assert.equal(trail.points.length, 1);
  trail.add(1510, 810, 30);
  assert.equal(trail.points.length, 2);
});
