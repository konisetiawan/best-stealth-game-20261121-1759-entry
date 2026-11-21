const TAU = Math.PI * 2;
const colors = ['#182c2b', '#243e39', '#385448', '#68754e', '#c8b16a', '#dbe5dc', '#783e47', '#4a343b'];
const center = (r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

function rounded(ctx, x, y, w, h, r, fill, stroke) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, r);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
}

function floor(ctx, level, time) {
  const base = level.palette?.[0] || '#172b2b';
  ctx.fillStyle = base; ctx.fillRect(0, 0, 1000, 560);
  ctx.globalAlpha = 0.13;
  for (let y = 34; y < 560; y += 37) {
    ctx.strokeStyle = y % 74 ? '#a4aa7a' : '#748b74'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(20, y + Math.sin(time * .0002 + y) * 2); ctx.lineTo(980, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  for (let i = 0; i < 42; i++) {
    const x = (i * 173 + 31) % 980, y = (i * 97 + 58) % 530;
    ctx.fillStyle = i % 3 ? 'rgba(206,220,188,.05)' : 'rgba(201,181,124,.08)';
    ctx.beginPath(); ctx.ellipse(x, y, 2 + i % 5, 1 + i % 2, .2, 0, TAU); ctx.fill();
  }
}

function drawLamp(ctx, lamp, time) {
  const glow = ctx.createRadialGradient(lamp.x, lamp.y, 8, lamp.x, lamp.y, lamp.r);
  glow.addColorStop(0, 'rgba(255,210,111,.3)'); glow.addColorStop(.55, 'rgba(255,188,78,.12)'); glow.addColorStop(1, 'rgba(248,175,67,0)');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(lamp.x, lamp.y, lamp.r, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(255,221,151,.2)'; ctx.setLineDash([3, 9]); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(lamp.x, lamp.y, lamp.r * (.7 + Math.sin(time * .002) * .012), 0, TAU); ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle = '#f7ce76'; ctx.beginPath(); ctx.arc(lamp.x, lamp.y, 5, 0, TAU); ctx.fill();
}

function drawCover(ctx, item) {
  const { x, y, w, h, type } = item;
  if (type === 'hedge' || type === 'bush' || type === 'fern') {
    ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(x+w/2, y+h*.72, w*.55, h*.31, 0, 0, TAU); ctx.fill();
    for (let i = 0; i < Math.max(5, Math.floor(w/19)); i++) {
      const cx = x + 9 + i * (w-18) / Math.max(1, Math.floor(w/19)-1), cy = y + h*.45 + Math.sin(i*2.4)*h*.12;
      ctx.fillStyle = ['#345643','#466b4c','#264936'][i%3]; ctx.beginPath(); ctx.ellipse(cx, cy, w/8, h*.42, (i%2-.5)*.4, 0, TAU); ctx.fill();
      ctx.strokeStyle = 'rgba(178,197,123,.25)'; ctx.beginPath(); ctx.arc(cx-2,cy-3,w/12,3.3,5.4); ctx.stroke();
    }
  } else if (type === 'statue') {
    rounded(ctx,x,y,w,h,Math.min(9,w/3),'#77776a','#b4ad88');
    ctx.fillStyle='#cbc19e';ctx.beginPath();ctx.arc(x+w/2,y+8,5,0,TAU);ctx.fill();
  } else if (type === 'painting') {
    rounded(ctx,x-2,y-2,w+4,h+4,3,'#684b38','#d2ad68');
    rounded(ctx,x+4,y+5,w-8,h-10,2,'#324453','#b88f59');
    ctx.strokeStyle='rgba(217,201,153,.7)';ctx.beginPath();ctx.moveTo(x+8,y+h*.65);ctx.lineTo(x+w-8,y+h*.35);ctx.stroke();
  } else {
    rounded(ctx,x,y,w,h,6,'#3a4545','#869087');
    ctx.strokeStyle='rgba(210,222,210,.2)';ctx.beginPath();ctx.moveTo(x+8,y+8);ctx.lineTo(x+w-8,y+h-8);ctx.stroke();
  }
}

function drawLoot(ctx, level, state) {
  level.loot.forEach((item, i) => {
    if (state.collected?.has(i)) return;
    const gem = item.kind === 'gem';
    ctx.save(); ctx.translate(item.x, item.y); ctx.rotate(.2);
    ctx.fillStyle = gem ? '#73d9ca' : '#efc66f'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 12;
    ctx.beginPath();
    if (gem) { ctx.moveTo(0,-8);ctx.lineTo(7,-2);ctx.lineTo(4,7);ctx.lineTo(-4,7);ctx.lineTo(-7,-2); }
    else { ctx.arc(0,0,5,0,TAU); }
    ctx.closePath();ctx.fill();ctx.shadowBlur=0;ctx.restore();
  });
}

function drawObjective(ctx, level, state) {
  const e = level.exit;
  rounded(ctx,e.x-5,e.y-5,e.w+10,e.h+10,7,'rgba(100,174,137,.1)','rgba(121,219,167,.55)');
  ctx.strokeStyle='#91d7aa';ctx.lineWidth=3;ctx.strokeRect(e.x+7,e.y+7,e.w-14,e.h-14);
  ctx.fillStyle='rgba(169,239,187,.75)';ctx.font='700 10px system-ui';ctx.textAlign='center';ctx.fillText('EXIT',e.x+e.w/2,e.y-11);
  const r = level.relic;
  ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.ellipse(r.x,r.y+14,24,10,0,0,TAU);ctx.fill();
  rounded(ctx,r.x-19,r.y+2,38,13,5,'#857653','#d2ba7d');
  const glow=ctx.createRadialGradient(r.x,r.y-7,1,r.x,r.y-7,32);glow.addColorStop(0,'rgba(119,224,232,.8)');glow.addColorStop(1,'rgba(66,192,205,0)');
  ctx.fillStyle=glow;ctx.beginPath();ctx.arc(r.x,r.y-7,32,0,TAU);ctx.fill();
  ctx.fillStyle=state.hasRelic?'#5a877c':'#8fe5e8';ctx.shadowColor=ctx.fillStyle;ctx.shadowBlur=11;
  ctx.beginPath();ctx.moveTo(r.x,r.y-20);ctx.lineTo(r.x+9,r.y-7);ctx.lineTo(r.x,r.y+2);ctx.lineTo(r.x-9,r.y-7);ctx.closePath();ctx.fill();ctx.shadowBlur=0;
}

function conePath(ctx, origin, range, facing, halfAngle, walls) {
  ctx.beginPath();ctx.moveTo(origin.x,origin.y);
  for(let i=0;i<=32;i++){
    const angle=facing-halfAngle+halfAngle*2*i/32,dx=Math.cos(angle),dy=Math.sin(angle);let reach=range;
    for(const r of walls){
      if(Math.abs(dx)>1e-5)for(const x of [r.x,r.x+r.w]){const t=(x-origin.x)/dx,y=origin.y+dy*t;if(t>2&&t<reach&&y>=r.y&&y<=r.y+r.h)reach=t;}
      if(Math.abs(dy)>1e-5)for(const y of [r.y,r.y+r.h]){const t=(y-origin.y)/dy,x=origin.x+dx*t;if(t>2&&t<reach&&x>=r.x&&x<=r.x+r.w)reach=t;}
    }
    ctx.lineTo(origin.x+dx*reach,origin.y+dy*reach);
  }
  ctx.closePath();
}

function drawGuards(ctx, guards, level, state) {
  for (const g of guards) {
    const suspicious = g.mode === 'chase' || g.suspicion >= 72;
    const color = g.mode === 'chase' ? 'rgba(255,57,66,.25)' : suspicious ? 'rgba(255,150,54,.24)' : 'rgba(255,223,93,.2)';
    ctx.fillStyle=color;conePath(ctx,g,245*(state.visibility||1),g.angle,.53,level.walls);ctx.fill();
    ctx.strokeStyle=color.replace(/[\d.]+\)$/, '.6)');ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(g.x+Math.cos(g.angle)*120,g.y+Math.sin(g.angle)*120);ctx.stroke();
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(g.x,g.y+8,12,5,0,0,TAU);ctx.fill();
    ctx.fillStyle=g.mode==='chase'?'#dc5655':'#bbc3b4';ctx.beginPath();ctx.arc(g.x,g.y,9,0,TAU);ctx.fill();
    ctx.fillStyle='#333b38';ctx.beginPath();ctx.arc(g.x+Math.cos(g.angle)*3,g.y+Math.sin(g.angle)*3,4,0,TAU);ctx.fill();
    ctx.strokeStyle='#d3c39d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(g.x,g.y);ctx.lineTo(g.x+Math.cos(g.angle)*12,g.y+Math.sin(g.angle)*12);ctx.stroke();
  }
  if (level.camera) {
    const c=level.camera;ctx.fillStyle='rgba(255,70,72,.19)';conePath(ctx,c,c.range,c.angle,.43,level.walls);ctx.fill();
    ctx.fillStyle='#d1d8ce';ctx.fillRect(c.x-8,c.y-5,16,10);ctx.fillStyle='#e65759';ctx.beginPath();ctx.arc(c.x+Math.cos(c.angle)*8,c.y+Math.sin(c.angle)*8,3,0,TAU);ctx.fill();
  }
}

export function render(ctx, level, state) {
  const time=state.time||0;ctx.clearRect(0,0,1000,560);floor(ctx,level,time);
  for (const lamp of level.lamps) drawLamp(ctx,lamp,time);
  drawObjective(ctx,level,state);drawLoot(ctx,level,state);
  for (const wall of level.walls) {
    rounded(ctx,wall.x,wall.y,wall.w,wall.h,4,'#101d20','#334342');
    if (wall.h < 30 || wall.w < 30) {ctx.strokeStyle='rgba(190,207,179,.12)';ctx.beginPath();ctx.moveTo(wall.x,wall.y+wall.h/2);ctx.lineTo(wall.x+wall.w,wall.y+wall.h/2);ctx.stroke();}
  }
  for (const item of level.cover) drawCover(ctx,item);
  if (state.noise) {
    const radius=12+(time-state.noise.time)*.055;ctx.strokeStyle='rgba(136,220,220,.48)';ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(state.noise.x,state.noise.y,radius,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(state.noise.x,state.noise.y,radius*.56,0,TAU);ctx.stroke();
  }
  drawGuards(ctx,state.guards||[],level,state);
  const p=state.player||{x:level.start.x,y:level.start.y};
  const hidden=level.cover.some(r=>p.x>=r.x&&p.x<=r.x+r.w&&p.y>=r.y&&p.y<=r.y+r.h&&(r.type==='bush'||r.type==='fern'||r.type==='hedge'));
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.beginPath();ctx.ellipse(p.x,p.y+9,10,4,0,0,TAU);ctx.fill();
  ctx.fillStyle=hidden?'#789878':'#e7dbbd';ctx.beginPath();ctx.arc(p.x,p.y,8,0,TAU);ctx.fill();
  ctx.fillStyle='#263d3c';ctx.beginPath();ctx.arc(p.x+2,p.y-2,3,0,TAU);ctx.fill();
  if (hidden) {
    for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#294a39':'#3d6244';ctx.beginPath();ctx.ellipse(p.x-8+i*5,p.y+5+(i%2)*3,6,3,(i-1.5)*.38,0,TAU);ctx.fill();}
    ctx.strokeStyle='rgba(172,220,160,.6)';ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(p.x,p.y,13,0,TAU);ctx.stroke();ctx.setLineDash([]);
  }

  const vignette=ctx.createRadialGradient(500,278,145,500,278,630);
  vignette.addColorStop(0,'rgba(4,12,17,.02)');vignette.addColorStop(.62,'rgba(4,12,17,.2)');vignette.addColorStop(1,'rgba(3,9,16,.73)');
  ctx.fillStyle=vignette;ctx.fillRect(0,0,1000,560);
  ctx.fillStyle='rgba(185,202,198,.035)';for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse((time*.008+i*227)%1200-100,80+i*89,140,27,0,0,TAU);ctx.fill();}
  drawHud(ctx,level,state,hidden);
  if(state.mode==='spotted'||state.mode==='victory') drawScreen(ctx,state);
}

function drawHud(ctx,level,state,hidden) {
  ctx.textAlign='left';ctx.fillStyle='rgba(8,17,22,.76)';rounded(ctx,18,16,355,73,12,ctx.fillStyle,'rgba(207,220,206,.15)');
  ctx.fillStyle='#e8e2c9';ctx.font='700 17px system-ui';ctx.fillText(level.name,34,41);
  ctx.fillStyle='#9faea4';ctx.font='11px system-ui';ctx.fillText(level.subtitle||'MOVE THROUGH SHADOW',34,60);
  for(let i=0;i<3;i++){ctx.fillStyle=i<=state.levelIndex?'#d8bb75':'#455453';ctx.beginPath();ctx.arc(343+i*11,37,3.5,0,TAU);ctx.fill();}
  ctx.fillStyle='rgba(8,17,22,.8)';rounded(ctx,756,16,225,73,12,ctx.fillStyle,'rgba(207,220,206,.15)');
  ctx.fillStyle='#99aaa1';ctx.font='10px system-ui';ctx.fillText('MOONSTONE',773,37);
  ctx.fillStyle=state.hasRelic?'#8fe5e8':'#66736d';ctx.font='700 12px system-ui';ctx.fillText(state.hasRelic?'SECURED':'UNCLAIMED',773,57);
  ctx.fillStyle='#d6c99e';ctx.font='10px system-ui';ctx.fillText(`LOOT ${state.collected?.size||0}  ·  ✦ ${state.score||0}  ·  ◉ ${state.pebbles??0}  ·  ${formatTime(state.time||0)}`,773,76);
  ctx.fillStyle='rgba(8,17,22,.78)';rounded(ctx,18,500,250,42,11,ctx.fillStyle,'rgba(207,220,206,.12)');
  const suspicion=state.suspicion||0;ctx.fillStyle='#8e9c92';ctx.font='10px system-ui';ctx.fillText(state.alarm?'ALARM · RUN!':hidden?'HIDDEN IN COVER':'SUSPICION',33,518);
  rounded(ctx,33,525,210,7,4,'#2b3936');rounded(ctx,33,525,210*suspicion/100,7,4,suspicion>75?'#ee5d59':suspicion>35?'#e4a352':'#d7c166');
  ctx.fillStyle='rgba(8,17,22,.73)';rounded(ctx,728,500,253,42,11,ctx.fillStyle,'rgba(207,220,206,.12)');
  ctx.fillStyle='#9eaaa1';ctx.font='10px system-ui';ctx.fillText('WASD / ARROWS MOVE  ·  SHIFT SNEAK  ·  CLICK LURE',742,525);
}

function formatTime(ms){const s=Math.floor(ms/1000);return `${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;}

function drawScreen(ctx,state) {
  ctx.fillStyle='rgba(5,12,17,.76)';ctx.fillRect(0,0,1000,560);
  const win=state.mode==='victory';ctx.textAlign='center';
  ctx.fillStyle=win?'#9be0d5':'#f18372';ctx.font='800 13px system-ui';
  ctx.fillText(win?'RELIC SECURED':'THE MANOR WAKES',500,226);
  ctx.fillStyle='#eee8d4';ctx.font='700 38px Georgia,serif';
  ctx.fillText(win?(state.final?'The night is yours':'A clean escape'):'Spotted!',500,275);
  ctx.fillStyle='#a9b5ab';ctx.font='14px system-ui';
  ctx.fillText(win?(state.final?'All three shadows crossed.':'The exit is behind you.'):'The guards caught your trail. Try the shadows again.',500,306);
  rounded(ctx,405,344,190,42,12,'rgba(185,207,170,.11)','rgba(219,231,211,.25)');
  ctx.fillStyle='#e5d7b0';ctx.font='700 12px system-ui';ctx.fillText(win?'CLICK OR ENTER TO CONTINUE':'CLICK OR ENTER TO RETRY',500,370);
}
