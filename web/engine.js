/* Bramblehaven: Frontier edition. Deterministic simulation; no DOM or network.
 * Output efficiency, worker assignment and input throughput are deliberately separate.
 * A failed action never charges resources. Simulation time is always measured in seconds.
 */
(function(root) {
'use strict';
const D = typeof module !== 'undefined' && module.exports ? require('./content.js') : root.BHData;
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const copy = o => JSON.parse(JSON.stringify(o));
const directions = [[1,0],[-1,0],[0,1],[0,-1]];
const fresh = () => ({
 version:2, edition:'frontier', migratedFrom:null, name:'Bramblehaven', seed:187319,
 elapsed:0, fame:0, expansion:0, legacy:0, nextId:20,
 r:{gold:290,wood:42,stone:22,food:50,ore:0,tools:0,knowledge:0,essence:0},
 buildings:[{id:1,type:'hall',x:8,y:8,level:1,paused:false,priority:1},
  {id:2,type:'cottage',x:7,y:8,level:1,paused:false,priority:1},
  {id:3,type:'path',x:8,y:9,level:1,paused:false,priority:1},
  {id:4,type:'path',x:7,y:9,level:1,paused:false,priority:1}],
 heroes:[{id:'rowan',level:1,xp:0,gear:0,condition:100,rest:0}],
 missions:[],research:[],relics:{},combos:[],achievements:[],types:['hall','cottage','path'],
 chapter:0,regionProgress:[0,0,0,0,0,0,0],pity:[0,0,0,0,0,0,0], foodReserve:30,
 shopStock:{wood:40,stone:30,food:50,ore:20},
 stats:{built:1,earned:0,wins:0,losses:0,upgrades:0,contracts:0,visitors:0},
 contracts:[],event:null,eventDay:0,settings:{speed:1,music:false,sfx:true},
 log:[],lastSave:Date.now(),started:false
});
function terrain(x,y) {
 const a=(x-8.5)/9.7,b=(y-8.5)/9.1;
 if(a*a+b*b>1.13||((x===0||y===17)&&((x+y)%3!==0)))return 'water';
 const n=((x*374761393+y*668265263)^(x*y*1274126177))>>>0,h=(n%1000)/1000;
 if(x>=7&&x<=9&&y>=7&&y<=10)return 'grass';
 return h<.28?'forest':h<.40?'stone':h>.79?'fertile':'grass';
}
function checksum(text) {let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
class Game {
 constructor(state) {this.s=state||fresh();this.notices=[];this.results=[];this.lastRates=null;if(!this.s.contracts.length)this.makeContracts();}
 rand(){let x=this.s.seed>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;this.s.seed=x>>>0;return this.s.seed/4294967296;}
 get rank(){let n=1;D.ranks.forEach((r,i)=>{if(this.s.fame>=r.fame)n=i+1;});return n;}
 get day(){return Math.floor(this.s.elapsed/D.DAY)+1;}
 get season(){return ['Spring','Summer','Autumn','Winter'][Math.floor((this.day-1)/5)%4];}
 get weather(){return ['Clear','Rain','Clear','Breezy','Mist'][(this.day*7+3)%5];}
 get capacity(){return 160+this.s.buildings.reduce((a,b)=>a+(b.type==='warehouse'&&!b.paused?180+60*(b.level-1):0),0);}
 get guardians(){return this.s.regionProgress.filter(n=>n>=4).length;}
 get heroLevelCap(){return Math.min(18,4+2*this.guardians);}
 get buildingLevelCap(){return this.has('masterwork')?5:this.has('scholarship')?4:this.has('masonry')?3:2;}
 get gearCap(){return this.has('masterwork')?5:this.has('resonance')?4:this.has('scholarship')?3:this.has('metallurgy')?2:1;}
 get partyLimit(){return 1+(this.has('maps')?1:0)+(this.has('cartography')?1:0);}
 has(id){return this.s.research.includes(id);}
 count(type){return this.s.buildings.filter(b=>b.type===type).length;}
 at(x,y){return this.s.buildings.find(b=>b.x===x&&b.y===y);}
 unlocked(x,y){const m=6-this.s.expansion;return Number.isInteger(x)&&Number.isInteger(y)&&x>=m&&y>=m&&x<18-m&&y<18-m;}
 affordable(cost){return Object.entries(cost||{}).every(([r,n])=>Object.hasOwn(D.resources,r)&&Number.isFinite(n)&&n>=0&&this.s.r[r]+1e-7>=n);}
 pay(cost){if(!this.affordable(cost))return false;for(const[r,n]of Object.entries(cost||{}))this.s.r[r]=Math.max(0,this.s.r[r]-n);return true;}
 add(reward){for(const[r,n]of Object.entries(reward||{})){if(!Number.isFinite(n))continue;if(r==='fame'){this.s.fame=Math.max(0,this.s.fame+n);continue;}if(!Object.hasOwn(D.resources,r))continue;const old=this.s.r[r];this.s.r[r]=clamp(old+n,0,r==='gold'?1e12:Math.max(old,this.capacity));if(r==='gold'&&n>0)this.s.stats.earned+=this.s.r[r]-old;}}
 notice(text,kind='info'){this.notices.push({text,kind});if(this.notices.length>20)this.notices.shift();}
 record(text){this.s.log.unshift({day:this.day,text});this.s.log=this.s.log.slice(0,60);}
 fail(message){return{ok:false,message};} ok(message){return{ok:true,message};}
 requirements(d){
  if(!d)return 'Unknown blueprint.';
  if(d.gate!==undefined&&this.s.regionProgress[d.gate]<4)return 'Defeat the '+D.regions[d.gate].name+' guardian first.';
  const req=Array.isArray(d.requires)?d.requires:d.requires?[d.requires]:[];
  for(const id of req)if(!this.has(id))return 'Research '+D.research.find(r=>r.id===id).name+' first.';
  if(d.rank>this.rank)return 'Requires town rank '+d.rank+'.';
  return null;
 }
 buildingUnlock(type){return Object.hasOwn(D.buildings,type)?this.requirements(D.buildings[type]):'Unknown blueprint.';}
 placement(type,x,y){
  if(!Object.hasOwn(D.buildings,type)||type==='hall')return 'Choose a blueprint from Build.';
  if(!this.unlocked(x,y))return 'Unclaimed land. Expand your charter before building here.';
  if(terrain(x,y)==='water')return 'Water. Choose a dry plot.';
  if(this.at(x,y))return 'Occupied plot. Choose an empty plot or relocate the existing building.';
  const d=D.buildings[type],locked=this.buildingUnlock(type);if(locked)return locked;
  if(d.unique&&this.count(type))return 'Your town already has this landmark.';
  if(!this.affordable(d.cost))return 'Not enough materials. Red costs are missing.';
  return null;
 }
 build(type,x,y){
  const problem=this.placement(type,x,y);if(problem)return this.fail(problem);
  const d=D.buildings[type];this.pay(d.cost);
  const b={id:this.s.nextId++,type,x,y,level:1,paused:false,priority:type==='farm'?2:1};this.s.buildings.push(b);
  if(type!=='path'){this.s.stats.built++;if(!this.s.types.includes(type))this.s.fame+=8;}
  if(!this.s.types.includes(type))this.s.types.push(type);
  this.discoverCombos();return{ok:true,message:d.name+' built.',building:b};
 }
 upgradeCost(b){if(!b)return{};const d=D.buildings[b.type],l=b.level;
  const c={gold:Math.round((d.cost.gold||80)*(.55+l*.22)),wood:18*l,stone:16*l};
  if(l>=2)c.tools=6*l;if(l>=3)c.knowledge=12*l;if(l>=4)c.essence=8;return c;
 }
 upgradeProblem(b){
  if(!b||['path','hall'].includes(b.type))return 'The hearth and paths do not need upgrades.';
  if(b.level>=5)return 'Maximum level reached.';
  if(b.level>=this.buildingLevelCap){const id=D.levelGates[b.level+1];return 'Research '+D.research.find(r=>r.id===id).name+' to unlock the next level.';}
  return null;
 }
 upgrade(id){const b=this.s.buildings.find(b=>b.id===id),problem=this.upgradeProblem(b);if(problem)return this.fail(problem);
  if(!this.pay(this.upgradeCost(b)))return this.fail('Not enough materials to upgrade.');b.level++;this.s.stats.upgrades++;this.s.fame+=3;return this.ok('Level '+b.level+'. Check the increased staffing and upkeep.');}
 moveProblem(id,x,y){const b=this.s.buildings.find(b=>b.id===id);if(!b||b.type==='hall')return 'The hearth stays at the centre of town.';if(!this.unlocked(x,y)||terrain(x,y)==='water')return 'Choose dry, claimed ground.';if(this.at(x,y)&&this.at(x,y).id!==id)return 'This plot is occupied.';return null;}
 move(id,x,y){const p=this.moveProblem(id,x,y);if(p)return this.fail(p);const b=this.s.buildings.find(b=>b.id===id);b.x=x;b.y=y;this.discoverCombos();return this.ok('Relocated without losing its level.');}
 demolish(id){const i=this.s.buildings.findIndex(b=>b.id===id);if(i<0||this.s.buildings[i].type==='hall')return this.fail('The hearth cannot be removed.');const b=this.s.buildings[i];this.s.buildings.splice(i,1);const refund={};for(const[r,n]of Object.entries(D.buildings[b.type].cost))refund[r]=Math.floor(n*.6);this.add(refund);return this.ok('Removed. 60% of the original construction cost recovered.');}
 pauseBuilding(id){const b=this.s.buildings.find(b=>b.id===id);if(!b||['hall','path','cottage','inn'].includes(b.type))return this.fail('This building cannot be paused.');b.paused=!b.paused;this.discoverCombos();return this.ok(b.paused?'Work paused; staff and inputs freed.':'Work resumed.');}
 setPriority(id,p){const b=this.s.buildings.find(b=>b.id===id);if(!b||!D.buildings[b.type].workers||![0,1,2].includes(p))return this.fail('Choose a workplace and a valid priority.');b.priority=p;this.discoverCombos();return this.ok(['Low','Normal','High'][p]+' staffing priority.');}
 setReserve(n){if(![0,30,60,120].includes(n))return this.fail('Choose a valid reserve.');this.s.foodReserve=n;return this.ok(n+' provisions reserved for residents. Expeditions still use the stock you authorise.');}
 expansionCost(){const n=this.s.expansion+1,m=this.has('survey')?.75:1;return{gold:Math.round(210*n*m),wood:Math.round(32*n*m),stone:Math.round(24*n*m),...(n>2?{tools:6*n}:{})};}
 expansionProblem(){const n=this.s.expansion;if(n>=6)return 'All land is claimed.';if(n===0&&this.s.regionProgress[0]<2)return 'Scout the first two Whisperwood landmarks for the first land permit.';if(n>0&&this.s.regionProgress[n-1]<4)return 'Defeat the '+D.regions[n-1].name+' guardian for this land permit.';return null;}
 expand(){const problem=this.expansionProblem();if(problem)return this.fail(problem);if(!this.pay(this.expansionCost()))return this.fail('Not enough resources for this land claim.');this.s.expansion++;this.s.fame+=12;this.record('A land permit became a new neighbourhood.');return this.ok('New land claimed.');}
 connected(){const paths=new Set(this.s.buildings.filter(b=>b.type==='path').map(b=>`${b.x},${b.y}`)),hall=this.s.buildings.find(b=>b.type==='hall');if(!hall)return new Set();const seen=new Set([`${hall.x},${hall.y}`]),q=[[hall.x,hall.y]];
  for(let i=0;i<q.length;i++)for(const[dx,dy]of directions){const x=q[i][0]+dx,y=q[i][1]+dy,k=`${x},${y}`;if(paths.has(k)&&!seen.has(k)){seen.add(k);q.push([x,y]);}}
  return new Set(this.s.buildings.filter(b=>b.type==='hall'||seen.has(`${b.x},${b.y}`)||directions.some(([dx,dy])=>seen.has(`${b.x+dx},${b.y+dy}`))).map(b=>b.id));
 }
 workers(b){return(D.buildings[b.type].workers||0)*(1+(b.level-1)*.55)*(this.has('logistics')?.8:1);}
 assignments(connected){const map=new Map();let population=4,demand=0,appeal=0;
  for(const b of this.s.buildings){const d=D.buildings[b.type];if(d.housing)population+=d.housing+(b.level-1);if(!b.paused&&connected.has(b.id)){appeal+=(d.appeal||0)*(1+(b.level-1)*.15);demand+=this.workers(b);}}
  let left=population;const order=[...this.s.buildings].sort((a,b)=>(b.priority??1)-(a.priority??1)||a.id-b.id);
  for(const b of order){const need=this.workers(b),assigned=b.paused||!connected.has(b.id)?0:Math.min(left,need);map.set(b.id,assigned);left-=assigned;}
  return{map,population,demand,appeal,spare:left};
 }
 combosFor(b,connected=this.connected(),staff=null){const active=n=>!n.paused&&connected.has(n.id)&&(!this.workers(n)||!staff||(staff.get(n.id)||0)>=this.workers(n)*.5);
  if(!active(b))return[];return D.combos.filter(c=>(c.a===b.type||c.b===b.type)&&this.s.buildings.some(n=>n.id!==b.id&&active(n)&&n.type===(c.a===b.type?c.b:c.a)&&Math.max(Math.abs(n.x-b.x),Math.abs(n.y-b.y))===1));
 }
 discoverCombos(){const conn=this.connected(),a=this.assignments(conn);for(const b of this.s.buildings)for(const c of this.combosFor(b,conn,a.map))if(!this.s.combos.includes(c.id)){this.s.combos.push(c.id);this.s.fame+=12;this.notice('Neighbourhood: '+c.name,'discovery');this.record('Discovered '+c.name+'.');}}
 economy(){
  const s=this.s,connected=this.connected(),a=this.assignments(connected),{population,demand,appeal}=a;
  const foodLow=s.r.food<population*.6,mood=clamp(82+appeal*.65-population*.70-(foodLow?26:0)-(s.r.gold<5?10:0),25,100);
  const labor=demand?Math.min(1,population/demand):1,rows=[];
  for(const b of s.buildings){if(b.type==='path')continue;const d=D.buildings[b.type],need=this.workers(b),staff=a.map.get(b.id)||0,isConnected=connected.has(b.id),combos=this.combosFor(b,connected,a.map);
   const activity=b.paused||!isConnected?0:need?staff/need:1;
   const level=b.type==='hall'?1:1+(b.level-1)*.45;
   const terrainBonus=d.terrain===terrain(b.x,b.y)?.35:0,comboBonus=combos.reduce((sum,c)=>sum+c.bonus,0);
   const yieldBonus=(1+terrainBonus+comboBonus)*(b.type==='hall'?1:(.70+mood*.003)*(1+Math.min(10,s.legacy)*.05)*(this.has('masterwork')?1.1:1)*(this.has('paving')?1.2:1));
   const mult=activity*level,out={},input={};
   for(const[r,n]of Object.entries(d.input||{}))input[r]=n*mult;
   if(need&&b.level>=3)input.tools=(input.tools||0)+.20*(b.level-2)*activity;
   for(const[r,n]of Object.entries(d.out||{})){let bonus=1;
    if(b.type!=='hall'){
     if(this.has('axes')&&r==='wood')bonus+=.2;if(this.has('granaries')&&r==='food')bonus+=.2;
     if(this.has('masonry')&&r==='stone')bonus+=.2;if(this.has('trade')&&r==='gold')bonus+=.2;
     if(this.has('metallurgy')&&['ore','tools'].includes(r))bonus+=.25;
     if(this.has('scholarship')&&r==='knowledge')bonus+=.25;if(this.has('resonance')&&r==='essence')bonus+=.3;
    }
    if(b.type==='farm'){if(this.season==='Winter')bonus*=.60;if(this.weather==='Rain')bonus*=1.10;}
    const relicIncome=b.type==='museum'&&r==='gold'?Object.keys(s.relics).length*1.5:0;
    out[r]=(n+relicIncome)*mult*yieldBonus*bonus;
   }
   const status=b.paused?'Paused':!isConnected?'No road':need&&staff<.01?'No workers':need&&staff<need-.01?'Short staffed':'Working';
   rows.push({b,d,out,input,mult:mult*yieldBonus,activity,connected:isConnected,combos,terrainBonus,status,workers:need,staff,yieldBonus});
  }
  // Essential food production is allocated first. Other priorities resolve in stable ID order.
  rows.sort((x,y)=>(y.b.type==='hall'?99:y.b.priority??1)-(x.b.type==='hall'?99:x.b.priority??1)||x.b.id-y.b.id);
  const e={population,appeal,demand,labor,mood,foodLow,rows,connected,spare:a.spare,foodUse:population*1.25,wages:s.heroes.length*.6};
  const flow=this.flow(e,1);
  e.rates=flow.rates;
  for(const row of rows){row.actual=flow.utilization.get(row.b.id)??1;if(row.activity&&row.actual<.999&&row.status==='Working')row.status=flow.reasons.get(row.b.id)||'Limited inputs';}
  return e;
 }
 flow(e,dt){
  const before=this.s.r,r={...before},rate=dt/60,utilization=new Map(),reasons=new Map(),cap=this.capacity;
  r.food=Math.max(0,r.food-e.foodUse*rate);r.gold=Math.max(0,r.gold-e.wages*rate);
  let earned=0;
  for(const row of e.rows){let available=1;
   for(const[k,n]of Object.entries(row.input))if(n>0){const stock=Math.max(0,r[k]-(k==='food'?this.s.foodReserve:0)),q=clamp(stock/(n*rate),0,1);if(q<available){available=q;reasons.set(row.b.id,k==='food'&&r[k]>0?'Food reserve protected':'Needs '+D.resources[k].short.toLowerCase());}}
   // Stop production when every output is full; do not burn scarce inputs for nothing.
   const output=Object.entries(row.out).filter(([,n])=>n>0);
   if(output.length){let headroom=0;for(const[k,n]of output)headroom=Math.max(headroom,k==='gold'?1:clamp((cap-r[k])/(n*rate),0,1));if(headroom<available){available=headroom;reasons.set(row.b.id,'Stores full');}}
   utilization.set(row.b.id,available);
   for(const[k,n]of Object.entries(row.input))r[k]=Math.max(0,r[k]-n*rate*available);
   for(const[k,n]of output){const old=r[k];r[k]=clamp(old+n*rate*available,0,k==='gold'?1e12:Math.max(old,cap));if(k==='gold')earned+=r[k]-old;}
  }
  return{r,earned,utilization,reasons,rates:Object.fromEntries(Object.keys(D.resources).map(k=>[k,(r[k]-before[k])/rate]))};
 }
 tick(dt){if(!Number.isFinite(dt)||dt<=0)return;let remaining=Math.min(dt,7200);while(remaining>1e-6){const n=Math.min(1,remaining);this.step(n);remaining-=n;}}
 step(dt){const s=this.s,oldDay=this.day,e=this.economy(),flow=this.flow(e,dt);this.lastRates=e;s.r=flow.r;s.stats.earned+=flow.earned;s.elapsed+=dt;
  const ready=s.heroes.filter(h=>!this.busy(h.id)&&h.rest<=0),xp=e.rows.filter(row=>row.d.xp).reduce((sum,row)=>sum+row.d.xp*row.mult*(flow.utilization.get(row.b.id)||0),0);
  if(ready.length&&xp)for(const h of ready)this.giveXP(h,xp/ready.length*dt/60);
  const inn=e.rows.some(r=>r.b.type==='inn'&&r.activity&&r.actual>.5),tavern=e.rows.some(r=>r.b.type==='tavern'&&r.activity&&r.actual>.5);
  for(const h of s.heroes)h.rest=Math.max(0,h.rest-dt*(inn?1.25:1)*(tavern?1.25:1));
  for(const m of s.missions){if(!m.done){m.remaining=Math.max(0,m.remaining-dt);if(m.remaining<=0)this.finishMission(m);}}
  if(this.day!==oldDay){
   s.stats.visitors+=Math.max(1,Math.floor(e.appeal/5));s.shopStock={wood:40,stone:30,food:50,ore:20};
   if(this.day%2===0&&s.eventDay!==this.day&&!s.event){s.event={index:Math.floor(this.rand()*D.events.length),day:this.day};s.eventDay=this.day;this.notice('A visitor has arrived.','event');}
   if(this.day%3===1)this.makeContracts();this.discoverCombos();
  }
 }
 working(type){return this.economy().rows.some(r=>r.b.type===type&&r.activity>=.5&&(r.actual>=.5||r.status==='Stores full'));}
 researchProblem(id){const r=D.research.find(v=>v.id===id);if(!r)return 'Unknown research.';if(this.has(id))return 'Already researched.';return this.requirements(r)||(!this.working('library')?'Staff and connect a reading room first.':null);}
 research(id){const problem=this.researchProblem(id);if(problem)return this.fail(problem);const r=D.research.find(v=>v.id===id);if(!this.pay(r.cost))return this.fail('Not enough insight or materials.');this.s.research.push(id);this.s.fame+=12;this.record('Researched '+r.name+'.');return this.ok(r.name+' completed.');}
 recruitProblem(id){const d=D.heroes.find(v=>v.id===id);if(!d)return 'Unknown adventurer.';if(this.s.heroes.some(h=>h.id===id))return 'Already in your guild.';return this.requirements(d);}
 recruit(id){const p=this.recruitProblem(id);if(p)return this.fail(p);const d=D.heroes.find(v=>v.id===id);if(!this.pay(d.cost))return this.fail('Not enough resources to recruit.');this.s.heroes.push({id,level:1,xp:0,gear:0,condition:100,rest:0});this.s.fame+=12;this.record(d.name+' joined the guild.');return this.ok(d.name+' joined.');}
 busy(id){return this.s.missions.some(m=>!m.done&&m.heroes.includes(id));}
 xpNeeded(h){return 40+h.level*20;}
 giveXP(h,xp){if(h.level>=this.heroLevelCap)return;h.xp+=xp*(this.has('mentors')?1.35:1);while(h.xp>=this.xpNeeded(h)&&h.level<this.heroLevelCap){h.xp-=this.xpNeeded(h);h.level++;}if(h.level>=this.heroLevelCap)h.xp=0;}
 trainCost(h){return{gold:24+h.level*12,food:5+h.level*2,...(h.level>=5?{tools:Math.ceil(h.level/3)}:{})};}
 trainProblem(h){if(!h||this.busy(h.id)||h.rest>0)return 'Training needs a ready adventurer at home.';if(h.level>=this.heroLevelCap)return 'Defeat another guardian to raise the guild level cap.';if(!this.working('training'))return 'Connect and staff a training yard first.';return null;}
 train(id){const h=this.s.heroes.find(v=>v.id===id),p=this.trainProblem(h);if(p)return this.fail(p);if(!this.pay(this.trainCost(h)))return this.fail('Not enough training supplies.');this.giveXP(h,this.xpNeeded(h)-h.xp);h.rest=35;return this.ok('Training complete. Recovering after a focused session.');}
 gearCost(h){return [null,{gold:65,wood:12,tools:6},{gold:120,ore:18,tools:18},{gold:210,ore:30,tools:32,knowledge:15},{gold:330,tools:48,essence:10},{gold:520,tools:68,essence:20}][Math.min(5,h.gear+1)];}
 gearProblem(h){if(!h||this.busy(h.id))return 'Equipment changes require an adventurer at home.';if(h.gear>=5)return 'Already wearing masterwork equipment.';if(h.gear>=this.gearCap){const id=D.gearGates[h.gear+1];return 'Research '+D.research.find(r=>r.id===id).name+' for the next equipment tier.';}if(!this.working('smith'))return 'Connect and staff a forge first.';return null;}
 equip(id){const h=this.s.heroes.find(v=>v.id===id),p=this.gearProblem(h);if(p)return this.fail(p);if(!this.pay(this.gearCost(h)))return this.fail('Not enough equipment or materials.');h.gear++;h.condition=100;return this.ok(D.gearNames[h.gear]+' equipment fitted.');}
 repairCost(h){const wear=(100-(h.condition??100))/100;if(wear<=0)return{};return{gold:Math.ceil((12+h.gear*14)*wear),wood:Math.ceil((6+h.gear*3)*wear),...(h.gear?{tools:Math.ceil((2+h.gear*3)*wear)}:{})};}
 repair(id){const h=this.s.heroes.find(v=>v.id===id);if(!h||this.busy(id))return this.fail('Repairs require an adventurer at home.');if((h.condition??100)>=100)return this.fail('Equipment is already in good condition.');if(h.gear&&!this.working('smith'))return this.fail('Connect and staff a forge first.');if(!this.pay(this.repairCost(h)))return this.fail('Not enough repair materials.');h.condition=100;return this.ok('Equipment repaired.');}
 power(ids,region){let base=0,bonus=this.has('resonance')?.08:0;for(const id of new Set(ids)){const h=this.s.heroes.find(h=>h.id===id),d=D.heroes.find(h=>h.id===id);if(!h||!d)continue;const condition=clamp(h.condition??100,0,100)/100;base+=d.power+(h.level-1)*2.5+D.gearPower[h.gear]*(.35+.65*condition);if(d.regions?.includes(region))bonus+=.20;bonus+=d.party||0;}return Math.round(base*(1+Math.min(.45,bonus)));}
 regionProblem(region){const r=D.regions[region];if(!r)return 'Unknown region.';if(region>0&&this.s.regionProgress[region-1]<4)return 'Defeat the '+D.regions[region-1].name+' guardian to open this road.';return this.requirements(r);}
 preview(region,ids,mode='steady',supply='standard',target=null){const r=D.regions[region];if(!r||!Array.isArray(ids)||!Object.hasOwn(D.supplyPolicies,supply)||!['careful','steady','bold'].includes(mode))return null;
  const stage=this.s.regionProgress[region],index=Math.min(stage,stage>=4?2:3),policy=D.supplyPolicies[supply],power=this.power(ids,region);
  const skills=new Set(ids.flatMap(id=>D.heroes.find(h=>h.id===id)?.skills||[])),matched=r.skills.some(id=>skills.has(id)),guard=stage===3&&skills.has('guard');
  const requiredGear=stage===3?r.guardianGear:r.minGear;
  const rawDifficulty=r.power*[1,1.18,1.40,region===0?2.5:1.72][index],difficulty=Math.round(rawDifficulty*(matched?1:1.18)*(guard?.90:1)),ratio=power/difficulty;
  const stance=mode==='careful'?.13:mode==='bold'?-.16:0;
  let chance=clamp(.60+(ratio-1)*.48+stance+policy.odds,.05,mode==='bold'?.88:.95);
  const tutorial=region===0&&stage===0&&this.s.stats.wins===0&&mode==='steady'&&supply!=='light';if(tutorial)chance=1;
  const cost={...r.cost};cost.food=Math.ceil(cost.food*(.75+ids.length*.25)*policy.cost*(stage===3?1.2:1));
  if(supply==='stocked'&&region>0)cost.tools=(cost.tools||0)+Math.max(1,Math.ceil(ids.length/2));
  const survey=!!target&&stage>=4;if(survey){cost.knowledge=(cost.knowledge||0)+20+region*8;chance=1;}
  const time=Math.round(r.time*(1+index*.12)*(mode==='careful'?1.15:mode==='bold'?.90:1)*(survey?1.2:1));
  const wear=Math.round((8+region*2+(stage===3?4:0))*(mode==='bold'?1.4:mode==='careful'?.8:1)*policy.wear);
  const warnings=[];const gate=this.regionProblem(region);if(gate)warnings.push(gate);
  if(ids.length===0)warnings.push('Choose at least one adventurer.');
  for(const id of ids){const h=this.s.heroes.find(h=>h.id===id),d=D.heroes.find(h=>h.id===id);if(!h)continue;
   if(h.rest>0||this.busy(id))warnings.push(d.name+' is not ready.');
   if((h.condition??100)<35)warnings.push('Repair '+d.name+'’s equipment (minimum 35% condition).');
   if(h.gear<requiredGear)warnings.push(d.name+' needs tier '+requiredGear+' equipment for '+(stage===3?'this guardian.':'this region.'));
  }
  if(ids.length&&ratio<.72)warnings.push('Underprepared: at least '+Math.ceil(difficulty*.72)+' party power required.');
  if(mode==='bold'&&ratio<1.08)warnings.push('Bold requires a power advantage: '+Math.ceil(difficulty*1.08)+' power.');
  if(target&&(!r.relics.includes(target)||stage<4))warnings.push('Targeted surveys require a cleared region and one of its relics.');
  if(survey&&!this.working('museum'))warnings.push('A staffed museum is needed to plan a targeted survey.');
  if(survey&&mode==='bold')warnings.push('Targeted surveys use Careful or Steady, not Bold.');
  if(region===6&&stage===3&&!this.working('beacon'))warnings.push('Connect, staff and fuel the Wayhome beacon before facing the final keeper.');
  return{power,difficulty,requiredGear,rawDifficulty:Math.round(rawDifficulty),ratio,chance,time,stage,mode,supply,cost,wear,matched,guard,skills:[...skills],warnings,tutorial,survey,target,rewardMult:mode==='bold'?1.35:mode==='careful'?.85:1};
 }
 launch(region,ids,mode='steady',supply='standard',target=null){
  if(!D.regions[region]||!['steady','careful','bold'].includes(mode)||!Object.hasOwn(D.supplyPolicies,supply))return this.fail('Choose a valid expedition plan.');
  if(!Array.isArray(ids)||ids.length<1||ids.length>3||new Set(ids).size!==ids.length||ids.some(id=>!this.s.heroes.some(h=>h.id===id)))return this.fail('Choose one to three different guild members.');
  const p=this.preview(region,ids,mode,supply,target);if(p.warnings.length)return this.fail(p.warnings[0]);
  if(this.s.missions.filter(m=>!m.done).length>=this.partyLimit)return this.fail('All expedition slots are occupied.');
  if(!this.pay(p.cost))return this.fail('Not enough provisions, equipment or briefing materials.');
  const m={id:this.s.nextId++,region,heroes:[...ids],mode,supply,total:p.time,remaining:p.time,chance:p.chance,stage:p.stage,choice:null,done:false,wear:p.wear,target:p.target||null,survey:p.survey,tutorial:p.tutorial,forage:false};
  this.s.missions.push(m);this.record('Set out for '+D.regions[region].name+'.');return this.ok('The party is on its way.');
 }
 forage(id){const h=this.s.heroes.find(h=>h.id===id);if(!h||this.busy(id)||h.rest>0)return this.fail('Choose a ready adventurer at home.');if(this.s.missions.filter(m=>!m.done).length>=this.partyLimit)return this.fail('All expedition slots are occupied.');
  this.s.missions.push({id:this.s.nextId++,region:0,heroes:[id],mode:'steady',supply:'standard',total:45,remaining:45,chance:1,stage:0,choice:1,done:false,wear:0,target:null,survey:false,tutorial:false,forage:true});return this.ok('Gathering near home. No supplies or equipment required.');
 }
 chooseMission(id,choice){const m=this.s.missions.find(v=>v.id===id);if(!m||m.done||m.choice!==null||m.remaining>m.total*.6||![0,1].includes(choice)||m.forage||m.survey)return this.fail('That decision is not available.');m.choice=choice;return this.ok(choice===0?'The party chose the side road.':'The party stayed the course.');}
 finishMission(m){
  if(m.done)return;const s=this.s,r=D.regions[m.region];m.done=true;
  if(m.forage){const reward={gold:8,wood:6,stone:3,food:14};this.add(reward);for(const id of m.heroes)s.heroes.find(h=>h.id===id).rest=5;m.result={success:true,reward,found:null,newRelic:false};this.notice('Local gathering party returned.','expedition');return;}
  let chance=m.chance,lootMult=m.mode==='bold'?1.35:m.mode==='careful'?.85:1,xpMult=1;
  for(const id of m.heroes){const h=D.heroes.find(v=>v.id===id);lootMult+=h.loot||0;xpMult+=h.xp||0;}
  if(m.choice===0){if(r.choice.kind==='loot'){lootMult+=.35;chance-=.12;}else{chance+=.10;lootMult-=.20;}}
  const success=m.tutorial||m.survey||this.rand()<clamp(chance,.05,m.mode==='bold'?.88:.97),reward={};let found=null,newRelic=false;
  if(success){s.stats.wins++;const previous=s.regionProgress[m.region];s.regionProgress[m.region]=Math.min(4,Math.max(previous,m.stage+1));
   const firstClear=m.stage<4&&previous<=m.stage,scale=(1+Math.min(m.stage,3)*.15)*lootMult*(firstClear?1:.65);
   for(const[k,v]of Object.entries(r.loot))reward[k]=Math.round(v*scale);
   reward.fame=firstClear?35+m.region*16+(m.stage===3?50:0):3;
   // First landmark, third landmark, guardian: collection is earned, never a lottery wall.
   if(m.survey)found=m.target;
   else if(firstClear&&[0,2,3].includes(m.stage))found=r.relics[m.stage===0?0:m.stage===2?1:2];
   else if(this.rand()<.35)found=r.relics[this.rand()<.65?0:1];
   if(found){newRelic=!s.relics[found];s.relics[found]=(s.relics[found]||0)+1;if(newRelic)reward.fame+=15;}
  }else{s.stats.losses++;reward.gold=Math.round(r.loot.gold*.12);}
  this.add(reward);
  for(const id of m.heroes){const h=s.heroes.find(v=>v.id===id);this.giveXP(h,(success?28+m.region*13+Math.min(m.stage,3)*8:10+m.region*3)*xpMult);h.rest=success?12:32;h.condition=clamp((h.condition??100)-(m.wear||10)-(success?0:8),0,100);}
  m.result={success,reward,found,newRelic};this.record((success?'Returned from ':'Retreated from ')+r.name+(found?' with '+D.relics.find(v=>v.id===found).name:'')+'.');
  this.notice(success?(newRelic?'New relic: ':'Party returned: ')+r.name:'Retreated from '+r.name+'. Review the plan and repair equipment.',newRelic?'discovery':'expedition');
 }
 acknowledgeMission(id){const i=this.s.missions.findIndex(m=>m.id===id&&m.done);if(i>=0)this.s.missions.splice(i,1);}
 progress(kind,target){const s=this.s;switch(kind){case'build':return this.count(target);case'wins':return s.stats.wins;case'heroes':return s.heroes.length;case'research':return s.research.length;case'relics':return Object.keys(s.relics).length;case'combos':return s.combos.length;case'region':return s.regionProgress[target]||0;case'rank':return this.rank;case'day':return this.day;case'expansions':return s.expansion;case'chapter':return s.chapter;default:return s.stats[kind]||0;}}
 claimChapter(){const c=D.chapters[this.s.chapter];if(!c||this.progress(c.kind,c.target)<c.n)return this.fail('Complete the current charter objective first.');this.add(c.reward);this.s.chapter++;this.record('Charter: '+c.title+'.');return this.ok(c.title+' complete.');}
 claimAchievement(id){const a=D.achievements.find(v=>v.id===id);if(!a||this.s.achievements.includes(id)||this.progress(a.kind)<a.n)return this.fail('This achievement is not ready.');this.s.achievements.push(id);this.add(a.reward);return this.ok(a.name+' claimed.');}
 makeContracts(){const pools=[['wood',25,70],['stone',20,75],['food',30,70]];if(this.rank>=3)pools.push(['ore',20,110],['tools',8,145]);if(this.rank>=5)pools.push(['knowledge',25,130]);this.s.contracts=[];
  for(let i=0;i<3;i++){const[resource,base,gold]=pools[Math.floor(this.rand()*pools.length)],k=1+Math.min(2,(this.rank-1)*.15);this.s.contracts.push({id:this.s.nextId++,resource,amount:Math.round(base*k),gold:Math.round(gold*k),done:false,name:['The valley co-operative','A merchant on the old road','The next town over'][i]});}}
 fulfill(id){const c=this.s.contracts.find(v=>v.id===id);if(!c||c.done)return this.fail('Contract unavailable.');if(!this.pay({[c.resource]:c.amount}))return this.fail('Not enough stock.');c.done=true;this.s.stats.contracts++;this.add({gold:c.gold,fame:10});return this.ok('Delivery complete.');}
 tradeInfo(resource){const prices={wood:5,stone:6,food:4,ore:10,tools:26,knowledge:24,essence:100};return{price:prices[resource]||0,stock:this.s.shopStock[resource]||0,buyable:Object.hasOwn(this.s.shopStock,resource)&&(resource!=='ore'||this.count('mine')>0)};}
 trade(resource,amount,buy){const info=this.tradeInfo(resource);if(!info.price||![10,25,50].includes(amount)||typeof buy!=='boolean')return this.fail('Invalid trade.');
  if(buy){if(!info.buyable)return this.fail('Advanced supplies must be made in town or earned on the road.');if(info.stock<amount)return this.fail('The merchant restocks basic supplies each dawn.');if(this.s.r[resource]+amount>this.capacity)return this.fail('Not enough storage.');if(!this.pay({gold:info.price*amount}))return this.fail('Not enough crowns.');this.s.shopStock[resource]-=amount;this.add({[resource]:amount});}
  else{if(!this.pay({[resource]:amount}))return this.fail('Not enough stock.');this.add({gold:Math.round(info.price*amount*.30)});}return this.ok('Trade completed.');}
 chooseEvent(index){const e=this.s.event;if(!e)return this.fail('No visitor is waiting.');const c=D.events[e.index].choices[index];if(!c)return this.fail('Choose an available response.');if(!this.pay(c.cost||{}))return this.fail('Not enough resources for that response.');this.add(c.reward);this.record(D.events[e.index].title+': '+c.text+'.');this.s.event=null;return this.ok('A new entry in the town’s story.');}
 prestige(name){if(this.s.chapter<D.chapters.length)return this.fail('Complete the charter before carrying its legacy onward.');const old=this.s,n=fresh();n.legacy=Math.min(10,old.legacy+1);n.relics={...old.relics};n.settings={...old.settings,speed:old.settings.speed===0?0:1};n.started=true;n.name=(name||old.name).slice(0,24);n.seed=old.seed;this.s=n;this.makeContracts();return this.ok('A fresh frontier.');}
 export(){this.s.lastSave=Date.now();const data=JSON.stringify(this.s);return JSON.stringify({game:'bramblehaven',format:1,checksum:checksum(data),data},null,2);}
 placementReport(type,x,y,moving=null){
  const issue=moving?this.moveProblem(moving,x,y):this.placement(type,x,y),before=this.economy();
  if(!this.unlocked(x,y)||terrain(x,y)==='water'||this.at(x,y)&&this.at(x,y).id!==moving)return{issue,terrain:terrain(x,y),row:null,delta:{}};
  const preview=new Game(copy(this.s));let b;
  if(moving){b=preview.s.buildings.find(b=>b.id===moving);if(!b)return{issue:'Missing building.',row:null,delta:{}};b.x=x;b.y=y;}
  else{if(!Object.hasOwn(D.buildings,type))return{issue:'Unknown building.',row:null,delta:{}};b={id:preview.s.nextId++,type,x,y,level:1,paused:false,priority:type==='farm'?2:1};preview.s.buildings.push(b);}
  const after=preview.economy(),row=after.rows.find(r=>r.b.id===b.id)||{connected:after.connected.has(b.id),out:{},input:{},workers:0,staff:0,combos:[],terrainBonus:0,status:'Path'};
  return{issue,terrain:terrain(x,y),row,delta:Object.fromEntries(Object.keys(D.resources).map(k=>[k,after.rates[k]-before.rates[k]])),spare:after.spare};
 }
 static import(text){if(typeof text!=='string'||text.length>2000000)throw Error('This is not a valid Bramblehaven save.');let raw;try{raw=JSON.parse(text);}catch{throw Error('The save is not valid JSON.');}
 if(raw.game!=='bramblehaven'||raw.format!==1||typeof raw.data!=='string'||checksum(raw.data)!==raw.checksum)throw Error('Save checksum or format mismatch. Keep the original backup unchanged.');let o;try{o=JSON.parse(raw.data);}catch{throw Error('The saved data is damaged.');}
 if(!o||![1,2].includes(o.version))throw Error('This save needs a different game version.');const n=fresh();n.migratedFrom=o.version===1?1:(o.migratedFrom===1?1:null);
 const num=(v,a,b,label)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<a||v>b)throw Error('Invalid '+label+' in save.');return v;};
 const integer=(v,a,b,label)=>{num(v,a,b,label);if(!Number.isInteger(v))throw Error('Invalid '+label+' in save.');return v;};
 if(typeof o.name!=='string'||o.name.length>24)throw Error('Invalid town name.');n.name=o.name;
 for(const k of Object.keys(n.r))n.r[k]=num(o.r&&o.r[k],0,1e12,k);
 for(const k of ['elapsed','fame'])n[k]=num(o[k],0,1e12,k);n.expansion=integer(o.expansion,0,6,'land');n.legacy=integer(o.legacy||0,0,10,'legacy');n.seed=integer(o.seed,1,4294967295,'random seed');n.nextId=integer(o.nextId,1,1e9,'id');n.chapter=integer(o.chapter,0,D.chapters.length,'chapter');
 if(!Array.isArray(o.buildings)||o.buildings.length>324)throw Error('Invalid building data.');const positions=new Set(),ids=new Set();n.buildings=o.buildings.map(b=>{if(!b||!Object.hasOwn(D.buildings,b.type))throw Error('Unknown building.');const x=integer(b.x,0,17,'plot'),y=integer(b.y,0,17,'plot'),id=integer(b.id,1,1e9,'building id');if(ids.has(id)||positions.has(x+','+y)||terrain(x,y)==='water')throw Error('Conflicting building data.');ids.add(id);positions.add(x+','+y);return{id,type:b.type,x,y,level:integer(b.level,1,5,'building level'),paused:!!b.paused,priority:o.version===1?1:integer(b.priority??1,0,2,'staffing priority')};});
 if(n.buildings.filter(b=>b.type==='hall').length!==1)throw Error('The guild hearth is missing.');
 if(!Array.isArray(o.heroes)||o.heroes.length<1||o.heroes.length>D.heroes.length)throw Error('Invalid guild.');const heroes=new Set();n.heroes=o.heroes.map(h=>{if(!h||!D.heroes.some(d=>d.id===h.id)||heroes.has(h.id))throw Error('Unknown or duplicate adventurer.');heroes.add(h.id);return{id:h.id,level:integer(h.level,1,25,'hero level'),xp:num(h.xp,0,100000,'hero XP'),gear:integer(h.gear,0,5,'equipment'),rest:num(h.rest,0,1000,'recovery'),condition:o.version===1?100:num(h.condition,0,100,'equipment condition')};});
 const list=(v,allowed,label)=>{if(!Array.isArray(v)||v.length>allowed.length||v.some(x=>!allowed.includes(x))||new Set(v).size!==v.length)throw Error('Invalid '+label+'.');return[...v];};
 n.research=list(o.research,D.research.map(r=>r.id),'research');n.combos=list(o.combos,D.combos.map(r=>r.id),'neighbourhoods');n.achievements=list(o.achievements,D.achievements.map(r=>r.id),'achievements');n.types=list(o.types,Object.keys(D.buildings),'building history');
 n.relics={};if(!o.relics||typeof o.relics!=='object'||Array.isArray(o.relics))throw Error('Invalid relics.');for(const[k,v]of Object.entries(o.relics)){if(!D.relics.some(r=>r.id===k))throw Error('Unknown relic.');n.relics[k]=integer(v,1,1e9,'relic count');}
 for(const k of Object.keys(n.stats))n.stats[k]=num(o.stats&&o.stats[k],0,1e12,'statistics');
 for(const k of ['regionProgress','pity']){if(!Array.isArray(o[k])||o[k].length!==7)throw Error('Invalid expedition history.');n[k]=o[k].map(v=>integer(v,0,k==='regionProgress'?4:1e9,'route progress'));}
 if(!Array.isArray(o.missions)||o.missions.length>1000)throw Error('Invalid missions.');const active=new Set();n.missions=o.missions.map(m=>{if(!m||!Array.isArray(m.heroes)||m.heroes.length<1||m.heroes.length>3||new Set(m.heroes).size!==m.heroes.length||m.heroes.some(id=>!heroes.has(id)))throw Error('Invalid expedition party.');if(!m.done)for(const id of m.heroes){if(active.has(id))throw Error('An adventurer is in two parties.');active.add(id);}const id=integer(m.id,1,1e9,'mission id');if(ids.has(id))throw Error('Duplicate id.');ids.add(id);const total=num(m.total,1,10000,'duration');const out={id,region:integer(m.region,0,6,'region'),heroes:[...m.heroes],mode:['steady','careful','bold'].includes(m.mode)?m.mode:'steady',total,remaining:num(m.remaining,0,total,'remaining time'),chance:num(m.chance,0,1,'chance'),stage:integer(m.stage,0,4,'stage'),choice:m.choice===0?0:m.choice===1?1:null,done:!!m.done,supply:o.version===1?'standard':(['light','standard','stocked'].includes(m.supply)?m.supply:'standard'),wear:o.version===1?8:integer(m.wear??0,0,100,'wear'),target:m.target||null,survey:!!m.survey,forage:!!m.forage,tutorial:!!m.tutorial};if(out.target!==null&&!D.regions[out.region].relics.includes(out.target))throw Error('Invalid survey target.');if(out.survey&&!out.target)throw Error('A survey target is missing.');
 if(out.done){if(!m.result||typeof m.result.success!=='boolean')throw Error('Invalid expedition report.');const reward={};for(const[k,v]of Object.entries(m.result.reward||{})){if(k!=='fame'&&!Object.hasOwn(D.resources,k))throw Error('Invalid reward.');reward[k]=num(v,0,1e9,'reward');}if(m.result.found!==null&&!D.relics.some(r=>r.id===m.result.found))throw Error('Invalid discovery.');out.result={success:m.result.success,reward,found:m.result.found,newRelic:!!m.result.newRelic};}return out;});
 if(!Array.isArray(o.contracts)||o.contracts.length>3)throw Error('Invalid contracts.');n.contracts=o.contracts.map(c=>{if(!Object.hasOwn(D.resources,c.resource))throw Error('Invalid trade material.');return{id:integer(c.id,1,1e9,'contract id'),resource:c.resource,amount:integer(c.amount,1,1e9,'trade amount'),gold:integer(c.gold,0,1e9,'trade reward'),done:!!c.done,name:String(c.name||'A travelling merchant').slice(0,80)};});
 n.event=o.event?{index:integer(o.event.index,0,D.events.length-1,'event'),day:integer(o.event.day,1,1e10,'event day')}:null;n.eventDay=integer(o.eventDay||0,0,1e10,'event day');
 n.foodReserve=o.version===1?30:integer(o.foodReserve??30,0,120,'food reserve');n.shopStock={wood:40,stone:30,food:50,ore:20};if(o.version===2){for(const k of Object.keys(n.shopStock))n.shopStock[k]=integer(o.shopStock?.[k]??0,0,100,'merchant stock');}
 n.settings={speed:o.settings?.speed===0?0:1,music:!!(o.settings&&o.settings.music),sfx:o.settings?o.settings.sfx!==false:true};n.started=!!o.started;n.lastSave=num(o.lastSave,0,1e15,'save time');n.log=Array.isArray(o.log)?o.log.slice(0,60).filter(l=>l&&typeof l.text==='string'&&Number.isFinite(l.day)).map(l=>({day:clamp(l.day,1,1e10),text:l.text.slice(0,240)})):[];
 if(n.missions.filter(m=>!m.done).length>3)throw Error('Too many active missions.');
 n.nextId=Math.max(n.nextId,...n.buildings.map(b=>b.id+1),...n.missions.map(m=>m.id+1),...n.contracts.map(c=>c.id+1));return new Game(n);}
}
Game.fresh=fresh;Game.terrain=terrain;Game.checksum=checksum;Game.clamp=clamp;
if(typeof module!=='undefined'&&module.exports)module.exports=Game;else root.BHGame=Game;
})(typeof globalThis!=='undefined'?globalThis:this);
