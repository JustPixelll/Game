/* Deterministic simulation. This file deliberately has no DOM, timers, or network access. */
(function(root){'use strict';
const D=typeof module!=='undefined'&&module.exports?require('./content.js'):root.BHData;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const fresh=()=>({version:D.SAVE_VERSION,name:'Bramblehaven',seed:187319,elapsed:0,fame:0,expansion:0,legacy:0,nextId:20,
 r:{gold:460,wood:65,stone:45,food:50,ore:0,tools:0,knowledge:0,essence:0},
 buildings:[{id:1,type:'hall',x:8,y:8,level:1,paused:false},{id:2,type:'cottage',x:7,y:8,level:1,paused:false},{id:3,type:'path',x:8,y:9,level:1,paused:false},{id:4,type:'path',x:7,y:9,level:1,paused:false}],
 heroes:[{id:'rowan',level:1,xp:0,gear:0,rest:0}],missions:[],research:[],relics:{},combos:[],achievements:[],types:['hall','cottage','path'],chapter:0,regionProgress:[0,0,0,0,0,0,0],pity:[0,0,0,0,0,0,0],
 stats:{built:1,earned:0,wins:0,losses:0,upgrades:0,contracts:0,visitors:0},contracts:[],event:null,eventDay:0,settings:{speed:1,music:false,sfx:true},log:[],lastSave:Date.now(),started:false});
function terrain(x,y){
 const a=(x-8.5)/9.7,b=(y-8.5)/9.1;
 if(a*a+b*b>1.13||((x===0||y===17)&&((x+y)%3!==0)))return 'water';
 const n=((x*374761393+y*668265263)^(x*y*1274126177))>>>0;const h=(n%1000)/1000;
 if(x>=7&&x<=9&&y>=7&&y<=10)return 'grass';
 return h<.28?'forest':h<.40?'stone':h>.79?'fertile':'grass';
}
function checksum(text){let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return(h>>>0).toString(16);}
class Game{
 constructor(state){this.s=state||fresh();this.notices=[];this.results=[];this.lastRates=null;if(!this.s.contracts.length)this.makeContracts();}
 rand(){let x=this.s.seed>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;this.s.seed=x>>>0;return this.s.seed/4294967296;}
 get rank(){let n=1;D.ranks.forEach((r,i)=>{if(this.s.fame>=r.fame)n=i+1;});return n;}
 get day(){return Math.floor(this.s.elapsed/D.DAY)+1;}
 get season(){return ['Spring','Summer','Autumn','Winter'][Math.floor((this.day-1)/5)%4];}
 get weather(){return ['Clear','Rain','Clear','Breezy','Mist'][(this.day*7+3)%5];}
 get capacity(){return 600+this.s.buildings.reduce((a,b)=>a+(D.buildings[b.type].storage||0)*b.level,0);}
 get partyLimit(){return 1+(this.has('maps')?1:0)+(this.has('cartography')?1:0);}
 has(id){return this.s.research.includes(id);}
 count(type){return this.s.buildings.filter(b=>b.type===type).length;}
 at(x,y){return this.s.buildings.find(b=>b.x===x&&b.y===y);}
 unlocked(x,y){let m=6-this.s.expansion;return x>=m&&y>=m&&x<18-m&&y<18-m;}
 affordable(cost){return Object.entries(cost||{}).every(([r,n])=>Number.isFinite(n)&&n>=0&&(this.s.r[r]||0)+1e-7>=n);}
 pay(cost){if(!this.affordable(cost))return false;Object.entries(cost||{}).forEach(([r,n])=>this.s.r[r]=Math.max(0,this.s.r[r]-n));return true;}
 add(reward){for(const [r,n]of Object.entries(reward||{})){if(!Number.isFinite(n))continue;if(r==='fame'){this.s.fame=Math.max(0,this.s.fame+n);continue;}if(!Object.hasOwn(D.resources,r)||!Number.isFinite(n))continue;let old=this.s.r[r];this.s.r[r]=clamp(old+n,0,r==='gold'?1e12:Math.max(old,this.capacity));if(r==='gold'&&n>0)this.s.stats.earned+=this.s.r[r]-old;}}
 notice(text,kind='info'){this.notices.push({text,kind});if(this.notices.length>20)this.notices.shift();}
 record(text){this.s.log.unshift({day:this.day,text});this.s.log=this.s.log.slice(0,40);}
 fail(message){return{ok:false,message};}
 ok(message){return{ok:true,message};}
 placement(type,x,y){const d=D.buildings[type];if(!Object.hasOwn(D.buildings,type)||type==='hall')return 'Choose a building from the catalogue.';
 if(!Number.isInteger(x)||!Number.isInteger(y)||!this.unlocked(x,y))return 'This land is outside your charter. Expand the town first.';
 if(terrain(x,y)==='water')return 'The water belongs to the ducks. Choose dry ground.';
 if(this.at(x,y))return 'There is already something here.';
 if(d.rank>this.rank)return `Unlocks at town rank ${d.rank}.`;
 if(d.unique&&this.count(type))return 'Your town already has this landmark.';
 if(!this.affordable(d.cost))return 'Not enough materials. The cost is shown on the blueprint.';return null;}
 build(type,x,y){const problem=this.placement(type,x,y);if(problem)return this.fail(problem);const d=D.buildings[type];this.pay(d.cost);
 const b={id:this.s.nextId++,type,x,y,level:1,paused:false};this.s.buildings.push(b);
 if(type!=='path'){this.s.stats.built++;this.s.fame+=this.s.types.includes(type)?3:12;}
 if(!this.s.types.includes(type))this.s.types.push(type);this.discoverCombos();return{ok:true,message:d.name+' built.',building:b};}
 upgradeCost(b){if(!b)return{};const d=D.buildings[b.type],c={gold:Math.round((d.cost.gold||120)*(.6+b.level*.35)),wood:12*b.level,stone:10*b.level};if(b.level>=2)c.tools=4*b.level;return c;}
 upgrade(id){const b=this.s.buildings.find(b=>b.id===id);if(!b||b.type==='path')return this.fail('This cannot be upgraded.');
 const max=this.has('masterwork')?5:4;if(b.level>=max)return this.fail(max===4?'Research Built to last for level five.':'Already at the highest level.');
 if(!this.pay(this.upgradeCost(b)))return this.fail('Not enough materials to upgrade.');b.level++;this.s.stats.upgrades++;this.s.fame+=8;return this.ok('Upgraded to level '+b.level+'.');}
 move(id,x,y){const b=this.s.buildings.find(b=>b.id===id);if(!b||b.type==='hall')return this.fail('The guild hearth stays here.');if(!this.unlocked(x,y)||terrain(x,y)==='water'||this.at(x,y))return this.fail('Choose an empty plot of dry, claimed land.');b.x=x;b.y=y;this.discoverCombos();return this.ok('Building relocated.');}
 demolish(id){const i=this.s.buildings.findIndex(b=>b.id===id);if(i<0||this.s.buildings[i].type==='hall')return this.fail('The hearth is the heart of your town.');
 const b=this.s.buildings[i];this.s.buildings.splice(i,1);const refund={};Object.entries(D.buildings[b.type].cost).forEach(([r,n])=>refund[r]=Math.floor(n*.6));this.add(refund);return this.ok(b.type==='path'?'Path removed.':'Removed. 60% of the original construction cost recovered.');}
 pauseBuilding(id){const b=this.s.buildings.find(b=>b.id===id);if(!b||['hall','path','cottage','inn'].includes(b.type))return this.fail('This building cannot be paused.');b.paused=!b.paused;return this.ok(b.paused?'Work paused; staff and inputs are freed.':'Work resumed.');}
 expansionCost(){const n=this.s.expansion+1,m=this.has('survey')?.75:1;return{gold:Math.round(190*n*m),wood:Math.round(25*n*m),stone:Math.round(12*n*m)};}
 expand(){if(this.s.expansion>=6)return this.fail('The whole frontier is yours.');if(!this.pay(this.expansionCost()))return this.fail('Not enough resources to expand.');this.s.expansion++;this.s.fame+=25;this.record('The town charter grew. There is room for new streets.');return this.ok('New land claimed.');}
 connected(){const paths=new Set(this.s.buildings.filter(b=>b.type==='path').map(b=>`${b.x},${b.y}`)),hall=this.s.buildings.find(b=>b.type==='hall'),seen=new Set([`${hall.x},${hall.y}`]),q=[[hall.x,hall.y]];
 for(let i=0;i<q.length;i++)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const x=q[i][0]+dx,y=q[i][1]+dy,k=`${x},${y}`;if(paths.has(k)&&!seen.has(k)){seen.add(k);q.push([x,y]);}}
 return new Set(this.s.buildings.filter(b=>b.type==='hall'||seen.has(`${b.x},${b.y}`)||[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>seen.has(`${b.x+dx},${b.y+dy}`))).map(b=>b.id));}
 combosFor(b){return D.combos.filter(c=>(c.a===b.type||c.b===b.type)&&this.s.buildings.some(n=>!n.paused&&n.id!==b.id&&n.type===(c.a===b.type?c.b:c.a)&&Math.max(Math.abs(n.x-b.x),Math.abs(n.y-b.y))===1));}
 discoverCombos(){for(const b of this.s.buildings)for(const c of this.combosFor(b)){if(!this.s.combos.includes(c.id)){this.s.combos.push(c.id);this.s.fame+=18;this.notice('Neighbourhood discovered: '+c.name,'discovery');this.record('Discovered '+c.name+'.');}}}
 economy(){const s=this.s,connected=this.connected();let population=4,appeal=0,demand=0;
 for(const b of s.buildings){const d=D.buildings[b.type];population+=(d.housing||0)+(d.housing?(b.level-1)*2:0);if(!b.paused){appeal+=(d.appeal||0)*(1+(b.level-1)*.3);demand+=(d.workers||0)*(this.has('logistics')?.8:1);}}
 const labor=demand?Math.min(1,population/demand):1,foodLow=s.r.food<population*.3,mood=clamp(68+appeal*.55-(foodLow?28:0)-(labor<1?(1-labor)*25:0),30,100),rates=Object.fromEntries(Object.keys(D.resources).map(r=>[r,0])),rows=[];
 for(const b of s.buildings){const d=D.buildings[b.type];if(b.type==='path')continue;
 const isConnected=connected.has(b.id),combos=this.combosFor(b),level=1+(b.level-1)*.60;
 let mult=level*(b.type==='hall'?1:(isConnected?(this.has('paving')?1.2:1):.65))*(d.workers?labor:1)*(b.type==='hall'?1:.8+mood/500)*(1+Math.min(s.legacy,10)*.05)*(this.has('masterwork')?1.15:1);
 if(b.paused)mult=0;const comboBonus=combos.reduce((a,c)=>a+c.bonus,0);mult*=1+comboBonus;
 const terrainBonus=d.terrain===terrain(b.x,b.y)?.25:0;mult*=1+terrainBonus;
 const out={},input={};for(const[r,n]of Object.entries(d.input||{}))input[r]=n*mult;
 for(const[r,n]of Object.entries(d.out||{})){let bonus=1;if(this.has('axes')&&r==='wood')bonus+=.2;if(this.has('granaries')&&r==='food')bonus+=.2;if(this.has('masonry')&&r==='stone')bonus+=.2;if(this.has('trade')&&r==='gold')bonus+=.2;if(this.has('metallurgy')&&['ore','tools'].includes(r))bonus+=.25;if(this.has('scholarship')&&r==='knowledge')bonus+=.25;if(this.has('resonance')&&r==='essence')bonus+=.3;
 if(b.type==='farm'){if(this.season==='Winter')bonus-=.20;if(this.weather==='Rain')bonus+=.15;}
 out[r]=(n+(b.type==='museum'&&r==='gold'?Object.keys(s.relics).length*5:0))*mult*bonus;}
 let status=b.paused?'Paused':d.workers&&labor<.99?'Short staffed':!isConnected?'Needs a path':'Working';
 for(const[r,n]of Object.entries(input))if(n>0&&s.r[r]<n/60){status='Needs '+D.resources[r].short.toLowerCase();break;}
 for(const[r,n]of Object.entries(out))rates[r]+=n;for(const[r,n]of Object.entries(input))rates[r]-=n;
 rows.push({b,d,out,input,mult,connected:isConnected,combos,terrainBonus,status});}
 rates.food-=population*.7;return{population,appeal,demand,labor,mood,foodLow,rates,rows,connected};}
 tick(dt){if(!Number.isFinite(dt)||dt<=0)return;let remaining=Math.min(dt,7200);while(remaining>1e-6){const step=Math.min(1,remaining);this.step(step);remaining-=step;}}
 step(dt){const s=this.s,oldDay=this.day,e=this.economy();this.lastRates=e;const rate=dt/60;
 for(const row of e.rows){let available=1;for(const[r,n]of Object.entries(row.input))if(n>0)available=Math.min(available,s.r[r]/(n*rate));available=clamp(available,0,1);
 for(const[r,n]of Object.entries(row.input))s.r[r]=Math.max(0,s.r[r]-n*rate*available);
 const reward={};for(const[r,n]of Object.entries(row.out))reward[r]=n*rate*available;this.add(reward);
 if(row.d.xp&&available>0)for(const h of s.heroes)if(!this.busy(h.id)&&h.rest<=0)this.giveXP(h,row.d.xp*row.mult*available*rate);
 }
 s.r.food=Math.max(0,s.r.food-e.population*.7*rate);s.elapsed+=dt;
 for(const h of s.heroes)h.rest=Math.max(0,h.rest-dt*(this.count('inn')?1.4:1)*(this.count('tavern')?1.4:1));
 for(const m of s.missions){if(m.done)continue;m.remaining=Math.max(0,m.remaining-dt);if(m.remaining<=0)this.finishMission(m);}
 if(this.day!==oldDay){this.add({fame:Math.max(2,Math.floor(e.appeal/9+e.population/8))});s.stats.visitors+=Math.max(1,Math.floor(e.appeal/5));if(this.day%2===0&&s.eventDay!==this.day&&!s.event){s.event={index:Math.floor(this.rand()*D.events.length),day:this.day};s.eventDay=this.day;this.notice('A visitor has a story to tell.','event');}if(this.day%3===1)this.makeContracts();}
 }
 research(id){const r=D.research.find(v=>v.id===id);if(!r)return this.fail('Unknown research.');if(this.has(id))return this.fail('Already researched.');if(this.rank<r.rank||r.requires&&!this.has(r.requires))return this.fail('Complete the prerequisites first.');if(!this.pay(r.cost))return this.fail('Not enough insight or materials.');this.s.research.push(id);this.s.fame+=22;this.record('Researched '+r.name+'.');return this.ok(r.name+' completed.');}
 recruit(id){const d=D.heroes.find(v=>v.id===id);if(!d||this.s.heroes.some(h=>h.id===id))return this.fail('This adventurer is already in your guild.');if(this.rank<d.rank)return this.fail('Your town needs a higher rank.');if(!this.pay(d.cost))return this.fail('Not enough resources to recruit.');this.s.heroes.push({id,level:1,xp:0,gear:0,rest:0});this.s.fame+=15;this.record(d.name+' joined the guild.');return this.ok(d.name+' has arrived.');}
 busy(id){return this.s.missions.some(m=>!m.done&&m.heroes.includes(id));}
 xpNeeded(h){return 25+h.level*18;}
 giveXP(h,xp){if(h.level>=25)return;h.xp+=xp*(this.has('mentors')?1.35:1);while(h.xp>=this.xpNeeded(h)&&h.level<25){h.xp-=this.xpNeeded(h);h.level++;}if(h.level>=25)h.xp=0;}
 trainCost(h){return{gold:50*h.level,food:5*h.level};}
 train(id){const h=this.s.heroes.find(v=>v.id===id);if(!h||this.busy(id))return this.fail('This adventurer must be at home to train.');if(h.level>=25)return this.fail('Maximum level reached.');if(!this.pay(this.trainCost(h)))return this.fail('Not enough resources to train.');this.giveXP(h,this.xpNeeded(h)-h.xp);return this.ok('Training complete. Level '+h.level+'.');}
 gearCost(h){return{gold:65*(h.gear+1),tools:4*(h.gear+1)};}
 equip(id){const h=this.s.heroes.find(v=>v.id===id);if(!h||this.busy(id))return this.fail('This adventurer must be at home to equip.');if(h.gear>=5)return this.fail('Masterwork equipment already equipped.');if(!this.pay(this.gearCost(h)))return this.fail('Not enough equipment or crowns.');h.gear++;return this.ok('Equipment improved to tier '+h.gear+'.');}
 power(ids,region){let base=0,bonus=this.has('resonance')?.1:0;for(const id of ids){const h=this.s.heroes.find(h=>h.id===id),d=D.heroes.find(h=>h.id===id);if(!h||!d)continue;base+=d.power+(h.level-1)*5+h.gear*12;if(d.regions&&d.regions.includes(region))bonus+=.20;bonus+=d.party||0;}return Math.round(base*(1+bonus));}
 preview(region,ids,mode='steady'){const r=D.regions[region];if(!r)return null;const stage=this.s.regionProgress[region],difficulty=Math.round(r.power*(1+Math.min(stage,3)*.22)),power=this.power(ids,region),mult=mode==='careful'?1.25:mode==='bold'?.85:1;let chance=clamp(.78+(power/difficulty-1)*.5+(mode==='careful'?.12:mode==='bold'?-.12:0),.12,.98);if(region===0&&stage===0&&this.s.stats.wins===0)chance=1;
 return{power,difficulty,chance,time:Math.round(r.time*(1+Math.min(stage,3)*.15)*mult),stage,mode,rewardMult:mode==='bold'?1.45:mode==='careful'?.8:1};}
 launch(region,ids,mode='steady'){const r=D.regions[region];if(!r||this.rank<r.rank)return this.fail('This region is not yet open.');if(!['steady','careful','bold'].includes(mode))return this.fail('Choose a valid approach.');if(!Array.isArray(ids)||ids.length<1||ids.length>3||new Set(ids).size!==ids.length)return this.fail('Choose one to three different adventurers.');
 if(ids.some(id=>!this.s.heroes.some(h=>h.id===id&&h.rest<=0)||this.busy(id)))return this.fail('One of those adventurers is unavailable.');if(this.s.missions.filter(m=>!m.done).length>=this.partyLimit)return this.fail('All expedition slots are occupied.');if(!this.pay(r.cost))return this.fail('Not enough provisions for this journey.');
 const p=this.preview(region,ids,mode),m={id:this.s.nextId++,region,heroes:[...ids],mode,total:p.time,remaining:p.time,chance:p.chance,stage:p.stage,choice:null,done:false};this.s.missions.push(m);this.record('An expedition set out for '+r.name+'.');return this.ok('The party is on its way.');}
 chooseMission(id,choice){const m=this.s.missions.find(v=>v.id===id);if(!m||m.done||m.choice!==null||m.remaining>m.total*.6||![0,1].includes(choice))return this.fail('That decision is no longer available.');m.choice=choice;return this.ok(choice===0?'The party took the side road.':'The party stayed the course.');}
 finishMission(m){const s=this.s,r=D.regions[m.region];m.done=true;let chance=m.chance,lootMult=(m.mode==='bold'?1.45:m.mode==='careful'?.8:1),xpMult=1;
 for(const id of m.heroes){const h=D.heroes.find(v=>v.id===id);lootMult+=h.loot||0;xpMult+=h.xp||0;}
 if(m.choice===0){if(r.choice.kind==='loot'){lootMult+=.4;chance-=.08;}else{chance+=.16;lootMult-=.15;}}
 const first=m.region===0&&m.stage===0&&s.stats.wins===0,success=first||this.rand()<clamp(chance,.1,.99),reward={};let found=null,newRelic=false;
 if(success){s.stats.wins++;const progress=s.regionProgress[m.region];s.regionProgress[m.region]=Math.min(4,Math.max(progress,m.stage+1));const scale=(1+Math.min(m.stage,3)*.25)*lootMult;
 for(const[k,v]of Object.entries(r.loot))reward[k]=Math.round(v*scale);reward.fame=25+m.region*14+Math.min(m.stage,3)*10;
 if(m.stage===3&&progress<4)found=r.relics[2];else{let roll=this.rand();if(roll<.75||s.pity[m.region]>=2){const missing=r.relics.slice(0,2).filter(id=>!s.relics[id]);found=missing.length&&s.pity[m.region]>=2?missing[0]:r.relics[(this.rand()<.6)?0:1];if(progress>=4&&this.rand()<.12)found=r.relics[2];}}
 if(found){newRelic=!s.relics[found];s.relics[found]=(s.relics[found]||0)+1;s.pity[m.region]=newRelic?0:s.pity[m.region]+1;if(newRelic)reward.fame+=30;}else s.pity[m.region]++;
 }else{s.stats.losses++;reward.gold=Math.round(r.loot.gold*.25);reward.fame=5;}
 this.add(reward);for(const id of m.heroes){const h=s.heroes.find(v=>v.id===id);this.giveXP(h,(success?22+m.region*12+Math.min(m.stage,3)*7:12+m.region*5)*xpMult);h.rest=success?8:22;}
 m.result={success,reward,found,newRelic};this.record((success?'Returned from ':'Withdrew from ')+r.name+(found?' with '+D.relics.find(v=>v.id===found).name:'')+'.');this.notice(success?(newRelic?'A new relic! ':'Expedition returned: ')+r.name:'The party returned safely. '+r.name+' will wait.',newRelic?'discovery':'expedition');}
 acknowledgeMission(id){const i=this.s.missions.findIndex(m=>m.id===id&&m.done);if(i>=0)this.s.missions.splice(i,1);}
 progress(kind,target){const s=this.s;switch(kind){case'build':return this.count(target);case'wins':return s.stats.wins;case'heroes':return s.heroes.length;case'research':return s.research.length;case'relics':return Object.keys(s.relics).length;case'combos':return s.combos.length;case'region':return s.regionProgress[target]||0;case'rank':return this.rank;case'day':return this.day;case'expansions':return s.expansion;case'chapter':return s.chapter;default:return s.stats[kind]||0;}}
 claimChapter(){const c=D.chapters[this.s.chapter];if(!c||this.progress(c.kind,c.target)<c.n)return this.fail('The charter objective is not complete yet.');this.add(c.reward);this.s.chapter++;this.record('Charter completed: '+c.title+'.');return this.ok(c.title+' complete.');}
 claimAchievement(id){const a=D.achievements.find(v=>v.id===id);if(!a||this.s.achievements.includes(id)||this.progress(a.kind)<a.n)return this.fail('This achievement is not ready to claim.');this.s.achievements.push(id);this.add(a.reward);return this.ok(a.name+' claimed.');}
 makeContracts(){const pools=[['wood',30,95],['stone',25,100],['food',35,110]];if(this.rank>=3)pools.push(['ore',20,170],['tools',12,210]);if(this.rank>=5)pools.push(['knowledge',30,230]);this.s.contracts=[];for(let i=0;i<3;i++){const [resource,base,gold]=pools[Math.floor(this.rand()*pools.length)];const k=1+Math.floor((this.day-1)/6)*.25;this.s.contracts.push({id:this.s.nextId++,resource,amount:Math.round(base*k),gold:Math.round(gold*k),done:false,name:['The valley co-operative','A merchant on the old road','The next town over'][i]});}}
 fulfill(id){const c=this.s.contracts.find(v=>v.id===id);if(!c||c.done)return this.fail('Contract unavailable.');if(!this.pay({[c.resource]:c.amount}))return this.fail('Not enough stock to deliver.');c.done=true;this.s.stats.contracts++;this.add({gold:c.gold,fame:18});return this.ok('Delivery complete. Payment received.');}
 trade(resource,amount,buy){const prices={wood:4,stone:5,food:3,ore:8,tools:18,knowledge:18,essence:90};if(!prices[resource]||![10,50].includes(amount)||typeof buy!=='boolean')return this.fail('Invalid trade.');if(['ore','tools','knowledge'].includes(resource)&&this.rank<3||resource==='essence'&&this.rank<6)return this.fail('This stock is not available yet.');
 if(buy){if(this.s.r[resource]+amount>this.capacity)return this.fail('Your storehouses are full.');if(!this.pay({gold:prices[resource]*amount}))return this.fail('Not enough crowns.');this.add({[resource]:amount});}else{if(!this.pay({[resource]:amount}))return this.fail('Not enough stock to sell.');this.add({gold:Math.round(prices[resource]*amount*.45)});}return this.ok('Trade completed.');}
 chooseEvent(index){const e=this.s.event;if(!e)return this.fail('There is no event to resolve.');const c=D.events[e.index].choices[index];if(!c)return this.fail('Choose one of the available responses.');if(!this.pay(c.cost||{}))return this.fail('Not enough resources for that response.');this.add(c.reward);this.record(D.events[e.index].title+': '+c.text+'.');this.s.event=null;return this.ok('A small part of the town’s story.');}
 prestige(name){if(this.s.chapter<D.chapters.length)return this.fail('Finish the charter before founding a new settlement.');const old=this.s,n=fresh();n.legacy=Math.min(10,old.legacy+1);n.relics={...old.relics};n.settings={...old.settings};n.started=true;n.name=(name||old.name).slice(0,24);n.seed=old.seed;n.log=[{day:1,text:'A new frontier. The old stories came with us.'}];this.s=n;this.makeContracts();return this.ok('A new town, with a lasting legacy.');}
 export(){this.s.lastSave=Date.now();const data=JSON.stringify(this.s);return JSON.stringify({game:'bramblehaven',format:1,checksum:checksum(data),data},null,2);}
 static import(text){if(typeof text!=='string'||text.length>2000000)throw Error('This is not a valid Bramblehaven save.');let raw;try{raw=JSON.parse(text);}catch{throw Error('The save is not valid JSON.');}
 if(raw.game!=='bramblehaven'||raw.format!==1||typeof raw.data!=='string'||checksum(raw.data)!==raw.checksum)throw Error('Save checksum or format mismatch. Keep the original backup unchanged.');let o;try{o=JSON.parse(raw.data);}catch{throw Error('The saved data is damaged.');}
 if(!o||o.version!==1)throw Error('This save needs a different game version.');const n=fresh();
 const num=(v,a,b,label)=>{if(typeof v!=='number'||!Number.isFinite(v)||v<a||v>b)throw Error('Invalid '+label+' in save.');return v;};
 const integer=(v,a,b,label)=>{num(v,a,b,label);if(!Number.isInteger(v))throw Error('Invalid '+label+' in save.');return v;};
 if(typeof o.name!=='string'||o.name.length>24)throw Error('Invalid town name.');n.name=o.name;
 for(const k of Object.keys(n.r))n.r[k]=num(o.r&&o.r[k],0,1e12,k);
 for(const k of ['elapsed','fame'])n[k]=num(o[k],0,1e12,k);n.expansion=integer(o.expansion,0,6,'land');n.legacy=integer(o.legacy||0,0,10,'legacy');n.seed=integer(o.seed,1,4294967295,'random seed');n.nextId=integer(o.nextId,1,1e9,'id');n.chapter=integer(o.chapter,0,D.chapters.length,'chapter');
 if(!Array.isArray(o.buildings)||o.buildings.length>324)throw Error('Invalid building data.');const positions=new Set(),ids=new Set();n.buildings=o.buildings.map(b=>{if(!b||!Object.hasOwn(D.buildings,b.type))throw Error('Unknown building.');const x=integer(b.x,0,17,'plot'),y=integer(b.y,0,17,'plot'),id=integer(b.id,1,1e9,'building id');if(ids.has(id)||positions.has(x+','+y)||terrain(x,y)==='water')throw Error('Conflicting building data.');ids.add(id);positions.add(x+','+y);return{id,type:b.type,x,y,level:integer(b.level,1,5,'building level'),paused:!!b.paused};});
 if(n.buildings.filter(b=>b.type==='hall').length!==1)throw Error('The guild hearth is missing.');
 if(!Array.isArray(o.heroes)||o.heroes.length<1||o.heroes.length>D.heroes.length)throw Error('Invalid guild.');const heroes=new Set();n.heroes=o.heroes.map(h=>{if(!h||!D.heroes.some(d=>d.id===h.id)||heroes.has(h.id))throw Error('Unknown or duplicate adventurer.');heroes.add(h.id);return{id:h.id,level:integer(h.level,1,25,'hero level'),xp:num(h.xp,0,100000,'hero XP'),gear:integer(h.gear,0,5,'equipment'),rest:num(h.rest,0,1000,'recovery')};});
 const list=(v,allowed,label)=>{if(!Array.isArray(v)||v.length>allowed.length||v.some(x=>!allowed.includes(x))||new Set(v).size!==v.length)throw Error('Invalid '+label+'.');return[...v];};
 n.research=list(o.research,D.research.map(r=>r.id),'research');n.combos=list(o.combos,D.combos.map(r=>r.id),'neighbourhoods');n.achievements=list(o.achievements,D.achievements.map(r=>r.id),'achievements');n.types=list(o.types,Object.keys(D.buildings),'building history');
 n.relics={};if(!o.relics||typeof o.relics!=='object'||Array.isArray(o.relics))throw Error('Invalid relics.');for(const[k,v]of Object.entries(o.relics)){if(!D.relics.some(r=>r.id===k))throw Error('Unknown relic.');n.relics[k]=integer(v,1,1e9,'relic count');}
 for(const k of Object.keys(n.stats))n.stats[k]=num(o.stats&&o.stats[k],0,1e12,'statistics');
 for(const k of ['regionProgress','pity']){if(!Array.isArray(o[k])||o[k].length!==7)throw Error('Invalid expedition history.');n[k]=o[k].map(v=>integer(v,0,k==='regionProgress'?4:1e9,'route progress'));}
 if(!Array.isArray(o.missions)||o.missions.length>1000)throw Error('Invalid missions.');const active=new Set();n.missions=o.missions.map(m=>{if(!m||!Array.isArray(m.heroes)||m.heroes.length<1||m.heroes.length>3||new Set(m.heroes).size!==m.heroes.length||m.heroes.some(id=>!heroes.has(id)))throw Error('Invalid expedition party.');if(!m.done)for(const id of m.heroes){if(active.has(id))throw Error('An adventurer is in two parties.');active.add(id);}const id=integer(m.id,1,1e9,'mission id');if(ids.has(id))throw Error('Duplicate id.');ids.add(id);const total=num(m.total,1,10000,'duration');const out={id,region:integer(m.region,0,6,'region'),heroes:[...m.heroes],mode:['steady','careful','bold'].includes(m.mode)?m.mode:'steady',total,remaining:num(m.remaining,0,total,'remaining time'),chance:num(m.chance,0,1,'chance'),stage:integer(m.stage,0,4,'stage'),choice:m.choice===0?0:m.choice===1?1:null,done:!!m.done};
 if(out.done){if(!m.result||typeof m.result.success!=='boolean')throw Error('Invalid expedition report.');const reward={};for(const[k,v]of Object.entries(m.result.reward||{})){if(k!=='fame'&&!Object.hasOwn(D.resources,k))throw Error('Invalid reward.');reward[k]=num(v,0,1e9,'reward');}if(m.result.found!==null&&!D.relics.some(r=>r.id===m.result.found))throw Error('Invalid discovery.');out.result={success:m.result.success,reward,found:m.result.found,newRelic:!!m.result.newRelic};}return out;});
 if(!Array.isArray(o.contracts)||o.contracts.length>3)throw Error('Invalid contracts.');n.contracts=o.contracts.map(c=>{if(!Object.hasOwn(D.resources,c.resource))throw Error('Invalid trade material.');return{id:integer(c.id,1,1e9,'contract id'),resource:c.resource,amount:integer(c.amount,1,1e9,'trade amount'),gold:integer(c.gold,0,1e9,'trade reward'),done:!!c.done,name:String(c.name||'A travelling merchant').slice(0,80)};});
 n.event=o.event?{index:integer(o.event.index,0,D.events.length-1,'event'),day:integer(o.event.day,1,1e10,'event day')}:null;n.eventDay=integer(o.eventDay||0,0,1e10,'event day');
 n.settings={speed:[0,1,2,4].includes(o.settings&&o.settings.speed)?o.settings.speed:1,music:!!(o.settings&&o.settings.music),sfx:o.settings?o.settings.sfx!==false:true};n.started=!!o.started;n.lastSave=num(o.lastSave,0,1e15,'save time');n.log=Array.isArray(o.log)?o.log.slice(0,40).filter(l=>l&&typeof l.text==='string'&&Number.isFinite(l.day)).map(l=>({day:clamp(l.day,1,1e10),text:l.text.slice(0,240)})):[];
 n.nextId=Math.max(n.nextId,...n.buildings.map(b=>b.id+1),...n.missions.map(m=>m.id+1),...n.contracts.map(c=>c.id+1));return new Game(n);}
}
Game.fresh=fresh;Game.terrain=terrain;Game.checksum=checksum;Game.clamp=clamp;
if(typeof module!=='undefined'&&module.exports)module.exports=Game;else root.BHGame=Game;
})(typeof globalThis!=='undefined'?globalThis:this);
