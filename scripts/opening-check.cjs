// Deterministic ten-minute opening playthrough: only public game actions, no grants.
const assert=require('node:assert/strict');
const G=require('../web/engine.js'),D=require('../web/content.js');
const g=new G();g.s.started=true;
const build=(type,x,y)=>{const r=g.build(type,x,y);assert.equal(r.ok,true,`${type}: ${r.message}`);};
build('lumber',9,8);g.claimChapter();build('farm',7,7);g.claimChapter();
build('path',9,9);build('path',7,6);g.claimChapter();
assert.equal(g.launch(0,['rowan']).ok,true);g.tick(50);g.acknowledgeMission(g.s.missions[0].id);g.claimChapter();
build('cottage',9,10);g.claimChapter();build('market',8,10);g.claimChapter();
assert.equal(g.recruit('ada').ok,true);g.claimChapter();
build('quarry',10,9);g.tick(120);
let choices=0;
for(let t=0;t<430;t++){
 for(const m of [...g.s.missions]){if(m.done)g.acknowledgeMission(m.id);else if(m.choice===null&&m.remaining<=m.total*.6){g.chooseMission(m.id,1);choices++;}}
 if(!g.s.missions.length&&g.s.heroes.every(h=>h.rest<=0))g.launch(0,['rowan','ada'],'careful');
 for(const a of D.achievements)g.claimAchievement(a.id);
 for(const c of g.s.contracts)if(g.s.r[c.resource]>c.amount+80)g.fulfill(c.id);
 if(!g.count('smith')&&g.affordable(D.buildings.smith.cost)){g.build('smith',10,8);g.claimChapter();}
 if(g.count('smith')&&!g.count('mine')&&g.affordable(D.buildings.mine.cost))g.build('mine',10,7);
 if(g.s.event)g.chooseEvent(1);
 g.tick(1);
}
assert.ok(g.rank>=3);assert.ok(g.s.chapter>=8);assert.ok(g.s.stats.wins>=4);
for(const n of Object.values(g.s.r))assert.ok(Number.isFinite(n)&&n>=0);
assert.equal(G.import(g.export()).s.chapter,g.s.chapter);
console.log(`PASS opening: ${Math.round(g.s.elapsed)} game seconds; rank ${g.rank}; chapter ${g.s.chapter}/15; ${g.s.stats.wins} wins; ${g.s.heroes.length} heroes; ${choices} decisions. No resource/state grants.`);
