import { LEVELS } from './levels.js';
import { createGuards, updateGuards } from './guard.js';
import { render } from './render.js';
import { sound } from './sound.js';

const canvas=document.getElementById('game');
const ctx=canvas.getContext('2d');
const toast=document.getElementById('toast');
const params=new URLSearchParams(location.search);
const requestedLevel=Math.max(0,Math.min(2,Number(params.get('level'))||0));
const initialSuspicion=Math.max(0,Math.min(100,Number(params.get('suspicion'))||0));
const initialState=params.get('state')||'play';
const keys=new Set();
let levelIndex=requestedLevel,level=LEVELS[levelIndex],guards,player,mode='play';
let score=0,hasRelic=false,pebbles=0,collected=new Set(),noise=null,noiseId=0,lastNoiseId=0;
let suspicion=0,cameraSuspicion=0,cameraAlarmed=false,alarm=false,elapsed=0,lastFrame=performance.now(),noiseAt=0;

function startLevel(index, keepScore=true) {
  levelIndex=index;level=LEVELS[index];player={x:level.start.x,y:level.start.y};
  guards=createGuards(level);pebbles=level.pebbles;collected=new Set();hasRelic=false;
  suspicion=0;cameraSuspicion=0;cameraAlarmed=false;alarm=false;noise=null;
  if(!keepScore)score=0;mode='play';showToast('');
}
startLevel(levelIndex);
const playerParam=(params.get('player')||'').split(',').map(Number);
if(playerParam.length===2&&playerParam.every(Number.isFinite)){player.x=playerParam[0];player.y=playerParam[1];}
if(initialSuspicion){for(const g of guards)g.suspicion=initialSuspicion; suspicion=initialSuspicion;}
if(initialState==='spotted'){for(const g of guards){g.suspicion=100;g.mode='chase';g.alarmed=true;}suspicion=100;alarm=true;mode='spotted';}
if(initialState==='victory'){hasRelic=true;mode='victory';}

function showToast(message){
  if(!toast)return;toast.textContent=message;toast.classList.toggle('visible',!!message);
}
function near(a,b,r){return Math.hypot(a.x-b.x,a.y-b.y)<r;}
function inside(point,r){return point.x>=r.x-10&&point.x<=r.x+r.w+10&&point.y>=r.y-10&&point.y<=r.y+r.h+10;}
function blocked(x,y){return level.walls.some(r=>x>r.x-9&&x<r.x+r.w+9&&y>r.y-9&&y<r.y+r.h+9);}
function restart(){startLevel(levelIndex);}
function advance(){
  if(levelIndex<LEVELS.length-1){startLevel(levelIndex+1);sound.victory();}
  else {startLevel(0,false);sound.victory();}
}
function finish(){if(!hasRelic)return;mode='victory';sound.victory();}
function throwPebble(x,y){
  if(mode!=='play'||pebbles<=0)return;pebbles--;noise={x,y,time:elapsed,id:++noiseId};
  sound.footstep(true);showToast('A pebble skips through the dark');setTimeout(()=>showToast(''),1300);
}

canvas.addEventListener('pointerdown',event=>{
  if(mode==='spotted'){restart();return;}if(mode==='victory'){advance();return;}
  const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*canvas.width/rect.width,y=(event.clientY-rect.top)*canvas.height/rect.height;throwPebble(x,y);
});
window.addEventListener('keydown',event=>{
  if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(event.key))event.preventDefault();
  if(event.key==='Enter'&&mode!=='play'){mode==='spotted'?restart():advance();return;}
  keys.add(event.key.toLowerCase());if(event.repeat)return;
  if(event.key==='Shift')sound.toggleSneak(true);
});
window.addEventListener('keyup',event=>{keys.delete(event.key.toLowerCase());if(event.key==='Shift')sound.toggleSneak(false);});
window.addEventListener('blur',()=>{keys.clear();sound.toggleSneak(false);});

function step(dt,now){
  if(mode!=='play')return;
  elapsed+=dt*1000;
  const dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0);
  const dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
  const moving=dx!==0||dy!==0,sneaking=keys.has('shift');
  if(moving){
    const length=Math.hypot(dx,dy),speed=sneaking?73:142,nx=player.x+dx/length*speed*dt,ny=player.y+dy/length*speed*dt;
    if(!blocked(nx,player.y))player.x=nx;if(!blocked(player.x,ny))player.y=ny;
    player.x=Math.max(12,Math.min(988,player.x));player.y=Math.max(25,Math.min(545,player.y));
    if(!sneaking&&elapsed-noiseAt>780){noise={x:player.x,y:player.y,time:elapsed,id:++noiseId};noiseAt=elapsed;sound.footstep(false);}
    else if(sneaking&&elapsed-noiseAt>540){noiseAt=elapsed;sound.footstep(true);}
  }
  if(noise&&elapsed-noise.time>2500)noise=null;
  level.loot.forEach((item,i)=>{if(!collected.has(i)&&near(player,item,17)){collected.add(i);score+=item.value;sound.pickup();showToast(`${item.kind==='gem'?'Gem':'Coin'} collected · +${item.value}`);setTimeout(()=>showToast(''),1200);}});
  if(!hasRelic&&near(player,level.relic,23)){hasRelic=true;sound.pickup();showToast('The Moonstone is yours');setTimeout(()=>showToast(''),1500);}
  if(hasRelic&&inside(player,level.exit))finish();

  const covered=level.cover.some(r=>player.x>=r.x&&player.x<=r.x+r.w&&player.y>=r.y&&player.y<=r.y+r.h);
  const visionState={sneaking,covered,noise,lastNoiseId,time:elapsed,cameraSuspicion,cameraAlarmed};
  const result=updateGuards(guards,player,level,dt,visionState);
  if(noise)lastNoiseId=noise.id;cameraSuspicion=visionState.cameraSuspicion||0;cameraAlarmed=!!visionState.cameraAlarmed;
  suspicion=result.suspicion;
  if(result.alarm){alarm=true;sound.alarm();}
  sound.suspicion(suspicion);
  if(result.spotted){mode='spotted';alarm=true;sound.alarm();}
}

function frame(now){
  const dt=Math.min(.04,(now-lastFrame)/1000);lastFrame=now;step(dt,now);
  const covered=level.cover.some(r=>player.x>=r.x&&player.x<=r.x+r.w&&player.y>=r.y&&player.y<=r.y+r.h);
  const lit=level.lamps.some(l=>Math.hypot(player.x-l.x,player.y-l.y)<l.r*.72);
  const hidden=level.cover.some(r=>['bush','fern','hedge'].includes(r.type)&&player.x>=r.x&&player.x<=r.x+r.w&&player.y>=r.y&&player.y<=r.y+r.h);
  render(ctx,level,{time:elapsed,player,guards,suspicion,score,pebbles,collected,hasRelic,levelIndex,mode,alarm,noise,visibility:(keys.has('shift') ? 0.7 : 1)*(covered?0.45:1)*(lit?1.25:1),final:levelIndex===LEVELS.length-1,hidden});
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
