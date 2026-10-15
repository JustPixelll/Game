// Automated policy using ordinary game actions. Time is advanced, never resources/progress.
// This is a feasibility/regression test, not a claim of human completion time or optimal play.
'use strict';
const assert=require('node:assert/strict');
const G=require('../web/engine.js'),D=require('../web/content.js');
function play(seed=187319, maxTime=14400, verbose=false){
 const g=new G();if(seed!==187319)g.s.seed=seed;g.s.started=true;
 const notes=[],marks=[],failed=new Map();let current=0,acts=0,streetExpansion=-1;
 function note(text){if(verbose)console.log(Math.floor(g.s.elapsed/60)+'m '+text);notes.push([g.s.elapsed,text]);}
 function action(r,what){if(r.ok){acts++;if(what)note(what);return true;}failed.set(r.message,(failed.get(r.message)||0)+1);return false;}
 function roads(x,y){
  const conn=g.connected(),seen=new Set(),q=[];
  for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const a=x+dx,b=y+dy,at=g.at(a,b);if(at&&conn.has(at.id)&&['path','hall'].includes(at.type))return[];if(g.unlocked(a,b)&&G.terrain(a,b)!=='water'&&!at){q.push({x:a,y:b,path:[[a,b]]});seen.add(a+','+b);}}
  for(let i=0;i<q.length;i++){const a=q[i];for(const [dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const xx=a.x+dx,yy=a.y+dy,b=g.at(xx,yy);if(b&&conn.has(b.id)&&['path','hall'].includes(b.type))return a.path;if(xx===x&&yy===y||!g.unlocked(xx,yy)||G.terrain(xx,yy)==='water'||b||seen.has(xx+','+yy))continue;seen.add(xx+','+yy);q.push({x:xx,y:yy,path:[...a.path,[xx,yy]]});}}
  return null;
 }
 function build(type){if(g.buildingUnlock(type)||!g.affordable(D.buildings[type].cost))return false;
  const candidates=[];for(let x=0;x<18;x++)for(let y=0;y<18;y++){if(g.placement(type,x,y))continue;const path=roads(x,y);if(!path)continue;const combo=D.combos.filter(c=>(c.a===type||c.b===type)&&g.s.buildings.some(b=>b.type===(c.a===type?c.b:c.a)&&Math.max(Math.abs(b.x-x),Math.abs(b.y-y))===1)).length;
   const score=combo*5+(G.terrain(x,y)===D.buildings[type].terrain?6:0)-path.length*2-Math.abs(x-8)*.05-Math.abs(y-8)*.05;
   candidates.push({x,y,path,score});}
  candidates.sort((a,b)=>b.score-a.score);if(!candidates.length)return false;const p=candidates[0];for(const[x,y]of p.path.reverse())g.build('path',x,y);return action(g.build(type,p.x,p.y),'build '+type);
 }
 function have(type,n=1){if(g.count(type)>=n)return false;return build(type);}
 function upgrade(type){const b=g.s.buildings.filter(b=>b.type===type&&!g.upgradeProblem(b)&&g.affordable(g.upgradeCost(b))).sort((a,b)=>a.level-b.level)[0];return b?action(g.upgrade(b.id),'upgrade '+type+' '+b.level):false;}
 function selectParty(region){const available=g.s.heroes.filter(h=>h.rest<=0&&!g.busy(h.id));const combos=[];
  for(let mask=1;mask<(1<<available.length);mask++){const ids=available.filter((h,i)=>mask&(1<<i)).map(h=>h.id);if(ids.length>3)continue;const p=g.preview(region,ids,'careful','stocked');if(p.warnings.length===0&&g.affordable(p.cost))combos.push({ids,p});}
  combos.sort((a,b)=>(b.p.chance-a.p.chance)||a.p.cost.food-b.p.cost.food);return combos[0];
 }
 for(let t=0;t<maxTime;t+=5){
  if(streetExpansion!==g.s.expansion){for(let x=0;x<18;x++)for(let y=0;y<18;y++)if((x%3===2||y%3===0)&&g.unlocked(x,y)&&!g.at(x,y))g.build('path',x,y);streetExpansion=g.s.expansion;}

  for(const m of [...g.s.missions])if(m.done)g.acknowledgeMission(m.id);
  while(g.claimChapter().ok)acts++;
  for(const a of D.achievements)if(g.claimAchievement(a.id).ok)acts++;
  if(g.s.event){const e=D.events[g.s.event.index];const opts=e.choices.map((c,i)=>({c,i})).filter(x=>g.affordable(x.c.cost||{}));if(opts.length){const i=opts.find(x=>!x.c.cost||Object.keys(x.c.cost).length===0)||opts[0];action(g.chooseEvent(i.i));}}
  // Contracts sell only real surplus. Do not sell scarce gear/research fuel.
  for(const c of g.s.contracts)if(!c.done&&['wood','stone','food','ore'].includes(c.resource)&&g.s.r[c.resource]>c.amount+Math.max(60,g.capacity*.45))action(g.fulfill(c.id));
  current=g.s.regionProgress.findIndex(n=>n<4);if(current<0)current=6;
  while(marks.length<g.guardians){marks.push({minute:Math.round(g.s.elapsed/60*10)/10,guardian:g.guardians,research:g.s.research.length,stock:{...g.s.r},heroes:g.s.heroes.map(h=>({id:h.id,gear:h.gear,level:h.level}))});note('GUARDIAN '+g.guardians);}
  if(g.s.chapter===D.chapters.length)break;
  let built=false;
  const opening=[['lumber',1],['farm',1],['quarry',1],['cottage',2],['market',1],['farm',2],['mine',1],['smith',1],['library',1],['warehouse',1],['training',1]];
  for(const[type,n]of opening)if(g.count(type)<n){built=have(type,n);break;}
  if(!g.s.heroes.some(h=>h.id==='ada')&&!g.recruitProblem('ada'))action(g.recruit('ada'),'recruit ada');
  // Rebalance available hands; extra workstations without hands do not solve shortages.
  let e=g.economy();if(e.spare<1&&g.s.buildings.some(b=>D.buildings[b.type].workers&&!b.paused)&&g.count('cottage')<13)built=have('cottage',g.count('cottage')+1)||built;
  e=g.economy();if(e.rates.food<3&&g.s.r.food<90)built=have('farm',g.count('farm')+1)||built;
  const infrastructure=[['bakery',2],['windmill',1],['warehouse',2],['garden',2],['lumber',2]];
  const needInfra=g.count('training')?infrastructure.find(([type,n])=>g.count(type)<n&&!g.buildingUnlock(type)):null;
  if(needInfra)built=have(needInfra[0],needInfra[1])||built;
  if(g.s.elapsed>180&&g.count('smith')){
   if(g.count('training')&&g.s.r.gold<180)built=have('bakery',Math.min(2,g.count('bakery')+1))||built;
   if(g.count('library')&&g.count('training')&&!needInfra){const next=['maps','metallurgy','granaries','logistics','scholarship','resonance','masterwork','paving','axes','masonry','mentors','trade','survey','cartography'].find(id=>!g.researchProblem(id));if(next&&g.affordable(D.research.find(r=>r.id===next).cost))action(g.research(next),'research '+next);}
   if(g.s.expansion<3&&!g.expansionProblem()&&g.s.r.gold>g.expansionCost().gold+120)action(g.expand(),'expand');
   if(g.guardians>=1&&g.count('training')&&!needInfra){for(const id of ['flint','nera','sable','orin']){if(g.s.heroes.some(h=>h.id===id))continue;if(!g.recruitProblem(id)&&g.affordable(D.heroes.find(h=>h.id===id).cost)){action(g.recruit(id),'recruit '+id);break;}}}
   const targetTier=Math.min(g.gearCap, Math.max(1,D.regions[current].guardianGear));
   for(const h of g.s.heroes){if(g.busy(h.id))continue;if(needInfra)continue;if(h.gear<targetTier&&!g.gearProblem(h)&&g.affordable(g.gearCost(h)))action(g.equip(h.id),'equip '+h.id+' '+h.gear);if(h.condition<80&&g.affordable(g.repairCost(h)))action(g.repair(h.id));}
   if(g.s.r.gold>500&&!needInfra)for(const h of g.s.heroes){if(h.level>=Math.min(g.heroLevelCap,4+current*2))continue;if(!g.trainProblem(h)&&g.affordable(g.trainCost(h))){action(g.train(h.id));break;}}
   if(g.capacity<Math.max(340,220+current*55))built=have('warehouse',g.count('warehouse')+1)||built;
   for(const type of ['garden','windmill','bakery','museum','inn','tavern'])if(!g.count(type)&&g.count('training')&&g.s.r.gold>300){built=have(type)||built;break;}
   if(g.guardians>=3)built=have('alchemist')||built;
   if(g.guardians>=4)built=have('observatory')||built;
   if(g.guardians>=6)built=have('beacon')||built;
   // Upgrade bottlenecks only when there are spare workers; level increases need hands.
   e=g.economy();if(g.count('training')&&e.spare>=2&&g.s.r.gold>400&&!needInfra){let wants=[];if(g.s.r.wood<65)wants.push('lumber');if(g.s.r.stone<65)wants.push('quarry');if(g.s.r.ore<35)wants.push('mine');if(g.s.r.tools<45)wants.push('smith');if(g.s.r.knowledge<100)wants.push('library');if(g.s.r.food<100)wants.push('farm');for(const type of wants){if(upgrade(type)){built=true;break;}}}
  }
  // Launch only on the next unbeaten road with a materially prepared, suitable party.
  if(!g.s.missions.some(m=>!m.done&&!m.forage)){
   const p=selectParty(current);if(p&&p.p.chance>=.67)action(g.launch(current,p.ids,'careful','stocked'),'depart '+current+':'+g.s.regionProgress[current]+' '+Math.round(p.p.chance*100)+'%');
   else if(!g.s.missions.some(m=>!m.done)&&(g.s.r.food<25||g.s.r.gold<30)){const h=g.s.heroes.find(h=>!g.busy(h.id)&&h.rest<=0);if(h)action(g.forage(h.id));}
  }
  if(t===900)note('15-minute checkpoint: '+g.s.research.length+' research, '+g.guardians+' guardians');
  g.tick(5);
 }
 const report={seed,seconds:g.s.elapsed,chapter:g.s.chapter,guardians:g.guardians,marks,actions:acts,research:g.s.research,resources:g.s.r,buildings:g.s.buildings.filter(b=>b.type!=='path').map(b=>({type:b.type,level:b.level})),heroes:g.s.heroes.map(h=>({id:h.id,level:h.level,gear:h.gear})),economy:g.economy().rows.filter(r=>r.workers).map(r=>({type:r.b.type,staff:r.staff,need:r.workers,status:r.status})),rates:g.economy().rates,failed:[...failed].slice(0,8)};
 return{g,report,notes};
}
if(require.main===module){
 const {g,report}=play(Number(process.argv[2])||187319,Number(process.argv[3])||14400,process.argv.includes('--verbose'));
 assert.equal(g.s.chapter,D.chapters.length,'Ordinary-action policy must finish the charter.');
 assert.equal(g.guardians,7,'All frontier gates must be reachable without grants.');
 assert.equal(Object.keys(g.s.relics).length,21,'First clears must remove the old relic lottery wall.');
 for(const n of Object.values(g.s.r))assert.ok(Number.isFinite(n)&&n>=0);
 console.log(`PASS full ordinary-action campaign: ${Math.round(g.s.elapsed/60)} simulated minutes; ${g.guardians}/7 guardians; ${g.s.chapter}/15 chapters; ${Object.keys(g.s.relics).length}/21 relics; ${report.actions} ordinary actions. No resource/progress grants.`);
 console.log('Guardian checkpoints (minutes): '+report.marks.map(m=>m.minute).join(', '));
 console.log('This is a deterministic feasibility test of one policy, not a human playtime estimate or proof of optimal balance.');
 if(process.env.CAMPAIGN_SAVE)require('node:fs').writeFileSync(process.env.CAMPAIGN_SAVE,g.export());
}
module.exports={play};
