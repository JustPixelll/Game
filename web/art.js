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
 pause:'M7 4v16M17 4v16',play:'m7 3 14 9-14 9V3Z',fast:'m2 4 9 8-9 8V4Zm10 0 10 8-10 8V4Z',
 coins:'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm8 8a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z',
 mail:'M2 5h20v14H2V5Zm0 0 10 8L22 5',tent:'m12 3 11 18H1L12 3Zm0 8-5 10h10l-5-10Z'
};
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
function building(type,level=1){const key=type+':'+level;if(sprites.has(key))return sprites.get(key);const cv=document.createElement('canvas');cv.width=96;cv.height=112;const c=cv.getContext('2d');c.imageSmoothingEnabled=false;
 ellipse(c,48,85,29,11,'#293f3d35');const base=()=>poly(c,[[19,79],[48,64],[78,79],[48,94]],'#b6b590');const house=(roof=P.roof,w=42,h=24)=>box(c,48,82,w,h,P.cream,roof);
 switch(type){
 case'hall':base();box(c,42,81,45,26,P.cream,P.roof);box(c,66,69,19,42,'#d6c7a4','#536e75');rect(c,65,6,2,14,P.woodDark);poly(c,[[67,7],[80,10],[67,14]],P.gold);rect(c,26,61,6,9,'#eab958');line(c,23,60,34,66,P.woodDark,2);rect(c,49,56,8,15,'#845d3c');rect(c,50,58,6,8,'#ebd5a0');break;
 case'cottage':base();house();rect(c,61,35,5,10,'#88725a');rect(c,60,34,7,3,'#6b6051');poly(c,[[22,78],[33,82],[33,78],[22,74]],'#886c4b');for(let i=0;i<4;i++)rect(c,23+i*3,72+i,2,5,'#d8cf9b');rect(c,70,76,3,4,'#75a36b');rect(c,70,74,3,2,'#e6af7a');break;
 case'lumber':base();box(c,51,77,34,17,'#c29c6c','#5f8263');for(let i=0;i<4;i++){line(c,26,76+i*3,43,84+i*3,'#76563c',5);ellipse(c,26,76+i*3,3,2,'#d7b57c');}rect(c,62,71,4,9,'#94724e');ellipse(c,64,70,8,4,'#b5915e');ellipse(c,64,69,5,2,'#dac095');line(c,64,66,68,56,'#755c49',2);poly(c,[[65,57],[70,57],[74,61],[67,61]],'#b9c3bc');break;
 case'quarry':base();poly(c,[[23,72],[39,63],[67,71],[57,85],[33,84]],'#6b7870');for(let i=0;i<6;i++){let x=28+(i%3)*14,y=64+Math.floor(i/3)*12;poly(c,[[x-7,y],[x-2,y-12],[x+6,y-9],[x+8,y+2],[x,y+6]],['#a6aaa0','#c1c2b0','#8d998f'][i%3]);line(c,x-2,y-10,x,y+3,'#d3d3c0',1);}crate(c,62,88);break;
 case'farm':poly(c,[[18,77],[48,61],[80,77],[48,95]],'#847348');for(let a=0;a<5;a++)for(let b=0;b<5;b++){let x=22+a*6+b*5,y=78+a*3-b*3;line(c,x,y,x,y-6,'#94763c',1);rect(c,x-1,y-8,3,5,'#d7b864');rect(c,x,y-9,1,3,'#f0d78d');}line(c,21,70,72,94,'#baae7a',2);line(c,72,94,79,81,'#baae7a',2);for(let i=0;i<5;i++)rect(c,22+i*12,66+i*6,2,9,'#c2b487');rect(c,52,51,2,16,P.wood);line(c,46,57,60,57,P.wood,2);rect(c,48,50,8,8,'#b4744f');rect(c,50,45,5,5,'#e6c88b');rect(c,47,44,12,2,'#997b47');break;
 case'garden':poly(c,[[20,79],[48,65],[76,79],[48,93]],'#9aac7b');poly(c,[[27,79],[48,68],[69,79],[48,90]],'#6f9369');for(let i=0;i<16;i++){let x=30+(i*17%35),y=74+(i*7%12);rect(c,x,y-3,1,4,'#487254');rect(c,x-1,y-5,3,3,['#e1be73','#d78c82','#e3dbb0'][i%3]);}rect(c,44,61,3,19,P.wood);ellipse(c,46,58,11,12,'#587d58');ellipse(c,42,54,8,9,'#7d9b64');rect(c,48,54,3,3,'#eac27c');break;
 case'market':base();rect(c,26,54,3,26,P.wood);rect(c,67,51,3,27,P.wood);poly(c,[[23,55],[49,39],[74,51],[49,66]],'#e1ce9a');for(let i=0;i<5;i++){poly(c,[[24+i*5,55-i*3],[29+i*5,52-i*3],[55+i*5,63-i*3],[50+i*5,66-i*3]],i%2?'#e9d7a9':'#bd7257');}poly(c,[[27,73],[51,84],[68,76],[46,64]],'#a98559');poly(c,[[27,73],[51,84],[51,91],[27,80]],P.wood);for(let i=0;i<6;i++){ellipse(c,32+i*4,73+i*2,3,2,i%2?'#cf9863':'#88a365');}crate(c,63,87);break;
 case'warehouse':base();house('#667c7b',49,28);poly(c,[[49,62],[64,55],[64,75],[49,83]],'#6b5a41');for(let i=0;i<4;i++)line(c,50+i*4,63-i*2,50+i*4,81-i*2,'#a58c62',1);crate(c,25,81);crate(c,33,86);crate(c,27,73);break;
 case'inn':base();box(c,47,82,48,39,'#e3cfa0','#a66253');for(let i=0;i<3;i++)poly(c,[[26+i*7,48+i*3],[30+i*7,50+i*3],[30+i*7,57+i*3],[26+i*7,55+i*3]],'#f0ca74');line(c,24,65,48,77,P.wood,2);rect(c,67,42,2,21,P.woodDark);rect(c,65,50,11,12,'#bc994e');rect(c,67,53,7,5,'#e4d5a2');rect(c,58,24,5,9,P.woodDark);break;
 case'mine':base();poly(c,[[19,78],[27,51],[44,41],[68,47],[79,77],[51,92]],'#8e9889');poly(c,[[31,71],[34,57],[52,48],[64,57],[65,78],[47,87]],'#525f58');poly(c,[[34,72],[36,58],[51,50],[60,58],[60,78],[48,84]],'#283e38');line(c,33,58,34,77,'#b69a68',4);line(c,34,58,56,49,'#b69a68',4);line(c,57,50,61,77,'#9b7b50',4);line(c,42,78,52,95,'#878d79',2);line(c,50,74,64,91,'#878d79',2);crate(c,59,87);rect(c,65,62,3,6,P.gold);break;
 case'smith':base();house('#676a70',43,23);rect(c,29,23,10,34,'#8a8470');rect(c,27,22,14,5,'#b0a58b');for(let i=0;i<5;i++)line(c,30,29+i*5,37,29+i*5,'#b1a18a',1);poly(c,[[56,71],[68,65],[68,80],[56,86]],'#523b2f');poly(c,[[58,73],[66,69],[66,79],[58,83]],'#da8747');poly(c,[[60,75],[64,71],[65,78],[60,81]],'#f0c56a');rect(c,30,80,12,4,'#43514e');poly(c,[[25,74],[43,74],[39,78],[31,80],[29,77]],'#73817b');rect(c,33,78,4,7,'#77867e');break;
 case'library':base();house('#748797',45,32);poly(c,[[27,69],[43,77],[43,65],[27,57]],'#766c58');for(let r=0;r<2;r++)for(let i=0;i<5;i++)rect(c,28+i*3,60+i*1.5+r*6,2,5,['#b57d64','#94ab93','#dfc68f'][i%3]);poly(c,[[55,44],[63,40],[63,49],[55,53]],'#e9dcae');line(c,59,42,59,51,'#91886c',1);break;
 case'bakery':base();house('#ba8151',45,25);rect(c,62,26,6,16,'#a99780');poly(c,[[22,70],[47,82],[47,86],[22,74]],'#d5b46f');for(let i=0;i<4;i++)ellipse(c,28+i*5,71+i*2,3,2,'#f1d392');ellipse(c,68,83,8,5,'#9c7d52');ellipse(c,68,80,8,5,'#dfbd7b');break;
 case'windmill':base();poly(c,[[37,81],[58,82],[56,34],[43,32]],'#d4c597');poly(c,[[48,82],[60,76],[57,34],[48,34]],'#b19e75');poly(c,[[37,35],[49,19],[62,35]],'#976752');rect(c,45,69,6,12,'#655740');break;
 case'training':base();poly(c,[[22,75],[48,62],[76,76],[49,91]],'#c0af7b');for(let i=0;i<4;i++){rect(c,25+i*13,76+i*3-3,2,9,'#907951');}rect(c,43,53,3,29,P.wood);line(c,34,60,55,62,P.wood,3);rect(c,40,57,10,13,'#ba9562');ellipse(c,45,50,6,6,'#d4b987');ellipse(c,64,69,9,10,'#d9c999');ellipse(c,64,69,6,7,'#ba7a61');ellipse(c,64,69,2,3,'#e3ce93');break;
 case'tavern':base();house('#66816a',49,31);rect(c,64,41,2,25,P.wood);rect(c,66,51,10,12,'#b08a49');rect(c,68,53,5,7,'#e1c879');ellipse(c,29,80,7,4,'#b08a5a');rect(c,22,80,14,8,'#856848');ellipse(c,29,79,7,4,'#c29c69');line(c,23,85,35,85,P.woodDark,1);break;
 case'museum':base();box(c,49,82,49,27,'#dad1b2','#738895');for(let i=0;i<3;i++){poly(c,[[27+i*7,57+i*3],[31+i*7,59+i*3],[31+i*7,78+i*3],[27+i*7,76+i*3]],'#ede3c5');}poly(c,[[37,42],[50,26],[64,41],[50,51]],'#d2b66e');rect(c,48,35,4,8,'#ede0b0');break;
 case'fountain':base();ellipse(c,48,79,25,12,'#a9b4a5');ellipse(c,48,76,22,11,'#d3d1b2');ellipse(c,48,76,17,8,'#72b4b5');rect(c,45,54,6,24,'#bec5af');ellipse(c,48,57,12,6,'#dad7b9');ellipse(c,48,55,10,4,'#91c5c0');rect(c,47,43,2,13,'#b6e5d4');break;
 case'greenhouse':base();poly(c,[[23,69],[48,81],[74,68],[48,52]],'#8cae95');poly(c,[[23,47],[48,60],[48,80],[23,68]],'#aad1bd');poly(c,[[48,60],[74,47],[74,68],[48,80]],'#82b4a8');poly(c,[[22,47],[47,31],[75,47],[48,62]],'#c0ddc8');line(c,23,48,48,62,'#e7e4c4',2);line(c,48,62,74,48,'#e7e4c4',2);for(let i=0;i<4;i++){line(c,26+i*6,50+i*3,26+i*6,69+i*3,'#e7e4c4',1);line(c,50+i*7,60-i*4,50+i*7,78-i*4,'#e7e4c4',1);}for(let i=0;i<5;i++)rect(c,27+i*4,64+i*2,3,6,'#628e65');break;
 case'alchemist':base();house('#897596',42,24);box(c,65,63,17,36,'#c7c1a0','#726a92');rect(c,24,67,10,15,'#7d765c');ellipse(c,30,65,8,3,'#b2996a');ellipse(c,30,64,5,2,'#97c5a0');rect(c,28,57,4,7,'#99c4a5');rect(c,29,55,2,3,'#ded3a7');break;
 case'observatory':base();poly(c,[[29,80],[48,89],[70,77],[70,47],[48,39],[29,51]],'#c2c1b0');poly(c,[[48,58],[70,47],[70,77],[48,89]],'#909e99');ellipse(c,49,47,22,11,'#749398');c.fillStyle='#8cabb0';c.beginPath();c.arc(49,44,21,Math.PI,0);c.fill();poly(c,[[47,24],[50,24],[54,45],[51,46]],'#d5c895');line(c,57,35,72,22,'#ceb77e',6);line(c,71,23,75,20,'#e1d1a4',8);poly(c,[[54,65],[62,61],[62,72],[54,76]],'#e6d397');break;
 case'beacon':base();poly(c,[[30,80],[48,89],[67,80],[48,69]],'#dbd1ab');poly(c,[[39,78],[48,83],[57,78],[54,27],[42,27]],'#d4d0b4');poly(c,[[48,83],[57,78],[54,27],[48,26]],'#a8b8ae');ellipse(c,48,27,13,6,'#d6c7a1');rect(c,38,12,3,17,'#d1c49b');rect(c,55,12,3,17,'#a5ad94');poly(c,[[36,13],[48,1],[60,13],[48,20]],'#6e8b88');poly(c,[[44,25],[48,14],[53,25],[48,32]],'#f3d789');rect(c,46,49,4,8,'#749389');break;
 case'path':poly(c,[[16,80],[48,64],[80,80],[48,96]],'#d1c7a0');break;
 default:base();house();
 }
 if(level>1&&type!=='path'){for(let i=0;i<level-1;i++)rect(c,38+i*6,99,4,3,'#eac477');}
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
 constructor(canvas,getGame,onTile){this.canvas=canvas;this.c=canvas.getContext('2d',{alpha:false});this.getGame=getGame;this.onTile=onTile;this.w=1;this.h=1;this.zoom=1;this.pan={x:0,y:0};this.hover=null;this.selected=null;this.blueprint=null;this.moving=null;this.showRoads=false;this.people=[];this.pointers=new Map();this.drag=null;this.pinch=null;this.lastTime=0;this.reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 new ResizeObserver(()=>this.resize()).observe(canvas);this.resize();this.bind();this.home();requestAnimationFrame(t=>this.frame(t));}
 resize(){const r=this.canvas.getBoundingClientRect(),ratio=Math.min(devicePixelRatio||1,2);this.w=r.width;this.h=r.height;this.canvas.width=Math.round(r.width*ratio);this.canvas.height=Math.round(r.height*ratio);this.ratio=ratio;this.c.imageSmoothingEnabled=false;}
 home(){this.pan={x:0,y:0};this.zoom=Math.max(.65,Math.min(1.55,this.w/590));}
 zoomBy(factor){this.zoom=Math.max(.4,Math.min(3,this.zoom*factor));}
 project(x,y){return{x:(x-y)*32,y:(x+y)*16};}
 screenToWorld(sx,sy){return{x:(sx-this.w/2-this.pan.x)/this.zoom,y:(sy-this.h*.56-this.pan.y)/this.zoom+275};}
 tileAt(sx,sy,hitBuilding=false){const p=this.screenToWorld(sx,sy),x=Math.round((p.x/32+p.y/16)/2),y=Math.round((p.y/16-p.x/32)/2);if(hitBuilding){const buildings=[...this.getGame().s.buildings].filter(b=>b.type!=='path').sort((a,b)=>(b.x+b.y)-(a.x+a.y));for(const b of buildings){const q=this.project(b.x,b.y);if(Math.abs(p.x-q.x)<22&&p.y>q.y-54&&p.y<q.y+7)return{x:b.x,y:b.y};}}return{x,y};}
 bind(){const cv=this.canvas;
 cv.addEventListener('pointerdown',e=>{cv.setPointerCapture(e.pointerId);this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});this.drag={x:e.clientX,y:e.clientY,px:this.pan.x,py:this.pan.y,moved:false};if(this.pointers.size===2){const a=[...this.pointers.values()];this.pinch={dist:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),zoom:this.zoom};this.drag.moved=true;}});
 cv.addEventListener('pointermove',e=>{const r=cv.getBoundingClientRect();this.hover=this.tileAt(e.clientX-r.left,e.clientY-r.top);if(!this.pointers.has(e.pointerId))return;this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(this.pointers.size===2&&this.pinch){const a=[...this.pointers.values()];this.zoom=Math.max(.4,Math.min(3,this.pinch.zoom*Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)/this.pinch.dist));}else if(this.drag){const dx=e.clientX-this.drag.x,dy=e.clientY-this.drag.y;if(Math.hypot(dx,dy)>7)this.drag.moved=true;if(this.drag.moved){this.pan.x=Math.max(-1200,Math.min(1200,this.drag.px+dx));this.pan.y=Math.max(-900,Math.min(900,this.drag.py+dy));}}});
 const end=e=>{if(this.drag&&!this.drag.moved&&this.pointers.size===1&&e.type!=='pointercancel'){const r=cv.getBoundingClientRect(),p=this.tileAt(e.clientX-r.left,e.clientY-r.top,!this.blueprint&&!this.moving);this.onTile(p.x,p.y);}this.pointers.delete(e.pointerId);this.pinch=null;if(this.pointers.size===0)this.drag=null;else{const p=[...this.pointers.values()][0];this.drag={x:p.x,y:p.y,px:this.pan.x,py:this.pan.y,moved:true};}};
 cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);cv.addEventListener('wheel',e=>{e.preventDefault();this.zoomBy(e.deltaY>0?.9:1.1);},{passive:false});cv.addEventListener('pointerleave',()=>{if(!this.pointers.size)this.hover=null;});
 cv.addEventListener('keydown',e=>{const p=this.hover||{x:8,y:9};if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Enter',' '].includes(e.key)){e.preventDefault();if(e.key==='ArrowUp')p.y--;if(e.key==='ArrowDown')p.y++;if(e.key==='ArrowLeft')p.x--;if(e.key==='ArrowRight')p.x++;p.x=Math.max(0,Math.min(17,p.x));p.y=Math.max(0,Math.min(17,p.y));this.hover=p;if(e.key==='Enter'||e.key===' ')this.onTile(p.x,p.y);}});
 }
 ground(c,x,y,type,claimed,t,season){const p=this.project(x,y),xx=p.x,yy=p.y;let color=type==='water'?'#78aca5':type==='fertile'?'#a5ad78':type==='stone'?'#9caa8d':'#91a879';if(season==='Autumn'&&type!=='water')color=type==='forest'?'#9b9e6b':'#aaa77a';if(season==='Winter'&&type!=='water')color='#bcc9ac';
 poly(c,[[xx-32,yy],[xx,yy-16],[xx+32,yy],[xx,yy+16]],color);
 if(type==='water'){line(c,xx-11,yy+2+Math.sin(t+x)*2,xx+5,yy+2+Math.sin(t+x)*2,'#a2cac0',1);if((x+y)%3===0)line(c,xx+7,yy-6,xx+18,yy-6,'#94c1b7',1);return;}
 for(let i=0;i<3;i++){const tx=xx+(((x*17+y*7+i*11)%29)-14),ty=yy+(((x*3+y*11+i*7)%13)-6);rect(c,tx,ty,2,1,season==='Winter'?'#d6debf':'#b5c18c');if((x+y+i)%4===0)rect(c,tx+1,ty-2,1,2,season==='Winter'?'#cad8b9':'#6f9569');}
 if(!claimed)poly(c,[[xx-32,yy],[xx,yy-16],[xx+32,yy],[xx,yy+16]],'#375d5630');else if(this.blueprint||this.moving){c.strokeStyle='#e8e1bb3b';c.lineWidth=1;c.beginPath();c.moveTo(xx-32,yy);c.lineTo(xx,yy-16);c.lineTo(xx+32,yy);c.lineTo(xx,yy+16);c.closePath();c.stroke();}
 }
 drawPath(c,b,lookup){const p=this.project(b.x,b.y),color=this.showRoads?(this.connected.has(b.id)?'#e8c46e':'#bb8271'):'#d8c99c';poly(c,[[p.x-20,p.y],[p.x,p.y-10],[p.x+20,p.y],[p.x,p.y+10]],color);
 for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){if(lookup.has(`${b.x+dx},${b.y+dy}`)){const q=this.project(b.x+dx,b.y+dy);c.strokeStyle=color;c.lineWidth=16;c.beginPath();c.moveTo(p.x,p.y);c.lineTo((p.x+q.x)/2,(p.y+q.y)/2);c.stroke();}}
 rect(c,p.x-7,p.y-2,6,2,'#beaf83');rect(c,p.x+4,p.y+3,5,1,'#eddfb8');}
 updatePeople(dt,t,g){const tiles=g.s.buildings.filter(b=>b.type==='path');if(!tiles.length)return;const n=Math.min(18,Math.max(4,Math.floor((g.lastRates||g.economy()).population/2)));
 while(this.people.length<n){const b=tiles[this.people.length%tiles.length];this.people.push({x:b.x,y:b.y,tx:b.x,ty:b.y,id:this.people.length,wait:this.people.length*.7});}this.people=this.people.slice(0,n);
 for(const p of this.people){if(p.wait>0){p.wait-=dt;continue;}const dx=p.tx-p.x,dy=p.ty-p.y,len=Math.hypot(dx,dy);if(len<.02){p.x=p.tx;p.y=p.ty;const near=tiles.filter(b=>Math.abs(b.x-p.x)+Math.abs(b.y-p.y)===1);const b=near[Math.floor((Math.sin(t+p.id*4)+1)*.499*near.length)];if(b){p.tx=b.x;p.ty=b.y;}p.wait=.2+((p.id*13)%7)*.1;}else{const step=Math.min(len,dt*.55);p.x+=dx/len*step;p.y+=dy/len*step;}}
 }
 frame(ms){const dt=Math.min(.05,(ms-this.lastTime)/1000||0);this.lastTime=ms;this.draw(ms/1000,dt);requestAnimationFrame(t=>this.frame(t));}
 draw(t,dt){const c=this.c,g=this.getGame(),s=g.s;c.setTransform(this.ratio,0,0,this.ratio,0,0);rect(c,0,0,this.w,this.h,'#527f76');const grad=c.createLinearGradient(0,0,0,this.h);grad.addColorStop(0,'#88aea1');grad.addColorStop(1,'#638f81');c.fillStyle=grad;c.fillRect(0,0,this.w,this.h);c.save();c.translate(this.w/2+this.pan.x,this.h*.56+this.pan.y);c.scale(this.zoom,this.zoom);c.translate(0,-275);c.imageSmoothingEnabled=false;
 const lookup=new Map(s.buildings.map(b=>[`${b.x},${b.y}`,b]));const sorted=[];for(let x=0;x<18;x++)for(let y=0;y<18;y++)sorted.push({x,y});sorted.sort((a,b)=>(a.x+a.y)-(b.x+b.y));this.connected=this.showRoads?g.connected():new Set();
 for(const p of sorted){this.ground(c,p.x,p.y,root.BHGame.terrain(p.x,p.y),g.unlocked(p.x,p.y),t,g.season);const b=lookup.get(`${p.x},${p.y}`);if(b&&b.type==='path')this.drawPath(c,b,lookup);}
 const margin=6-s.expansion,A=this.project(margin,margin),B=this.project(17-margin,margin),C=this.project(17-margin,17-margin),E=this.project(margin,17-margin);
 c.strokeStyle='#efe0ac82';c.lineWidth=1.5;c.setLineDash([5,4]);c.beginPath();c.moveTo(A.x,A.y-16);c.lineTo(B.x+32,B.y);c.lineTo(C.x,C.y+16);c.lineTo(E.x-32,E.y);c.closePath();c.stroke();c.setLineDash([]);
 for(const p of sorted){const pos=this.project(p.x,p.y),type=root.BHGame.terrain(p.x,p.y),b=lookup.get(`${p.x},${p.y}`);c.globalAlpha=g.unlocked(p.x,p.y)?1:.76;
 if(b&&b.type!=='path'){c.drawImage(building(b.type,b.level),pos.x-48,pos.y-88);if(b.type==='windmill'){c.save();c.translate(pos.x,pos.y-51);c.rotate(this.reduced?-.5:t*.7);for(let i=0;i<4;i++){c.rotate(Math.PI/2);rect(c,-1,1,2,25,'#776b4e');rect(c,0,10,6,15,'#ded5ad');line(c,1,14,5,14,'#afaa85');line(c,1,19,5,19,'#afaa85');}ellipse(c,0,0,3,3,'#746a52');c.restore();}
 if(['hall','smith','bakery','cottage'].includes(b.type)&&!b.paused&&!this.reduced){for(let k=0;k<3;k++){let age=(t*.35+k*.33+p.x*.1)%1;ellipse(c,pos.x+15+Math.sin(age*5)*4,pos.y-53-age*21,2+age*4,2+age*3,`rgba(224,226,207,${.28*(1-age)})`);}}
 if(b.paused){rect(c,pos.x-4,pos.y-63,3,8,'#e6c795');rect(c,pos.x+1,pos.y-63,3,8,'#e6c795');}
 if(this.selected===b.id){c.strokeStyle='#fff1bc';c.lineWidth=2;c.beginPath();c.moveTo(pos.x-30,pos.y);c.lineTo(pos.x,pos.y+15);c.lineTo(pos.x+30,pos.y);c.stroke();ellipse(c,pos.x,pos.y-67,3,3,'#f6dc8c');}
 }else if(!b){if(type==='forest'){tree(c,pos.x-5,pos.y+3,.68,g.season==='Autumn'?1:g.season==='Winter'?2:0);if((p.x+p.y)%3===0)tree(c,pos.x+12,pos.y+6,.45,g.season==='Autumn'?1:g.season==='Winter'?2:0);}else if(type==='stone'){poly(c,[[pos.x-11,pos.y+3],[pos.x-6,pos.y-8],[pos.x+4,pos.y-10],[pos.x+11,pos.y],[pos.x+2,pos.y+7]],'#9aa999');poly(c,[[pos.x-6,pos.y-8],[pos.x+4,pos.y-10],[pos.x+3,pos.y+1],[pos.x-11,pos.y+3]],'#c2c9b0');}else if(type!=='water'&&(p.x*3+p.y)%7===0){rect(c,pos.x+8,pos.y-2,2,4,'#6b905c');rect(c,pos.x+7,pos.y-4,4,2,'#e3d4a0');rect(c,pos.x+13,pos.y+3,3,2,'#c18d65');}}
 c.globalAlpha=1;
 }
 if(!this.reduced)this.updatePeople(dt,t,g);for(const p of this.people){const q=this.project(p.x,p.y);citizen(c,q.x,q.y,p.id,t);}
 s.heroes.filter(h=>!g.busy(h.id)).slice(0,5).forEach((h,i)=>{const p=this.project(8+(i%3)*.25,9.2+Math.floor(i/3)*.3);citizen(c,p.x+3,p.y+2,h.id,t,true);});
 if(this.hover&&(this.blueprint||this.moving)){const h=this.hover,p=this.project(h.x,h.y),invalid=this.blueprint?g.placement(this.blueprint,h.x,h.y):(!g.unlocked(h.x,h.y)||lookup.has(`${h.x},${h.y}`)||root.BHGame.terrain(h.x,h.y)==='water');c.globalAlpha=.70;poly(c,[[p.x-32,p.y],[p.x,p.y-16],[p.x+32,p.y],[p.x,p.y+16]],invalid?'#cf8379':'#e5deb0');const b=this.blueprint||s.buildings.find(v=>v.id===this.moving)?.type;if(b)c.drawImage(building(b),p.x-48,p.y-88);c.globalAlpha=1;}
 c.restore();
 const cycle=(s.elapsed%90)/90,night=cycle>.74?(Math.sin((cycle-.74)/.26*Math.PI)*.17):0;if(night>0){rect(c,0,0,this.w,this.h,`rgba(35,52,74,${night})`);if(!this.reduced)for(let i=0;i<12;i++){const x=(i*173.7+t*4)%this.w,y=this.h*.3+(Math.sin(t*.6+i*2)*.5+.5)*this.h*.5;ellipse(c,x,y,1.2,1.2,'#d9e4a99c');}}
 if(g.weather==='Rain'&&!this.reduced){c.globalAlpha=.15;for(let i=0;i<25;i++){let x=(i*71+t*15)%this.w,y=(i*47+t*75)%this.h;line(c,x,y,x-3,y+9,'#e2e9d4',1);}c.globalAlpha=1;}
 }
}
root.BHArt={icon,building,thumbnail,portrait,Renderer,poly,rect,tree};
})(window);
