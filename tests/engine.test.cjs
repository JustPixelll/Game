'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Game = require('../web/engine.js');
const D = require('../web/content.js');
const near = (a,b,t=1e-6) => assert.ok(Math.abs(a-b)<t, `${a} != ${b}`);
const clone = x => JSON.parse(JSON.stringify(x));
// Rich fixtures are only for isolated mechanics, never used in campaign-check.cjs.
function fixture() {
 const g=new Game(); g.s.fame=10000; g.s.expansion=6; g.s.regionProgress.fill(4);
 for(const k of Object.keys(g.s.r)) g.s.r[k]=10000;
 for(let x=3;x<=15;x++) if(!g.at(x,9)) g.build('path',x,9);
 return g;
}
function put(g,type,x=9,y=10) { const r=g.build(type,x,y);assert.equal(r.ok,true,r.message);return r.building; }
const row=(g,b)=>g.economy().rows.find(r=>r.b.id===b.id);
function rawSave(g,edit) {const o=JSON.parse(g.export()),s=JSON.parse(o.data);edit(s);o.data=JSON.stringify(s);o.checksum=Game.checksum(o.data);return JSON.stringify(o);}
function crew(g,ids=['rowan','ada','nera']) {
 for(const id of ids) if(!g.s.heroes.some(h=>h.id===id))assert.equal(g.recruit(id).ok,true);
 for(const h of g.s.heroes){h.level=12;h.gear=5;h.condition=100;h.rest=0;}
 return ids;
}

test('fresh games have separate state, finite opening capital and one speed',()=>{
 const a=new Game(),b=new Game();assert.equal(a.s.version,2);assert.equal(a.s.r.gold,290);
 a.s.r.wood=0;assert.equal(b.s.r.wood,42);assert.equal(a.s.settings.speed,1);assert.equal(a.capacity,160);
 assert.equal(a.heroLevelCap,4);assert.equal(a.gearCap,1);assert.equal(a.buildingLevelCap,2);
});
test('invalid build attempts are fully transactional',()=>{
 const g=new Game(),before=clone(g.s);
 for(const [type,x,y] of [['constructor',9,9],['hall',9,9],['lumber',8,8],['farm',.5,9],['farm',0,0]])assert.equal(g.build(type,x,y).ok,false);
 assert.deepEqual(g.s,before);
});
test('building charges exact materials and stores a stable footprint',()=>{
 const g=new Game(),before=clone(g.s.r),b=put(g,'lumber',9,8);
 for(const k of Object.keys(before))near(g.s.r[k],before[k]-(D.buildings.lumber.cost[k]||0));
 assert.deepEqual([b.x,b.y,b.level,b.priority],[9,8,1,1]);
});
test('free paths and repeated buildings cannot farm infinite renown',()=>{
 const g=fixture();const f=g.s.fame;put(g,'path',9,8);assert.equal(g.s.fame,f);
 put(g,'lumber',9,10);const n=g.s.fame;put(g,'lumber',10,10);assert.equal(g.s.fame,n);
});
test('rank and frontier gates are checked even with ample money',()=>{
 const g=fixture();g.s.regionProgress.fill(0);assert.match(g.buildingUnlock('observatory'),/guardian/);
 assert.equal(g.build('observatory',9,10).ok,false);g.s.fame=0;assert.match(g.buildingUnlock('smith'),/rank/);
});
test('the museum is unique but existing v1 duplicate buildings can migrate',()=>{
 const g=fixture();put(g,'museum');assert.equal(g.build('museum',10,10).ok,false);
});
test('unconnected workplaces produce nothing and do not take workers',()=>{
 const g=fixture(),b=put(g,'lumber',12,4),e=row(g,b);assert.equal(e.connected,false);assert.equal(e.staff,0);assert.equal(e.out.wood,0);
});
test('edge-connected roads work; diagonals alone do not',()=>{
 const g=new Game();put(g,'lumber',10,10);assert.equal(g.connected().has(g.at(10,10).id),false);
 put(g,'path',9,9);assert.equal(g.connected().has(g.at(10,10).id),false);
 put(g,'path',10,9);assert.equal(g.connected().has(g.at(10,10).id),true);
});
test('new workplaces compete for finite workers; priorities reassign them',()=>{
 const g=fixture(),a=put(g,'mine',9),b=put(g,'smith',10),c=put(g,'library',11),d=put(g,'bakery',12);
 assert.equal(row(g,d).staff,0);assert.equal(g.setPriority(d.id,2).ok,true);assert.equal(row(g,d).staff,3);assert.ok(row(g,c).staff<2);
 assert.equal(g.setPriority(d.id,3).ok,false);assert.equal(g.setPriority(1,2).ok,false);
});
test('housing creates residents who also increase food consumption',()=>{
 const g=fixture(),a=g.economy();put(g,'cottage');const b=g.economy();assert.equal(b.population-a.population,4);near(b.foodUse-a.foodUse,5);
});
test('building upgrades increase both worker demand and input throughput',()=>{
 const g=fixture(),b=put(g,'smith'),before=row(g,b);assert.equal(g.upgrade(b.id).ok,true);const after=row(g,b);
 near(after.workers/before.workers,1.55);near(after.input.ore/before.input.ore,1.45);
});
test('pausing releases actual workers and stops inputs and output',()=>{
 const g=fixture(),a=put(g,'mine',9),b=put(g,'smith',10),c=put(g,'library',11),d=put(g,'bakery',12);
 assert.equal(row(g,d).staff,0);g.pauseBuilding(a.id);assert.equal(row(g,a).activity,0);assert.equal(row(g,a).input.gold,0);assert.equal(row(g,d).staff,3);
});
test('terrain increases output but does not increase input usage',()=>{
 const g=fixture(),a=put(g,'lumber');const find=(t)=>{for(let x=3;x<16;x++)if(!g.at(x,10)&&Game.terrain(x,10)===t)return[x,10];};
 const forest=find('forest'),plain=find('grass');assert.ok(forest&&plain);
 g.move(a.id,...plain);const p=row(g,a);g.move(a.id,...forest);const f=row(g,a);
 near(f.out.wood/p.out.wood,1.35);near(f.input.gold,p.input.gold);
});
test('neighbourhood bonuses improve yield, not resource consumption',()=>{
 const g=fixture(),a=put(g,'smith',9),b=put(g,'mine',12);const before=row(g,a);
 g.move(b.id,10,10);const after=row(g,a);near(after.out.tools/before.out.tools,1.35);near(after.input.ore,before.input.ore);near(after.input.wood,before.input.wood);
 assert.ok(g.s.combos.includes('ironworks'));
});
test('inactive neighbours cannot grant a combination bonus',()=>{
 const g=fixture(),a=put(g,'smith',9),b=put(g,'mine',10);assert.equal(row(g,a).combos.length,1);
 g.pauseBuilding(b.id);assert.equal(row(g,a).combos.length,0);
});
test('neighbourhood discoveries pay renown only once',()=>{
 const g=fixture(),a=put(g,'smith',9),b=put(g,'mine',10),f=g.s.fame;g.discoverCombos();g.move(b.id,12,10);g.move(b.id,10,10);assert.equal(g.s.fame,f);
});
test('factories never invent missing inputs',()=>{
 const g=fixture(),b=put(g,'smith');g.s.r.ore=0;g.s.r.tools=0;g.tick(60);assert.equal(g.s.r.tools,0);assert.match(row(g,b).status,/ore|iron/i);
});
test('the protected food reserve stops commercial consumption, not residents',()=>{
 const g=fixture();put(g,'market');g.s.r.food=30;const e=g.economy(),before=g.s.r.gold;assert.match(e.rows.find(r=>r.b.type==='market').status,/reserve/);
 g.tick(1);assert.ok(g.s.r.food<30);assert.ok(g.s.r.gold-before<1);
 assert.equal(g.setReserve(60).ok,true);assert.equal(g.setReserve(-1).ok,false);
});
test('ledger rates reflect actual shortages rather than imaginary production',()=>{
 const g=fixture();put(g,'smith');g.s.r.ore=0;g.s.r.tools=0;assert.equal(g.economy().rates.tools,0);
 g.s.r.ore=20;assert.ok(g.economy().rates.tools>0);
});
test('full stores stop a workshop from burning inputs, but it is still usable',()=>{
 const g=fixture(),b=put(g,'smith');const e=row(g,b);assert.equal(e.status,'Stores full');assert.equal(e.actual,0);assert.equal(g.working('smith'),true);
 const ore=g.s.r.ore;g.tick(10);assert.equal(g.s.r.ore,ore);assert.equal(g.equip('rowan').ok,true);
});
test('over-cap legacy stock is preserved instead of truncated on update',()=>{
 const g=new Game();g.s.r.wood=2999;g.s.r.stone=3000;g.tick(60);near(g.s.r.wood,2998.5);assert.equal(g.s.r.stone,3000);
});
test('warehouse capacity increases moderately, not six hundred per level',()=>{
 const g=fixture(),b=put(g,'warehouse');assert.equal(g.capacity,340);g.upgrade(b.id);assert.equal(g.capacity,400);
});
test('upgrades cannot bypass research gates',()=>{
 const g=fixture(),b=put(g,'lumber');assert.equal(g.upgrade(b.id).ok,true);assert.equal(g.upgrade(b.id).ok,false);
 g.s.research.push('masonry');assert.equal(g.upgrade(b.id).ok,true);assert.equal(g.upgrade(b.id).ok,false);
 g.s.research.push('scholarship');assert.equal(g.upgrade(b.id).ok,true);g.s.research.push('masterwork');assert.equal(g.upgrade(b.id).ok,true);assert.equal(g.upgrade(b.id).ok,false);
 assert.equal(g.upgrade(1).ok,false);
});
test('moving is free, integer-grid only, preserves upgrades and cannot overwrite',()=>{
 const g=fixture(),b=put(g,'lumber');g.upgrade(b.id);const r=clone(g.s.r);g.move(b.id,10,10);assert.deepEqual(g.s.r,r);assert.equal(b.level,2);
 assert.equal(g.move(b.id,1.5,5).ok,false);assert.equal(g.move(b.id,8,8).ok,false);assert.equal(g.move(1,9,10).ok,false);
});
test('demolition recovers only the original price and protects the hearth',()=>{
 const g=fixture(),b=put(g,'lumber');g.upgrade(b.id);const r=clone(g.s.r);assert.equal(g.demolish(b.id).ok,true);
 near(g.s.r.gold-r.gold,Math.floor(D.buildings.lumber.cost.gold*.6));assert.equal(g.demolish(1).ok,false);
});
test('previewing placement cannot spend, create buildings or award achievements',()=>{
 const g=new Game(),before=clone(g.s),p=g.placementReport('lumber',9,8);assert.equal(p.issue,null);assert.ok(p.row.connected);assert.ok(p.delta.wood>0);assert.deepEqual(g.s,before);
});
test('placement previews explain occupied plots and missing road access',()=>{
 const g=fixture();assert.match(g.placementReport('lumber',8,8).issue,/Occupied/);assert.equal(g.placementReport('lumber',12,4).row.connected,false);
});
test('placement previews include staffing displaced from other workplaces',()=>{
 const g=fixture();put(g,'mine',9);put(g,'smith',10);put(g,'library',11);
 g.s.r.knowledge=0;const p=g.placementReport('farm',12,10);assert.equal(p.row.staff,2);assert.ok(p.delta.knowledge<0);
});
test('land permits are earned in the field, not bought past guardians',()=>{
 const g=fixture();g.s.expansion=0;g.s.regionProgress.fill(0);assert.equal(g.expand().ok,false);
 g.s.regionProgress[0]=2;assert.equal(g.expand().ok,true);assert.equal(g.expand().ok,false);
 g.s.regionProgress.fill(4);for(let n=1;n<6;n++)assert.equal(g.expand().ok,true);assert.equal(g.expand().ok,false);
});
test('research needs a staffed, connected reading room and its frontier prerequisite',()=>{
 const g=fixture();assert.match(g.researchProblem('axes'),/reading room/);const b=put(g,'library');assert.equal(g.research('axes').ok,true);assert.equal(g.research('axes').ok,false);
 g.s.regionProgress.fill(0);assert.match(g.researchProblem('masterwork'),/guardian/);g.pauseBuilding(b.id);assert.equal(g.research('granaries').ok,false);
});
test('later equipment tiers stay gated even with vast stores and fame',()=>{
 const g=fixture();g.s.regionProgress.fill(0);put(g,'smith');assert.equal(g.equip('rowan').ok,true);assert.equal(g.equip('rowan').ok,false);assert.equal(g.s.heroes[0].gear,1);
});
test('new guild levels require guardians; training cannot remove that gate',()=>{
 const g=fixture();g.s.regionProgress.fill(0);put(g,'training');const h=g.s.heroes[0];h.level=4;assert.equal(g.train('rowan').ok,false);
 g.s.regionProgress[0]=4;assert.equal(g.heroLevelCap,6);assert.equal(g.train('rowan').ok,true);assert.equal(h.level,5);assert.ok(h.rest>0);
});
test('recruitment respects frontier gates and duplicates',()=>{
 const g=fixture();g.s.regionProgress.fill(0);assert.equal(g.recruit('flint').ok,false);assert.equal(g.recruit('ada').ok,true);assert.equal(g.recruit('ada').ok,false);
});
test('new game bold is unavailable without a genuine power advantage',()=>{
 const g=new Game(),p=g.preview(0,['rowan'],'bold');assert.ok(p.chance<.60);assert.match(p.warnings.join(' '),/Bold requires/);assert.equal(g.launch(0,['rowan'],'bold').ok,false);
});
test('only the first steady scouting journey is guided',()=>{
 const g=new Game();assert.equal(g.preview(0,['rowan']).chance,1);g.s.stats.wins=1;assert.ok(g.preview(0,['rowan']).chance<1);
 g.s.stats.wins=0;assert.equal(g.preview(0,['rowan'],'careful').tutorial,false);assert.equal(g.preview(0,['rowan'],'steady','light').tutorial,false);
});
test('equipment preparation is mandatory before the first guardian',()=>{
 const g=fixture();g.s.regionProgress.fill(0);g.s.regionProgress[0]=3;crew(g,['rowan','ada']);for(const h of g.s.heroes)h.gear=0;
 const p=g.preview(0,['rowan','ada']);assert.match(p.warnings.join(' '),/tier 1/);const r=clone(g.s.r);assert.equal(g.launch(0,['rowan','ada']).ok,false);assert.deepEqual(g.s.r,r);
});
test('regional expertise and Protection materially change guardian difficulty',()=>{
 const g=fixture();crew(g,['rowan','ada','nera','flint']);g.s.regionProgress[1]=3;
 assert.ok(g.preview(1,['flint']).difficulty<g.preview(1,['rowan']).difficulty);
 assert.ok(g.preview(1,['flint','ada']).difficulty<g.preview(1,['flint','rowan']).difficulty);
});
test('well-supplied parties cost more, improve odds and reduce wear',()=>{
 const g=fixture();crew(g,['rowan']);g.s.regionProgress[3]=1;const a=g.preview(3,['rowan'],'steady','light'),b=g.preview(3,['rowan'],'steady','stocked');
 assert.ok(b.cost.food>a.cost.food);assert.ok(b.cost.tools>a.cost.tools);assert.ok(b.chance>a.chance);assert.ok(b.wear<a.wear);
});
test('bold trades odds and equipment condition for loot and has an 88 percent cap',()=>{
 const g=fixture();const ids=crew(g);g.s.regionProgress[0]=1;const a=g.preview(0,ids,'careful'),b=g.preview(0,ids,'bold');
 assert.ok(a.chance>b.chance);assert.ok(a.time>b.time);assert.ok(a.wear<b.wear);assert.ok(b.rewardMult>a.rewardMult);assert.ok(b.chance<=.88);
});
test('equipment wear reduces real power and repairs consume real resources',()=>{
 const g=fixture();put(g,'smith');const h=g.s.heroes[0];h.gear=3;const a=g.power(['rowan'],2);h.condition=40;const b=g.power(['rowan'],2);assert.ok(b<a);
 const cost=g.repairCost(h),r=clone(g.s.r);assert.equal(g.repair('rowan').ok,true);assert.equal(h.condition,100);for(const[k,n]of Object.entries(cost))near(g.s.r[k],r[k]-n);
});
test('broken equipment cannot brute-force the next road',()=>{
 const g=fixture();crew(g);g.s.heroes[0].condition=34;assert.match(g.preview(0,['rowan']).warnings.join(' '),/Repair/);assert.equal(g.launch(0,['rowan']).ok,false);
});
test('later roads, minimum power and equipment are not bypassed with money',()=>{
 const g=fixture();g.s.regionProgress.fill(0);assert.equal(g.launch(1,['rowan']).ok,false);assert.match(g.regionProblem(1),/guardian/);
 g.s.regionProgress.fill(4);g.s.research=D.research.map(r=>r.id);g.s.regionProgress[6]=2;assert.equal(g.launch(6,['rowan']).ok,false);
});
test('final guardian requires an operating, supplied beacon',()=>{
 const g=fixture();const ids=crew(g,['ada','sable','orin']);g.s.research=D.research.map(r=>r.id);g.s.regionProgress[6]=3;
 assert.match(g.preview(6,ids,'careful','stocked').warnings.join(' '),/beacon/);put(g,'beacon');assert.ok(!g.preview(6,ids,'careful','stocked').warnings.some(x=>x.includes('beacon')));
 g.s.r.essence=0;assert.match(g.preview(6,ids).warnings.join(' '),/beacon/);
});
test('invalid, duplicate, empty and busy parties are rejected without spending',()=>{
 const g=new Game(),r=clone(g.s.r);
 for(const ids of [[],['rowan','rowan'],['invented']])assert.equal(g.launch(0,ids).ok,false);
 for(const [mode,supply]of[['fast','standard'],['steady','constructor']])assert.equal(g.launch(0,['rowan'],mode,supply).ok,false);
 assert.equal(g.preview(0,[],'steady','constructor'),null);assert.deepEqual(g.s.r,r);
 assert.equal(g.launch(0,['rowan']).ok,true);const food=g.s.r.food;assert.equal(g.launch(0,['rowan']).ok,false);assert.equal(g.s.r.food,food);
});
test('the first journey pays only once and earns its first relic',()=>{
 const g=new Game();g.launch(0,['rowan']);g.tick(48);const m=g.s.missions[0];assert.equal(g.s.stats.wins,1);assert.equal(g.s.regionProgress[0],1);assert.equal(m.result.found,D.regions[0].relics[0]);
 const r=clone(g.s.r);g.finishMission(m);assert.deepEqual(g.s.r,r);g.acknowledgeMission(m.id);assert.equal(g.s.missions.length,0);
});
test('landmarks one, three and guardian guarantee the three distinct relics',()=>{
 const g=fixture();crew(g);g.s.regionProgress[0]=0;const found=[];g.rand=()=>0;
 for(let stage=0;stage<4;stage++){g.s.heroes.forEach(h=>{h.rest=0;h.condition=100;});const r=g.launch(0,['rowan','ada','nera'],'careful','stocked');assert.equal(r.ok,true,r.message);const m=g.s.missions.at(-1);g.tick(m.total);if([0,2,3].includes(stage))found.push(m.result.found);}
 assert.deepEqual(found,D.regions[0].relics);assert.equal(g.s.regionProgress[0],4);
});
test('return trips cannot repeat first-clear rewards or advance beyond four',()=>{
 const g=fixture();crew(g);g.s.relics=Object.fromEntries(D.regions[0].relics.map(id=>[id,1]));g.rand=()=>0;g.launch(0,['rowan'],'careful','stocked');const m=g.s.missions[0];g.tick(m.total);
 assert.equal(g.s.regionProgress[0],4);assert.equal(m.result.reward.fame,3);assert.ok(m.result.reward.gold<100);
});
test('failed expeditions cost supplies, wear equipment and never delete heroes',()=>{
 const g=fixture();crew(g);g.s.regionProgress[0]=1;g.rand=()=>.9999;const before=g.s.r.food;assert.equal(g.launch(0,['rowan'],'careful','standard').ok,true);assert.ok(g.s.r.food<before);
 const m=g.s.missions[0];g.tick(m.total);assert.equal(m.result.success,false);assert.equal(g.s.stats.losses,1);assert.equal(g.s.heroes.length,3);assert.ok(g.s.heroes[0].condition<90);assert.equal(g.s.regionProgress[0],1);
});
test('zero-cost local gathering is a recovery route, not campaign farming',()=>{
 const g=new Game();for(const k of Object.keys(g.s.r))g.s.r[k]=0;g.s.heroes[0].condition=0;
 assert.equal(g.forage('rowan').ok,true);g.tick(45);assert.ok(g.s.r.food>0);assert.ok(g.s.r.wood>0);assert.equal(g.s.stats.wins,0);assert.equal(g.s.fame,0);assert.equal(g.s.heroes[0].xp,0);assert.equal(g.s.heroes[0].condition,0);
});
test('targeted surveys recover missing relics without duplicate-drop grinding',()=>{
 const g=fixture();crew(g);put(g,'museum');const target=D.regions[0].relics[2];const p=g.preview(0,['rowan'],'careful','stocked',target);assert.equal(p.chance,1);assert.ok(p.cost.knowledge>0);
 assert.equal(g.launch(0,['rowan'],'careful','stocked',target).ok,true);const m=g.s.missions[0];g.rand=()=>.9999;g.tick(m.total);assert.equal(m.result.found,target);assert.equal(m.result.success,true);
});
test('surveys require the cleared region, valid relic and an active museum',()=>{
 const g=fixture();crew(g);assert.equal(g.launch(0,['rowan'],'careful','standard','antler').ok,false);put(g,'museum');assert.equal(g.launch(0,['rowan'],'bold','standard','antler').ok,false);
 assert.equal(g.launch(0,['rowan'],'careful','standard','not-a-relic').ok,false);g.s.regionProgress[0]=2;assert.equal(g.launch(0,['rowan'],'careful','standard','antler').ok,false);
});
test('mission choices are optional, time-bounded and accepted only once',()=>{
 const g=new Game();g.launch(0,['rowan']);const m=g.s.missions[0];assert.equal(g.chooseMission(m.id,0).ok,false);g.tick(22);assert.equal(g.chooseMission(m.id,0).ok,true);assert.equal(g.chooseMission(m.id,1).ok,false);
});
test('mid-journey save round trips keep identical outcomes and supplies',()=>{
 const g=new Game();g.launch(0,['rowan']);g.tick(22);const h=Game.import(g.export());g.tick(70);h.tick(70);assert.deepEqual(g.s.r,h.s.r);assert.deepEqual(g.s.missions,h.s.missions);assert.equal(g.s.seed,h.s.seed);
});
test('finished reports survive import without duplicate rewards',()=>{
 const g=new Game();g.launch(0,['rowan']);g.tick(48);const h=Game.import(g.export()),r=clone(h.s.r);h.finishMission(h.s.missions[0]);assert.deepEqual(h.s.r,r);assert.equal(h.s.stats.wins,1);
});
test('contracts require real deliveries and cannot pay twice',()=>{
 const g=fixture(),c=g.s.contracts[0],before=g.s.r[c.resource];assert.equal(g.fulfill(c.id).ok,true);assert.equal(g.s.r[c.resource],before-c.amount);assert.equal(g.fulfill(c.id).ok,false);
});
test('merchant stock is finite, restocks at dawn, and cannot sell advanced goods',()=>{
 const g=fixture();g.s.r.wood=0;assert.equal(g.trade('wood',25,true).ok,true);assert.equal(g.trade('wood',25,true).ok,false);
 for(const k of ['tools','knowledge','essence'])assert.equal(g.trade(k,10,true).ok,false);g.tick(D.DAY);assert.equal(g.s.shopStock.wood,40);
});
test('trading has no arbitrage and respects amount, storage and ownership',()=>{
 const g=new Game(),gold=g.s.r.gold;g.trade('wood',10,true);g.trade('wood',10,false);assert.ok(g.s.r.gold<gold);assert.equal(g.trade('food',-10,true).ok,false);
 assert.equal(g.trade('ore',10,true).ok,false);g.s.r.wood=g.capacity;assert.equal(g.trade('wood',10,true).ok,false);
});
test('events require their costs and do not pay twice',()=>{
 const g=fixture();g.s.event={index:0,day:1};assert.equal(g.chooseEvent(0).ok,true);assert.equal(g.chooseEvent(0).ok,false);
});
test('charter and achievement rewards enforce objectives and one-time claims',()=>{
 const g=new Game();assert.equal(g.claimChapter().ok,false);put(g,'lumber',9,8);assert.equal(g.claimChapter().ok,true);assert.equal(g.claimChapter().ok,false);
 g.s.stats.built=5;assert.equal(g.claimAchievement('foundations').ok,true);assert.equal(g.claimAchievement('foundations').ok,false);
});
test('inactivity cannot passively unlock the whole technology tree',()=>{
 const g=new Game();g.tick(900);assert.equal(g.rank,1);assert.equal(g.gearCap,1);assert.equal(g.s.research.length,0);assert.equal(g.s.fame,0);
});
test('winter constrains outdoor agriculture, not a supplied greenhouse',()=>{
 const g=fixture();put(g,'cottage',9,8);const a=put(g,'farm',9),b=put(g,'greenhouse',10);const spring=row(g,a).out.food,glass=row(g,b).out.food;
 g.s.elapsed=15*D.DAY;assert.ok(row(g,a).out.food<spring*.7);near(row(g,b).out.food,glass);
});
test('long shortages keep every resource finite and nonnegative',()=>{
 const g=fixture();put(g,'smith',9);put(g,'bakery',10);put(g,'observatory',11);for(const k of Object.keys(g.s.r))g.s.r[k]=0;g.tick(1800);
 for(const n of Object.values(g.s.r))assert.ok(Number.isFinite(n)&&n>=0);
});
test('v1 migration preserves the old town, stock, gear, discoveries and achievements',()=>{
 const text=fs.readFileSync(path.join(__dirname,'fixtures/v1-completed.json'),'utf8');const old=JSON.parse(JSON.parse(text).data),g=Game.import(text);
 assert.equal(g.s.version,2);assert.equal(g.s.migratedFrom,1);assert.deepEqual(g.s.r,old.r);assert.deepEqual(g.s.relics,old.relics);assert.deepEqual(g.s.achievements,old.achievements);assert.deepEqual(g.s.regionProgress,old.regionProgress);
 assert.equal(g.s.chapter,old.chapter);assert.deepEqual(g.s.buildings.map(b=>[b.id,b.type,b.x,b.y,b.level]),old.buildings.map(b=>[b.id,b.type,b.x,b.y,b.level]));assert.ok(g.s.heroes.every(h=>h.condition===100));
});
test('old speed-up settings migrate to normal, with pause preserved',()=>{
 const g=new Game();for(const speed of [1,2,4,999])assert.equal(Game.import(rawSave(g,s=>{s.version=1;s.settings.speed=speed;})).s.settings.speed,1);
 assert.equal(Game.import(rawSave(g,s=>s.settings.speed=0)).s.settings.speed,0);
});
test('v2 state round trips keep priorities, equipment condition and food reserves',()=>{
 const g=fixture(),b=put(g,'smith');g.setPriority(b.id,2);g.setReserve(60);g.s.heroes[0].condition=61;const h=Game.import(g.export());assert.equal(h.at(9,10).priority,2);assert.equal(h.s.foodReserve,60);assert.equal(h.s.heroes[0].condition,61);
});
test('bad JSON, checksum, format, schema and oversized saves are rejected',()=>{
 const g=new Game();for(const s of ['{','null','x'.repeat(2000001)])assert.throws(()=>Game.import(s));
 const o=JSON.parse(g.export());o.data=o.data.replace('Bramblehaven','Other town');assert.throws(()=>Game.import(JSON.stringify(o)),/checksum/);
 assert.throws(()=>Game.import(rawSave(g,s=>s.version=999)));
});
test('invalid numbers, inherited content, conflicting plots and duplicate heroes are rejected',()=>{
 const g=new Game();for(const edit of [s=>s.r.gold=-1,s=>s.r.food='1',s=>s.buildings.push({...s.buildings[0],id:99}),s=>s.buildings[0].type='constructor',s=>s.buildings=[],s=>s.heroes.push({...s.heroes[0]}),s=>s.heroes[0].condition=101,s=>s.research.push('madeup'),s=>s.relics.unknown=1])assert.throws(()=>Game.import(rawSave(g,edit)));
});
test('failed import never changes the running town',()=>{
 const g=new Game(),before=clone(g.s);assert.throws(()=>Game.import(rawSave(g,s=>s.r.food=-1)));delete before.lastSave;const after=clone(g.s);delete after.lastSave;assert.deepEqual(after,before);
});
test('names and log entries remain text through export and import',()=>{
 const g=new Game();g.s.name='<img src=x>';g.s.log=[{day:1,text:'<script>alert(1)</script>'}];const h=Game.import(g.export());assert.equal(h.s.name,g.s.name);assert.equal(h.s.log[0].text,g.s.log[0].text);
});
test('optional legacy retains relics but resets the economic and frontier challenge',()=>{
 const g=fixture();assert.equal(g.prestige('Again').ok,false);g.s.chapter=D.chapters.length;g.s.relics.acorn=2;g.s.legacy=10;assert.equal(g.prestige('Again').ok,true);
 assert.equal(g.s.r.gold,290);assert.equal(g.s.relics.acorn,2);assert.equal(g.s.legacy,10);assert.equal(g.s.chapter,0);assert.equal(g.guardians,0);assert.equal(g.gearCap,1);
});
test('all content references, gates and final objectives are internally valid',()=>{
 const research=new Set(D.research.map(x=>x.id));for(const d of [...Object.values(D.buildings),...D.heroes,...D.research,...D.regions]){if(d.gate!==undefined)assert.ok(D.regions[d.gate]);for(const id of (Array.isArray(d.requires)?d.requires:d.requires?[d.requires]:[]))assert.ok(research.has(id));}
 for(const c of D.combos){assert.ok(D.buildings[c.a]);assert.ok(D.buildings[c.b]);}for(const r of D.regions){assert.equal(r.stages.length,4);for(const id of r.relics)assert.ok(D.relics.some(x=>x.id===id));}
 assert.equal(D.relics.length,21);assert.equal(D.heroes.length,8);assert.equal(D.achievements.length,29);assert.equal(Object.keys(D.buildings).length,23);
});
