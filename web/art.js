/* Original, code-drawn isometric art. All sprites, portraits and icons are local. */
(function(root){'use strict';
const D=root.BHData,paths={
 gold:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v10m3-8h-4a2 2 0 0 0 0 4h2a2 2 0 0 1 0 4H9',
 wood:'M5 5h12l4 4v10H7l-4-4V7l2-2Zm2 4h14M7 9v10M3 5l4 4m4-3 2 3m-2 4h6m-6 3h4',
 stone:'m3 16 4-10 8-2 6 8-3 7H6l-3-3Zm4-10 5 7 9-1M12 13l-6 6',
 food:'M5 20h14l2-10H3l2 10ZM8 10l2-6m4 6 2-7M5 5l4 3m9-4-3 3M7 14h10',
 ore:'m12 2 8 7-3 11H7L3 9l9-7Zm0 0 3 9-3 11-3-11 3-9ZM3 9l6 2 6 0 5-2',
 tools:'m4 3 5 5-2 3-4-4a6 6 0 0 0 8 7l6 6 3-3-6-6A6 6 0 0 0 8 3M15 4l5 5M19 3l2 2',
 knowledge:'M12 6C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-4-1-7-1-10 2Zm0 0v15M5 8h4M5 12h4m6-4h4m-4 4h4',
 essence:'m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z',
 home:'m2 11 10-8 10 8M5 9v12h14V9M10 21v-7h4v7',
 hammer:'m14 3 7 7-4 4-3-3L5 21l-3-3 10-9-3-3 5-3Z',
 shield:'m12 3 8 3v6c0 4-4 7-8 9-4-2-8-5-8-9V6l8-3Zm0 5v8m-4-4h8',
 compass:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5 5-3 7-7 3 3-7 7-3Z',
 book:'M4 3h13a3 3 0 0 1 3 3v15H6a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3ZM7 3v14m-4 1h17M10 7h6m-6 4h6',
 star:'m12 2 3 6 7 2-5 5 1 7-6-3-6 3 1-7-5-5 7-2 3-6Z',
 tree:'m12 2-8 9h4l-5 6h7v5h4v-5h7l-5-6h4l-8-9Z',
 people:'M8 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-6 18v-4a5 5 0 0 1 12 0v4m2-18a4 4 0 0 1 0 8m1 3a5 5 0 0 1 5 5v2',
 heart:'M12 21 3 12C-3 4 8-1 12 6 16-1 27 4 21 12l-9 9Z',
 gear:'m9 3 6 0 1 3 3 1 2 5-2 5-3 1-1 3H9l-1-3-3-1-2-5 2-5 3-1 1-3ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
 close:'m5 5 14 14M19 5 5 19',plus:'M12 4v16M4 12h16',minus:'M4 12h16',check:'m4 12 5 5L20 6',arrow:'M4 12h16m-6-6 6 6-6 6',back:'M20 12H4m6-6-6 6 6 6',
 lock:'M6 10h12v11H6V10Zm2 0V6a4 4 0 0 1 8 0v4m-4 4v3',
 sound:'M3 9h4l5-5v16l-5-5H3V9Zm13-2c4 3 4 7 0 10m3-13c6 5 6 11 0 16',mute:'M3 9h4l5-5v16l-5-5H3V9Zm13-1 6 8m0-8-6 8',
 time:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4v6l4 3',sun:'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0-5v2m0 16v2M2 12h2m16 0h2M5 5l2 2m10 10 2 2M5 19l2-2M17 7l2-2',
 moon:'M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z',rain:'M5 14a5 5 0 0 1 0-10 7 7 0 0 1 13 1 4 4 0 0 1 1 9M7 17l-2 4m8-4-2 4m8-4-2 4',
 snow:'M12 2v20M3 7l18 10M3 17 21 7M8 4l4 3 4-3M8 20l4-3 4 3M3 11l5-1-1-5m10 14-1-5 5-1',
 fire:'M13 2c0 7 8 7 8 13a9 9 0 0 1-18 0c0-3 2-6 4-8 0 6 6 5 6-5Zm-1 9c-1 4-4 5-4 7a4 4 0 0 0 8 0c0-2-3-3-4-7Z',
 flower:'M12 14v8m0-4-5-2m5 4 5-2M9 4a3 3 0 0 1 6 0 3 3 0 0 1 4 5 3 3 0 0 1-4 5 3 3 0 0 1-6 0 3 3 0 0 1-4-5 3 3 0 0 1 4-5Zm3 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z',
 seed:'M12 22V12C3 13 2 7 3 3c6 0 9 3 9 9 0-6 4-8 9-8 0 6-3 10-9 8Z',
 bell:'M5 17c2-4 1-9 3-11a6 6 0 0 1 8 0c2 2 1 7 3 11H5Zm5 4h4M12 2v2',
 feather:'M4 21 17 5M5 16C1 7 14 0 20 3c3 7-6 20-15 13Zm4-6 1 5 5-1',
 crown:'m3 6 5 5 4-8 4 8 5-5-2 14H5L3 6ZM5 16h14',
 flask:'M9 2h6m-5 0v7l-6 9a3 3 0 0 0 3 4h10a3 3 0 0 0 3-4l-6-9V2M7 15h10',
 map:'m2 5 6-3 8 3 6-3v17l-6 3-8-3-6 3V5Zm6-3v17m8-14v17',
 flag:'M4 22V3m0 1c6-5 9 5 16 0v10c-7 5-10-5-16 0',
 move:'M12 2v20M2 12h20M8 6l4-4 4 4M8 18l4 4 4-4M6 8l-4 4 4 4m12-8 4 4-4 4',
 trash:'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
 save:'M4 3h13l4 4v14H3V3Zm3 0v6h10V3M7 21v-8h10v8',
 upload:'M12 16V2m-5 5 5-5 5 5M3 14v7h18v-7',download:'M12 2v14m-5-5 5 5 5-5M3 14v7h18v-7',
 help:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM8 8c0-5 8-5 8 0 0 3-4 2-4 6m0 3v1',
 pause:'M7 4v16M17 4v16',play:'m7 3 14 9-14 9V3Z',
 coins:'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm8 8a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z',
 mail:'M2 5h20v14H2V5Zm0 0 10 8L22 5',tent:'m12 3 11 18H1L12 3Zm0 8-5 10h10l-5-10Z'
};
paths.grid='M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18';
function icon(name,size=18){return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.star}"/></svg>`;}
const P={outline:'#3d4940',cream:'#e8d5a3',wall:'#cebb8d',wallDark:'#ac9469',roof:'#b65d46',roofLight:'#d47f55',roofDark:'#8d493c',wood:'#866449',woodDark:'#584836',green:'#6d9260',greenLight:'#8cad6a',ink:'#38493d',gold:'#ebbf62'};
function poly(c,pts,color){c.fillStyle=color;c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);}
function ellipse(c,x,y,rx,ry,color){c.fillStyle=color;c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fill();}
function line(c,x,y,x2,y2,color,width=1){c.strokeStyle=color;c.lineWidth=width;c.beginPath();c.moveTo(x,y);c.lineTo(x2,y2);c.stroke();}
function box(c,x,y,w=20,h=21,wall=P.wall,roof=P.roof){
 const a=w/2,b=w/4;poly(c,[[x-a,y-b],[x,y],[x,y-h],[x-a,y-h-b]],wall);poly(c,[[x,y],[x+a,y-b],[x+a,y-h-b],[x,y-h]],P.wallDark);
 poly(c,[[x-a-3,y-h-b],[x,y-h-w*.8],[x+2,y-h+2]],roof);poly(c,[[x,y-h-w*.8],[x+a+3,y-h-b],[x+2,y-h+2]],P.roofDark);
 line(c,x-a-3,y-h-b,x+2,y-h+2,P.outline,1);line(c,x+2,y-h+2,x+a+3,y-h-b,P.outline,1);
 for(let i=0;i<3;i++){line(c,x-a+2+i*3,y-h-b+i*2,x+i*2,y-h-w*.6+i*3,'#d69365',1);}
 poly(c,[[x+4,y-1],[x+10,y-4],[x+10,y-15],[x+4,y-12]],P.woodDark);rect(c,x+5,y-9,1,1,P.gold);
 poly(c,[[x-a+5,y-10],[x-a+11,y-7],[x-a+11,y-14],[x-a+5,y-17]],'#4e6960');line(c,x-a+8,y-15,x-a+8,y-9,P.cream,1);
}
function crate(c,x,y){poly(c,[[x-5,y-3],[x,y],[x+5,y-3],[x,y-6]],'#c79861');poly(c,[[x-5,y-3],[x,y],[x,y+6],[x-5,y+3]],'#a87e51');poly(c,[[x,y],[x+5,y-3],[x+5,y+3],[x,y+6]],'#8f6948');line(c,x-4,y-2,x-1,y+4,P.woodDark);}
function tree(c,x,y,s=1,kind=0){c.save();c.translate(x,y);c.scale(s,s);ellipse(c,0,0,14,6,'#314c423d');rect(c,-2,-15,4,15,'#7d6046');
 const cols=kind===1?['#a27542','#c0904c','#d9ac5d']:kind===2?['#769080','#a8bca0','#c6d1bb']:['#3f6951','#547f59','#769960'];
 poly(c,[[-15,-13],[0,-42],[15,-13]],cols[0]);poly(c,[[-13,-24],[0,-50],[13,-24]],cols[1]);poly(c,[[-9,-35],[0,-56],[9,-35]],cols[2]);
 line(c,-1,-45,-8,-29,cols[2],2);rect(c,3,-22,3,2,cols[2]);c.restore();}
const sprites=new Map(),thumbs=new Map(),portraits=new Map();
/* Sprites use one physical ground anchor: (48, 88), the centre of a 64 x 32 plot.
   Every wall starts at z=0. Roofs, doors and props share the same isometric projection. */
const ANCHOR={x:48,y:88};
function building(type,level=1){
 const key=type+':'+level;if(sprites.has(key))return sprites.get(key);
 const cv=document.createElement('canvas');cv.width=96;cv.height=112;
 const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 const point=(u,v,z=0)=>[48+u-v,88+(u+v)/2-z];
 const face=(pts,col)=>poly(c,pts.map(p=>point(...p)),col);
 const edge=(a,b,col,width=1)=>line(c,...point(...a),...point(...b),col,width);
 const floor=(color='#c7b78d')=>{face([[-14,-14],[14,-14],[14,14],[-14,14]],color);edge([-14,14],[14,14],'#a49779');edge([14,14],[14,-14],'#958a70');};
 const block=(u,v,a,b,h,light='#ead9af',dark='#c6b286',top='#eee1be')=>{
  face([[u-a,v+b,0],[u+a,v+b,0],[u+a,v+b,h],[u-a,v+b,h]],light);
  face([[u+a,v-b,0],[u+a,v+b,0],[u+a,v+b,h],[u+a,v-b,h]],dark);
  face([[u-a,v-b,h],[u+a,v-b,h],[u+a,v+b,h],[u-a,v+b,h]],top);
 };
 const roof=(u,v,a,b,h,col='#b6654c',dark='#854638',rh=13)=>{
  // Gable ridge runs along the u axis. Near eaves slope at exactly the map's 2:1 ratio.
  face([[u-a,v-b,h],[u+a,v-b,h],[u+a,v,h+rh],[u-a,v,h+rh]],dark);
  face([[u+a,v-b,h],[u+a,v+b,h],[u+a,v,h+rh]],'#d9c39b');
  face([[u-a,v+b,h],[u+a,v+b,h],[u+a,v,h+rh],[u-a,v,h+rh]],col);
  edge([u-a,v+b,h],[u+a,v+b,h],'#684c3a',1.2);
  edge([u-a,v,h+rh],[u+a,v,h+rh],'#e2a77e',1.2);
  for(let f=.3;f<.95;f+=.25)edge([u-a,v+b*(1-f),h+rh*f],[u+a,v+b*(1-f),h+rh*f],'#ffffff20');
 };
 const windows=(u,v,a,b,h)=>{
  const rows=h>27?[11,23]:[12];
  for(const z of rows)for(const x of [-7,3]){
   face([[u+x,v+b,z-4],[u+x+4,v+b,z-4],[u+x+4,v+b,z+2],[u+x,v+b,z+2]],'#55776e');
   edge([u+x+2,v+b,z-4],[u+x+2,v+b,z+2],'#f8e6b5',.8);
   edge([u+x,v+b,z-1],[u+x+4,v+b,z-1],'#f8e6b5',.8);
  }
  face([[u+a,v-1,0],[u+a,v+5,0],[u+a,v+5,11],[u+a,v-1,11]],'#715541');
  edge([u+a,v+3,5],[u+a,v+3,6],'#e0bf70',1.5);
 };
 const house=(color='#b7684e',dark='#885342',h=21,a=12,b=12)=>{floor();block(0,0,a,b,h);windows(0,0,a,b,h);roof(0,0,a+1,b+1,h,color,dark,12);};
 const crateAt=(u,v,h=5)=>{block(u,v,3,3,h,'#ba9060','#967347','#ceaa79');edge([u-2,v+3,1],[u+2,v+3,h-1],'#816548');};
 const chimney=(u=-5,v=-5,h=35)=>{block(u,v,2.5,2.5,h,'#b4aa8d','#8a8575','#d5cbb1');for(let z=h-12;z<h;z+=4)edge([u-2.5,v+2.5,z],[u+2.5,v+2.5,z],'#837d68');};
 const pole=(u,v,h,color='#927553')=>edge([u,v,0],[u,v,h],color,2);
 const plaque=(symbol,u=13,v=7,z=19)=>{const [x,y]=point(u,v,z);rect(c,x-3,y-3,7,7,'#d9bb72');c.font='bold 6px sans-serif';c.fillStyle='#4d5444';c.textAlign='center';c.fillText(symbol,x+.5,y+2);};
 const h=20+Math.min(4,level-1)*2;
 switch(type){
 case 'hall':floor('#c8bd96');block(-3,2,11,11,25);windows(-3,2,11,11,25);roof(-3,2,12,12,25,'#a96a4c','#87513e',14);block(8,-7,4,4,41,'#ddcca7','#baaa83');roof(8,-7,5,5,41,'#5b7c77','#405e5a',8);pole(8,-7,57);face([[8,-7,57],[16,-7,53],[8,-7,51]],'#dbb65d');break;
 case 'cottage':house('#b96e53','#8a503e',h,11,11);chimney(-6,-4,h+10);break;
 case 'lumber':floor('#b2aa7f');block(-3,-3,9,9,13,'#c6aa7b','#9e8157');roof(-3,-3,10,10,13,'#638063','#49624d',9);for(let n=0;n<3;n++){edge([1,8+n*3,3],[10,8+n*3,3],'#795a3e',4);const q=point(10,8+n*3,3);ellipse(c,q[0],q[1],2,2,'#d6b783');}crateAt(-9,10);break;
 case 'quarry':floor('#a6ac96');face([[-11,-10],[10,-10],[11,10],[-11,10]],'#7d897b');for(const[u,v,k]of[[-7,-4,9],[4,-6,12],[7,5,7],[-5,7,5]]){face([[u-5,v+4],[u+5,v+3],[u+3,v-3,k],[u-3,v-4,k+2]],'#b4b9a6');face([[u+5,v+3],[u+6,v-4],[u+3,v-3,k]],'#828f83');face([[u-3,v-4,k+2],[u+3,v-3,k],[u+6,v-4]],'#d9d9bd');}break;
 case 'farm':floor('#a89b70');face([[-12,-12],[12,-12],[12,12],[-12,12]],'#8b7851');for(let u=-9;u<=9;u+=6){edge([u,-11],[u,11],'#bd9961',2);for(let v=-8;v<=9;v+=5){pole(u,v,4,'#859345');const q=point(u,v,5);rect(c,q[0]-1,q[1]-2,2,3,'#eed088');}}for(let i=-12;i<=12;i+=8)pole(i,13,5,'#c5b280');edge([-12,13,4],[12,13,4],'#d8c696');break;
 case 'garden':floor('#adbc8d');face([[-10,-10],[10,-10],[10,10],[-10,10]],'#769665');pole(-3,-3,13);const p=point(-3,-3,20);ellipse(c,p[0],p[1],8,9,'#678b60');ellipse(c,p[0]-3,p[1]-3,5,6,'#88a66c');for(const[u,v]of[[8,8],[-8,8],[8,-8]]){const q=point(u,v,3);rect(c,q[0],q[1],2,3,'#628352');rect(c,q[0]-1,q[1]-2,4,3,'#e5af8a');}break;
 case 'market':floor();for(const[u,v]of[[-11,-9],[11,-9],[-11,9],[11,9]])pole(u,v,22);for(let u=-12;u<12;u+=4)face([[u,-11,21],[u+4,-11,21],[u+4,11,21],[u,11,21]],(u+12)%8?'#eaddb5':'#b87555');block(0,9,10,3,7,'#b28a5a','#967048','#d9b27b');for(let u=-8;u<9;u+=4){const p=point(u,8,9);ellipse(c,...p,2.5,2,['#d2a15c','#91a16a','#bb6d56'][(u+8)/4%3]);}crateAt(9,-6);break;
 case 'warehouse':house('#6d8390','#4c6570',h,13,13);face([[13,-6,0],[13,8,0],[13,8,16],[13,-6,16]],'#8f7b57');for(let v=-4;v<8;v+=3)edge([13,v,1],[13,v,15],'#c1ab7c');crateAt(-10,13);break;
 case 'inn':house('#ac6c61','#864e49',30+(level-1)*2,13,13);plaque('I',14,9,25);break;
 case 'mine':floor('#a3a791');face([[-13,10],[-13,-9],[2,-13,26],[13,-6,17],[13,11],[0,14]],'#869483');face([[-13,-9],[2,-13,26],[13,-6,17],[2,0,20]],'#b2b69e');face([[13,-4,0],[13,9,0],[13,9,13],[13,2,20],[13,-4,13]],'#304c42');edge([13,-4],[13,-4,13],'#c1a475',3);edge([13,9],[13,9,13],'#b1976b',3);edge([13,-4,13],[13,2,20],'#c8af7d',3);edge([13,2,20],[13,9,13],'#c8af7d',3);break;
 case 'smith':house('#667880','#495f66',h,11,11);chimney(-8,4,h+20);face([[11,-1,0],[11,6,0],[11,6,12],[11,-1,12]],'#654531');face([[11,0,2],[11,5,2],[11,5,9],[11,0,9]],'#e1a453');block(-7,13,4,2,5,'#60786c','#405b50','#8fa292');break;
 case 'library':house('#687d9a','#4d5e7b',h+6);plaque('B');break;
 case 'bakery':house('#b18a4e','#896b40',h);chimney(-6,-4,h+12);block(-2,13,7,2,7,'#b8975d','#987744','#ddc591');for(let u=-7;u<6;u+=4){const p=point(u,13,9);ellipse(c,...p,3,1.8,'#efca79');}break;
 case 'windmill':floor();block(0,0,6,6,35,'#e0d1aa','#bdad89');roof(0,0,8,8,35,'#a97154','#87563f',10);face([[6,-1,0],[6,4,0],[6,4,10],[6,-1,10]],'#735b42');break;
 case 'training':floor('#b9aa7d');for(const[u,v]of[[-10,-10],[10,-10],[-10,10],[10,10]])pole(u,v,7);edge([-10,10,5],[10,10,5],'#d6c396');pole(1,0,18);edge([-6,0,12],[7,0,12],'#9b7b50',3);block(1,0,3,2,12,'#b09560','#8b784e');const t=point(1,0,19);ellipse(c,...t,4,4,'#d6bd86');const q=point(7,-8,12);pole(7,-8,12);ellipse(c,...q,6,7,'#e5d4a4');ellipse(c,...q,4,5,'#ba785d');ellipse(c,...q,2,3,'#e9cf92');break;
 case 'tavern':house('#608371','#436959',h+5);plaque('C');crateAt(-10,13,6);break;
 case 'museum':house('#64869a','#466878',h+6,13,13);for(let u=-10;u<12;u+=9)edge([u,13,0],[u,13,h+5],'#f3e6c5',2);plaque('★',14,8,23);break;
 case 'fountain':floor('#b9bea7');ellipse(c,48,89,21,10,'#9ba792');ellipse(c,48,87,20,9,'#dce0c0');ellipse(c,48,87,15,6,'#77b4b5');block(0,0,2,2,21,'#dbdfbf','#b4c3af');ellipse(c,48,67,9,4,'#d9dfbe');ellipse(c,48,66,6,2,'#88c1b9');break;
 case 'greenhouse':floor('#b7ba91');block(0,0,12,12,18,'#a8cac1','#80a9a1','#bed6bf');roof(0,0,13,13,18,'#a3c5b8','#709e93',10);for(let u=-10;u<=10;u+=5){edge([u,12],[u,12,18],'#e3dec0');edge([u,12,18],[u,0,28],'#e3dec0');}edge([-12,12,9],[12,12,9],'#d9d8b3');break;
 case 'alchemist':house('#8e779e','#685c80',h,11,11);chimney(-7,-5,h+18);const a=point(11,10,6);ellipse(c,...a,5,3,'#abc8a0');pole(11,10,8,'#b2d0ad');plaque('A');break;
 case 'observatory':floor();block(0,0,11,11,28,'#d2d6bb','#a5bcb0');windows(0,0,11,11,26);ellipse(c,48,62,20,9,'#627f8c');c.fillStyle='#8eabb0';c.beginPath();c.ellipse(48,61,20,19,0,Math.PI,0);c.fill();line(c,50,45,62,35,'#d4bb7c',5);line(c,60,35,64,32,'#f1d898',6);break;
 case 'beacon':floor('#d0c6a0');block(0,0,6,6,51,'#e1ddbb','#b8c4af');for(let z=13;z<=36;z+=13)face([[6,-2,z],[6,2,z],[6,2,z+5],[6,-2,z+5]],'#638a80');block(0,0,9,9,2);ellipse(c,48,37,13,6,'#dbcd9f');for(const u of [-7,7])pole(u,0,69,'#d0c599');face([[-2,-2,54],[3,-2,54],[1,0,66]],'#f3d483');roof(0,0,9,9,68,'#668e86','#446d66',8);break;
 case 'path':face([[-14,-14],[14,-14],[14,14],[-14,14]],'#d2c49b');break;
 default:house();
 }
 // Small facade pins show upgrades without hovering beyond the footprint.
 if(level>1&&!['path','farm','garden','quarry','training','fountain'].includes(type))for(let i=0;i<level-1;i++){const p=point(11,8-i*2,5);rect(c,p[0],p[1],1.4,2,'#e5b961');}
 sprites.set(key,cv);return cv;
}
function thumbnail(type,level=1){const k=type+':'+level;if(!thumbs.has(k))thumbs.set(k,building(type,level).toDataURL());return thumbs.get(k);}
function portrait(id){if(portraits.has(id))return portraits.get(id);const d=D.heroes.find(h=>h.id===id)||D.heroes[0],cv=document.createElement('canvas');cv.width=40;cv.height=44;const c=cv.getContext('2d');
 rect(c,0,0,40,44,'#e7dfc4');rect(c,0,31,40,13,'#cecdae');rect(c,12,32,16,13,'#4e5952');rect(c,10,25,20,15,d.color);rect(c,8,29,5,11,d.color);rect(c,27,29,5,11,d.color);rect(c,9,38,3,4,d.skin);rect(c,29,38,3,4,d.skin);rect(c,17,21,6,6,d.skin);rect(c,12,9,16,16,d.hair);rect(c,11,11,18,9,d.hair);rect(c,14,13,12,12,d.skin);rect(c,13,12,14,5,d.hair);rect(c,13,16,3,4,d.hair);rect(c,16,18,2,2,'#38413c');rect(c,23,18,2,2,'#38413c');rect(c,19,23,3,1,'#986b58');rect(c,16,30,10,2,'#ddc892');rect(c,18,29,3,4,'#f0d797');
 if(id==='rowan'){rect(c,10,10,20,3,'#617e57');poly(c,[[12,10],[19,4],[26,10]],'#769468');rect(c,28,5,2,6,'#dac485');line(c,32,23,33,42,'#986f4c',2);}
 if(id==='ada'){rect(c,12,7,16,7,'#929c96');rect(c,11,12,18,3,'#b4bdb0');rect(c,18,7,3,8,'#d2b976');rect(c,7,30,8,12,'#8c9894');rect(c,10,32,2,8,'#d2b976');}
 if(id==='nera'||id==='orin'){poly(c,[[8,13],[32,13],[23,2],[17,4]],d.color);rect(c,11,13,19,2,'#6d657a');rect(c,31,19,2,23,'#786547');rect(c,30,17,4,5,'#bfd9c2');}
 if(id==='ivo'){rect(c,13,16,5,4,'#d7c28a');rect(c,22,16,5,4,'#d7c28a');rect(c,18,17,4,1,'#6e6756');}
 if(id==='flint'){rect(c,12,7,16,7,'#a68b59');rect(c,11,12,18,2,'#c7b175');rect(c,18,10,4,4,'#f1d892');rect(c,15,22,11,6,d.hair);}
 if(id==='sable'){rect(c,12,25,16,4,'#663d50');rect(c,26,29,4,11,'#814c60');line(c,7,28,8,41,'#b6c3ba',2);}
 if(id==='lark'){ellipse(c,30,36,5,7,'#bb9459');line(c,28,20,30,36,'#7a624b',2);rect(c,14,8,15,4,'#669a91');rect(c,26,4,2,7,'#d3bb78');}
 portraits.set(id,cv.toDataURL());return portraits.get(id);
}
function citizen(c,x,y,id,t,hero=false){const d=hero?D.heroes.find(h=>h.id===id):null,color=d?d.color:['#bd795c','#729a86','#b49b61','#8b82a5'][id%4],skin=d?d.skin:['#ddb78e','#b98765','#e6c39a'][id%3];const step=Math.sin(t*8+(typeof id==='number'?id:D.heroes.findIndex(h=>h.id===id)))*1.5;
 ellipse(c,x,y+1,4,2,'#203d383b');rect(c,x-3,y-9,6,7,color);rect(c,x-2,y-14,5,5,d?d.hair:'#6e5944');rect(c,x-1,y-12,4,4,skin);rect(c,x-2,y-3,2,4+step,'#54544b');rect(c,x+1,y-3,2,4-step,'#54544b');rect(c,x+2,y-11,1,1,'#40483d');if(hero)rect(c,x-4,y-15,8,2,color);
}
class Renderer{
 constructor(canvas,getGame,onTile){
  this.canvas=canvas;this.c=canvas.getContext('2d');this.getGame=getGame;this.onTile=onTile;
  this.pan={x:0,y:0};this.zoom=1;this.pointers=new Map();this.people=[];
  this.hover=null;this.cursor=null;this.blueprint=null;this.moving=null;this.selected=null;
  this.planView=false;this.showRoads=false;this.lastTime=0;this.lastDraw=0;
  this.reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(canvas);
  this.resize();this.bind();this.home();requestAnimationFrame(t=>this.frame(t));
 }
 get planning(){return !!(this.planView||this.blueprint||this.moving);}
 resize(){const r=this.canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);this.w=r.width;this.h=r.height;this.canvas.width=Math.round(r.width*ratio);this.canvas.height=Math.round(r.height*ratio);this.ratio=ratio;this.c.imageSmoothingEnabled=false;}
 home(){this.pan={x:0,y:0};this.zoom=Math.max(.80,Math.min(1.65,this.w/470));}
 zoomBy(factor){this.zoom=Math.max(.45,Math.min(3.5,this.zoom*factor));}
 focus(x,y){const p=this.project(x,y);this.pan={x:-p.x*this.zoom,y:-(p.y-275)*this.zoom};}
 project(x,y){return{x:(x-y)*32,y:(x+y)*16};}
 screenToWorld(sx,sy){return{x:(sx-this.w/2-this.pan.x)/this.zoom,y:(sy-this.h*.56-this.pan.y)/this.zoom+275};}
 tileAt(sx,sy,hitBuilding=false){
  const p=this.screenToWorld(sx,sy),x=Math.round((p.x/32+p.y/16)/2),y=Math.round((p.y/16-p.x/32)/2);
  if(hitBuilding&&!this.planning){
   // Test the actual opaque sprite, front to back, rather than a rectangular roof box.
   const bs=[...this.getGame().s.buildings].filter(b=>b.type!=='path').sort((a,b)=>(b.x+b.y)-(a.x+a.y)||b.x-a.x);
   for(const b of bs){const q=this.project(b.x,b.y),sx=Math.floor(p.x-q.x+ANCHOR.x),sy=Math.floor(p.y-q.y+ANCHOR.y);if(sx<0||sy<0||sx>=96||sy>=112)continue;
    const cv=building(b.type,b.level);if(!cv._alpha)cv._alpha=cv.getContext('2d').getImageData(0,0,96,112).data;
    if(cv._alpha[(sy*96+sx)*4+3]>150)return{x:b.x,y:b.y};
   }
  }
  return{x,y};
 }
 bind(){const cv=this.canvas;
  cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});this.drag={x:e.clientX,y:e.clientY,px:this.pan.x,py:this.pan.y,moved:false};
   if(this.pointers.size===2){const a=[...this.pointers.values()];this.pinch={dist:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),zoom:this.zoom};this.drag.moved=true;}
  });
  cv.addEventListener('pointermove',e=>{
   const r=cv.getBoundingClientRect();this.hover=this.tileAt(e.clientX-r.left,e.clientY-r.top);
   if(!this.pointers.has(e.pointerId))return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(this.pointers.size===2&&this.pinch){const a=[...this.pointers.values()];this.zoom=clampZoom(this.pinch.zoom*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/Math.max(1,this.pinch.dist));}
   else if(this.drag){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.hypot(dx,dy)>8)this.drag.moved=true;if(this.drag.moved){this.pan.x=Math.max(-1400,Math.min(1400,this.drag.px+dx));this.pan.y=Math.max(-1100,Math.min(1100,this.drag.py+dy));}}
  });
  const end=e=>{if(this.drag&&!this.drag.moved&&this.pointers.size===1&&e.type!=='pointercancel'){const r=cv.getBoundingClientRect(),p=this.tileAt(e.clientX-r.left,e.clientY-r.top,!this.blueprint&&!this.moving);this.keyboardCursor=p;this.onTile(p.x,p.y);}
   this.pointers.delete(e.pointerId);this.pinch=null;if(!this.pointers.size)this.drag=null;else{const p=[...this.pointers.values()][0];this.drag={x:p.x,y:p.y,px:this.pan.x,py:this.pan.y,moved:true};}
  };
  cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);
  cv.addEventListener('wheel',e=>{e.preventDefault();this.zoomBy(e.deltaY>0?.9:1.1);},{passive:false});
  cv.addEventListener('pointerleave',()=>{if(!this.pointers.size)this.hover=null;});
  cv.addEventListener('keydown',e=>{const p={...(this.keyboardCursor||this.cursor||this.hover||{x:8,y:9})};if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter'].includes(e.key)){
   e.preventDefault();e.stopPropagation();if(e.key==='ArrowUp')p.y--;if(e.key==='ArrowDown')p.y++;if(e.key==='ArrowLeft')p.x--;if(e.key==='ArrowRight')p.x++;
   p.x=Math.max(0,Math.min(17,p.x));p.y=Math.max(0,Math.min(17,p.y));this.hover=p;this.keyboardCursor=p;
   if(e.key==='Enter'||this.blueprint||this.moving)this.onTile(p.x,p.y);
  }});
 }
 diamond(c,x,y,fill,stroke=null,width=1,inset=0){const p=this.project(x,y),w=32-inset,h=16-inset/2;poly(c,[[p.x-w,p.y],[p.x,p.y-h],[p.x+w,p.y],[p.x,p.y+h]],fill);if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.beginPath();c.moveTo(p.x-w,p.y);c.lineTo(p.x,p.y-h);c.lineTo(p.x+w,p.y);c.lineTo(p.x,p.y+h);c.closePath();c.stroke();}}
 ground(c,x,y,type,claimed,t,season){const p=this.project(x,y);let color=type==='water'?'#6e9f9b':type==='fertile'?'#a6af79':type==='stone'?'#a4af98':(x+y)%2?'#98af83':'#93a97e';
  if(season==='Autumn'&&type!=='water')color=(x+y)%2?'#aca579':'#a19f73';if(season==='Winter'&&type!=='water')color=(x+y)%2?'#ccd4bf':'#c4ceba';
  this.diamond(c,x,y,color);
  if(type==='water'){if((x+y)%3===0)line(c,p.x-8,p.y+Math.sin(t+x)*1.3,p.x+8,p.y+Math.sin(t+x)*1.3,'#a9cdc4',1);return;}
  if(!claimed)this.diamond(c,x,y,'#31574d45');
  if(this.planning&&claimed){this.diamond(c,x,y,'#ffffff06','#eff0d577',.8);if(type==='fertile'){for(let i=-1;i<=1;i++)line(c,p.x-3+i*4,p.y+2,p.x+i*4,p.y-2,'#e6d8a377',1.4);}}
  else if((x*3+y)%4===0){rect(c,p.x-7,p.y+2,2,1,'#b4c099');rect(c,p.x+8,p.y-1,1,1,'#718e65');}
 }
 drawPath(c,b,lookup){const p=this.project(b.x,b.y),color=this.showRoads||this.planning?(this.connected.has(b.id)?'#e1c587':'#c28d7a'):'#d4c49c';this.diamond(c,b.x,b.y,color,null,1,14);
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(lookup.has(`${b.x+dx},${b.y+dy}`)){const q=this.project(b.x+dx,b.y+dy);line(c,p.x,p.y,(p.x+q.x)/2,(p.y+q.y)/2,color,12);}
  line(c,p.x-6,p.y-1,p.x+1,p.y+2,'#b8a982',1);
 }
 planPlate(c,b){const p=this.project(b.x,b.y),connected=this.connected.has(b.id),colors={Homes:'#ece0ba',Production:'#c6d5ae',Trade:'#e4c797',Guild:'#cdbbd0',Culture:'#c1d5d3',Civic:'#d4d4bf',Wonders:'#e1d6a6'},codes={hall:'HQ',cottage:'HOME',lumber:'WOOD',quarry:'STONE',farm:'FOOD',garden:'PARK',market:'SHOP',warehouse:'STORE',inn:'INN',mine:'ORE',smith:'FORGE',library:'BOOKS',bakery:'BAKE',windmill:'MILL',training:'TRAIN',tavern:'TAVERN',museum:'MUSE',fountain:'WELL',greenhouse:'GLASS',alchemist:'ALCH',observatory:'STARS',beacon:'LIGHT'};
  this.diamond(c,b.x,b.y,colors[D.buildings[b.type].cat]||'#d9caae',connected?'#496d5c':'#a66550',1,3);
  c.font='bold 6.5px sans-serif';c.textAlign='center';c.fillStyle='#365347';c.fillText(codes[b.type]||b.type.toUpperCase(),p.x,p.y+1);
  c.font='5px sans-serif';c.fillStyle=b.paused?'#a14c3d':'#527360';c.fillText(b.paused?'PAUSED':'L'+b.level+(connected?'':' · NO ROAD'),p.x,p.y+8);
 }
 updatePeople(dt,t,g){const tiles=g.s.buildings.filter(b=>b.type==='path');if(!tiles.length){this.people=[];return;}const n=Math.min(12,Math.max(3,Math.floor((g.lastRates||g.economy()).population/3)));
  while(this.people.length<n){const b=tiles[this.people.length%tiles.length];this.people.push({x:b.x,y:b.y,tx:b.x,ty:b.y,id:this.people.length,wait:this.people.length*.7});}this.people=this.people.slice(0,n);
  for(const p of this.people){if(!tiles.some(b=>b.x===p.tx&&b.y===p.ty)){p.x=p.tx=tiles[0].x;p.y=p.ty=tiles[0].y;}
   if(p.wait>0){p.wait-=dt;continue;}const dx=p.tx-p.x,dy=p.ty-p.y,len=Math.hypot(dx,dy);
   if(len<.02){p.x=p.tx;p.y=p.ty;const near=tiles.filter(b=>Math.abs(b.x-p.x)+Math.abs(b.y-p.y)===1),b=near[Math.floor((Math.sin(t+p.id*4)+1)*.499*near.length)];if(b){p.tx=b.x;p.ty=b.y;}p.wait=.2+((p.id*13)%7)*.1;}
   else{const step=Math.min(len,dt*.5);p.x+=dx/len*step;p.y+=dy/len*step;}
  }
 }
 frame(ms){const dt=Math.min(.08,(ms-this.lastTime)/1000||0);if(ms-this.lastDraw>30||this.reduced&&ms-this.lastDraw>100){this.lastTime=ms;this.lastDraw=ms;if(!document.hidden)this.draw(ms/1000,dt);}requestAnimationFrame(t=>this.frame(t));}
 draw(t,dt){
  const c=this.c,g=this.getGame(),s=g.s;c.setTransform(this.ratio,0,0,this.ratio,0,0);rect(c,0,0,this.w,this.h,'#739f91');
  c.save();c.translate(this.w/2+this.pan.x,this.h*.56+this.pan.y);c.scale(this.zoom,this.zoom);c.translate(0,-275);c.imageSmoothingEnabled=false;
  const lookup=new Map(s.buildings.map(b=>[`${b.x},${b.y}`,b])),sorted=[];for(let x=0;x<18;x++)for(let y=0;y<18;y++)sorted.push({x,y});sorted.sort((a,b)=>a.x+a.y-b.x-b.y||a.x-b.x);this.connected=g.connected();
  for(const p of sorted){this.ground(c,p.x,p.y,root.BHGame.terrain(p.x,p.y),g.unlocked(p.x,p.y),t,g.season);const b=lookup.get(`${p.x},${p.y}`);if(b?.type==='path')this.drawPath(c,b,lookup);}
  const margin=6-s.expansion,A=this.project(margin,margin),B=this.project(17-margin,margin),C=this.project(17-margin,17-margin),E=this.project(margin,17-margin);
  c.strokeStyle='#efe4bc';c.lineWidth=1;c.setLineDash([4,4]);c.beginPath();c.moveTo(A.x,A.y-16);c.lineTo(B.x+32,B.y);c.lineTo(C.x,C.y+16);c.lineTo(E.x-32,E.y);c.closePath();c.stroke();c.setLineDash([]);
  const objects=[];
  if(!this.reduced&&!this.planning)this.updatePeople(s.settings.speed===0?0:dt,t,g);
  for(const p of sorted){const b=lookup.get(`${p.x},${p.y}`);if(b?.type==='path')continue;
   objects.push({x:p.x,y:p.y,depth:p.x+p.y,kind:b?'building':'terrain',b});}
  if(!this.planning)for(const p of this.people)objects.push({...p,depth:p.x+p.y+.12,kind:'person'});
  objects.sort((a,b)=>a.depth-b.depth||a.x-b.x);
  for(const o of objects){const pos=this.project(o.x,o.y),type=root.BHGame.terrain(o.x,o.y),claimed=g.unlocked(o.x,o.y);
   if(o.kind==='person'){citizen(c,pos.x,pos.y,o.id,t);continue;}
   if(o.b){const b=o.b;
    if(this.planning){this.planPlate(c,b);}
    else{
     if(this.selected===b.id)this.diamond(c,b.x,b.y,'#ead17b66','#ffed9c',1.5,1);
     c.drawImage(building(b.type,b.level),pos.x-ANCHOR.x,pos.y-ANCHOR.y);
     if(b.type==='windmill'){c.save();c.translate(pos.x-6,pos.y-29);c.rotate(this.reduced?-.5:t*.45);for(let i=0;i<4;i++){c.rotate(Math.PI/2);rect(c,-.75,1,1.5,19,'#7a7057');rect(c,-.5,8,4.5,11,'#e7ddbb');line(c,0,12,4,12,'#b8ad86');}ellipse(c,0,0,2,2,'#837052');c.restore();}
     if(b.paused||!this.connected.has(b.id)){const label=b.paused?'Ⅱ':'!';ellipse(c,pos.x+16,pos.y+3,4.5,4.5,'#ceab72');c.fillStyle='#4a5140';c.textAlign='center';c.font='bold 7px sans-serif';c.fillText(label,pos.x+16,pos.y+5.5);}
    }
   }else if(!this.planning){c.globalAlpha=claimed?1:.55;if(type==='forest'){tree(c,pos.x,pos.y+3,.46,g.season==='Autumn'?1:g.season==='Winter'?2:0);}else if(type==='stone'){poly(c,[[pos.x-8,pos.y+2],[pos.x-4,pos.y-6],[pos.x+3,pos.y-7],[pos.x+8,pos.y],[pos.x,pos.y+4]],'#8e9e8b');poly(c,[[pos.x-4,pos.y-6],[pos.x+3,pos.y-7],[pos.x,pos.y],[pos.x-8,pos.y+2]],'#c0c8aa');}c.globalAlpha=1;}
  }
  const cursor=this.cursor||((this.blueprint||this.moving)?this.hover:null);
  if(cursor&&(this.blueprint||this.moving)){
   const h=cursor,type=this.blueprint||s.buildings.find(b=>b.id===this.moving)?.type;
   const issue=this.blueprint?g.placement(type,h.x,h.y):g.moveProblem(this.moving,h.x,h.y);
   if(type){
    for(const n of s.buildings){if(Math.max(Math.abs(n.x-h.x),Math.abs(n.y-h.y))!==1)continue;if(D.combos.some(c=>c.a===type&&c.b===n.type||c.b===type&&c.a===n.type))this.diamond(c,n.x,n.y,'#88ded244','#d4fff2',1.5,1);}
    this.diamond(c,h.x,h.y,issue?'#bd665fbb':'#416d56dd',issue?'#ffdfc4':'#fff2b5',2.2,0);
    const p=this.project(h.x,h.y);c.fillStyle='#fff4d5';c.textAlign='center';c.font='bold 8px sans-serif';c.fillText(issue?'×':'✓',p.x,p.y+1);c.font='6px sans-serif';c.fillText((h.x+1)+','+(h.y+1),p.x,p.y+9);
   }
  }else if(this.planning&&this.selected){const b=s.buildings.find(b=>b.id===this.selected);if(b)this.diamond(c,b.x,b.y,'#ffffff11','#fff6c8',2);}
  c.restore();
  if(!this.planning){const cycle=(s.elapsed%D.DAY)/D.DAY,night=cycle>.78?Math.sin((cycle-.78)/.22*Math.PI)*.10:0;if(night>0)rect(c,0,0,this.w,this.h,`rgba(30,49,65,${night})`);}
 }
}
function clampZoom(z){return Math.max(.45,Math.min(3.5,z));}
root.BHArt={icon,building,thumbnail,portrait,Renderer,poly,rect,tree,ANCHOR};
})(window);
