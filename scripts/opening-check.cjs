// Public-action opening regression. No resource, equipment, rank or progress grants.
'use strict';
const assert=require('node:assert/strict');
const {play}=require('./campaign-check.cjs');
const {g,report}=play(187319,900,false);
assert.ok(g.s.stats.wins>0,'The ordinary opening must allow actual expeditions.');
assert.ok(g.guardians>=1,'The first guardian must be reachable with preparation.');
assert.ok(g.guardians<3,'The opening policy must not clear the whole frontier.');
assert.ok(g.s.research.length<5,'The opening should leave research decisions ahead.');
assert.ok(g.s.heroes.every(h=>h.gear<=2),'Late equipment must not appear in the opening.');
assert.ok(g.s.chapter<15);
for(const n of Object.values(g.s.r))assert.ok(Number.isFinite(n)&&n>=0);
console.log(`PASS ordinary-action opening: ${g.s.elapsed} seconds; ${g.guardians}/7 guardians; ${g.s.research.length}/14 research; ${g.s.chapter}/15 charter chapters; highest equipment tier ${Math.max(...g.s.heroes.map(h=>h.gear))}. No resource/progress grants.`);
