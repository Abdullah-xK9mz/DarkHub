
const stage = document.getElementById('stage');
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const hudScore = document.getElementById('hudScore');
const hudLives = document.getElementById('hudLives');
const hudWave = document.getElementById('hudWave');
const hudDiff = document.getElementById('hudDiff');
const comboPill = document.getElementById('comboPill');
const hudCombo = document.getElementById('hudCombo');
const chipShield = document.getElementById('chipShield');
const chipRapid = document.getElementById('chipRapid');
const chipWeapon = document.getElementById('chipWeapon');
const nukeFlash = document.getElementById('nukeFlash');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOverScreen');
const pauseOverlay = document.getElementById('pauseOverlay');
const goTitle = document.getElementById('goTitle');
const goDesc = document.getElementById('goDesc');

let W = 0, H = 0;
function resize(){
  W = stage.clientWidth; H = stage.clientHeight;
  canvas.width = W; canvas.height = H;
}
window.addEventListener('resize', resize);
resize();

// ===== game state =====
let gameActive = false;
let rafId = null;
let frame = 0;
let score = 0;
let wave = 1;
let lives = 3;
let comboCount = 0;
let comboTimer = 0;
let bossFightActive = false;

const player = { x: 0, y: 0, r: 16, speed: 6 };
let bullets = [];
let enemyBullets = [];
let enemies = [];
let particles = [];
let powerups = [];
let stars = [];
let boss = null;

let fireTimer = 0;
let fireInterval = 16; // frames between shots (~ every 260ms at 60fps)
let rapidTimer = 0;
let shieldTimer = 0;
let weaponMode = 'normal'; // normal | spread | laser | missile
let weaponTimer = 0;
const WEAPON_INFO = {
  spread:  { icon: '🔱', label: 'موزّع',  color: '#ff3d7f' },
  laser:   { icon: '🔦', label: 'ليزر',   color: '#3ec9d6' },
  missile: { icon: '🚀', label: 'صواريخ', color: '#f2b134' }
};

const keys = {};
document.addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

let pointerActive = false;
let lastPointerX = 0, lastPointerY = 0;
stage.addEventListener('pointerdown', e => {
  if(e.target.closest('.pause-btn') || e.target.closest('.overlay')) return;
  pointerActive = true;
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
});
stage.addEventListener('pointermove', e => {
  if(!pointerActive) return;
  const dx = e.clientX - lastPointerX;
  const dy = e.clientY - lastPointerY;
  player.x = clamp(player.x + dx, player.r, W - player.r);
  player.y = clamp(player.y + dy, player.r, H - player.r);
  lastPointerX = e.clientX;
  lastPointerY = e.clientY;
});
window.addEventListener('pointerup', () => pointerActive = false);

function clamp(v, min, max){ return Math.max(min, Math.min(max, v)); }
function rand(min, max){ return Math.random() * (max - min) + min; }
function dist(x1,y1,x2,y2){ return Math.hypot(x1-x2, y1-y2); }

// ===== stars background =====
function initStars(){
  stars = [];
  for(let i=0;i<90;i++){
    stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.6+0.3, speed: rand(0.3,1.4), tw: Math.random()*Math.PI*2 });
  }
}

function updateStars(){
  stars.forEach(s => {
    s.y += s.speed;
    if(s.y > H){ s.y = -2; s.x = Math.random()*W; }
  });
}

function drawStars(){
  stars.forEach(s => {
    const alpha = 0.4 + Math.sin(frame*0.05 + s.tw)*0.3;
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${Math.max(0.15,alpha)})`;
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fill();
  });
}

// ===== player =====
function resetPlayer(){
  player.x = W/2; player.y = H - 90;
  rapidTimer = 0; shieldTimer = 0; weaponMode = 'normal'; weaponTimer = 0;
}

function drawPlayer(){
  ctx.save();
  ctx.translate(player.x, player.y);

  if(shieldTimer > 0){
    ctx.beginPath();
    ctx.strokeStyle = `rgba(62,201,214,${0.5 + Math.sin(frame*0.2)*0.3})`;
    ctx.lineWidth = 2.5;
    ctx.arc(0,0, player.r + 8, 0, Math.PI*2);
    ctx.stroke();
  }

  // engine flame
  const flameLen = 10 + Math.sin(frame*0.6)*4;
  ctx.beginPath();
  ctx.moveTo(-6, player.r - 2);
  ctx.lineTo(0, player.r - 2 + flameLen);
  ctx.lineTo(6, player.r - 2);
  const flameGrad = ctx.createLinearGradient(0, player.r-2, 0, player.r-2+flameLen);
  flameGrad.addColorStop(0, 'rgba(242,177,52,0.9)');
  flameGrad.addColorStop(1, 'rgba(242,177,52,0)');
  ctx.fillStyle = flameGrad;
  ctx.fill();

  // ship body
  ctx.beginPath();
  ctx.moveTo(0, -player.r);
  ctx.lineTo(player.r*0.85, player.r*0.8);
  ctx.lineTo(0, player.r*0.4);
  ctx.lineTo(-player.r*0.85, player.r*0.8);
  ctx.closePath();
  const bodyGrad = ctx.createLinearGradient(0,-player.r,0,player.r);
  bodyGrad.addColorStop(0, '#a8f0f8');
  bodyGrad.addColorStop(1, '#3ec9d6');
  ctx.fillStyle = bodyGrad;
  ctx.shadowColor = 'rgba(62,201,214,0.7)';
  ctx.shadowBlur = 12;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// ===== bullets =====
function playerShoot(){
  const speed = -11;
  if(weaponMode === 'spread'){
    [-0.28, 0, 0.28].forEach(ang => {
      bullets.push({ x: player.x, y: player.y - player.r, vx: Math.sin(ang)*6, vy: speed*Math.cos(ang) });
    });
  } else if(weaponMode === 'missile'){
    [-11, 11].forEach(off => {
      bullets.push({ x: player.x+off, y: player.y - player.r, vx: off*0.15, vy: speed*0.75, homing: true });
    });
  } else if(weaponMode === 'laser'){
    // الليزر شعاع مستمر بيتحدّث لوحده في updateLaserBeam، مفيش طلقات منفصلة
  } else {
    bullets.push({ x: player.x, y: player.y - player.r, vx: 0, vy: speed });
  }
}

function findNearestTarget(x,y){
  let best = null, bestD = Infinity;
  enemies.forEach(e => {
    const d = dist(x,y,e.x,e.y);
    if(d < bestD){ bestD = d; best = e; }
  });
  if(boss){
    const d = dist(x,y,boss.x,boss.y);
    if(d < bestD){ bestD = d; best = boss; }
  }
  return best;
}

function updateBullets(){
  for(let i=bullets.length-1;i>=0;i--){
    const b = bullets[i];
    if(b.homing){
      const target = findNearestTarget(b.x,b.y);
      if(target){
        const ang = Math.atan2(target.y-b.y, target.x-b.x);
        const targetVx = Math.cos(ang)*7, targetVy = Math.sin(ang)*7;
        b.vx += (targetVx - b.vx) * 0.12;
        b.vy += (targetVy - b.vy) * 0.12;
      }
    }
    b.x += b.vx; b.y += b.vy;
    if(b.y < -30 || b.x < -30 || b.x > W+30 || b.y > H+30){ bullets.splice(i,1); }
  }
  for(let i=enemyBullets.length-1;i>=0;i--){
    const b = enemyBullets[i];
    b.x += b.vx; b.y += b.vy;
    if(b.y > H+20 || b.y < -20 || b.x < -20 || b.x > W+20){ enemyBullets.splice(i,1); }
  }
}

function updateLaserBeam(){
  const beamHalfWidth = 16;
  if(frame % 4 !== 0) return; // معدل ضرر الليزر
  enemies.forEach(e => {
    if(Math.abs(e.x - player.x) < beamHalfWidth && e.y < player.y){
      e.hp--;
      spawnExplosion(e.x, e.y, '#3ec9d6');
    }
  });
  if(boss && Math.abs(boss.x - player.x) < beamHalfWidth + boss.r*0.5 && boss.y < player.y){
    boss.hp--;
    spawnExplosion(boss.x, boss.y - boss.r*0.3, '#3ec9d6');
  }
  enemies = enemies.filter(e => {
    if(e.hp <= 0){
      const t = ENEMY_TYPES[e.type];
      maybeDropPowerup(e.x,e.y);
      registerKill(t.score);
      return false;
    }
    return true;
  });
  if(boss && boss.hp <= 0){
    registerKill(300);
    spawnExplosion(boss.x,boss.y,'#ff3d7f');
    boss = null; bossFightActive = false;
    nextWave();
  }
}

function drawBullets(){
  bullets.forEach(b => {
    ctx.save();
    if(b.homing){
      ctx.shadowColor = 'rgba(242,177,52,0.9)';
      ctx.shadowBlur = 9;
      ctx.fillStyle = '#ffd76a';
      ctx.translate(b.x,b.y);
      ctx.rotate(Math.atan2(b.vy,b.vx)+Math.PI/2);
      ctx.beginPath();
      ctx.moveTo(0,-8); ctx.lineTo(4,6); ctx.lineTo(-4,6);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.shadowColor = 'rgba(62,201,214,0.9)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#eaffff';
      ctx.fillRect(b.x-2, b.y-8, 4, 14);
    }
    ctx.restore();
  });
  enemyBullets.forEach(b => {
    ctx.save();
    ctx.shadowColor = 'rgba(255,61,127,0.9)';
    ctx.shadowBlur = 8;
    ctx.fillStyle = '#ff9fc1';
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3.5, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  });
}

// ===== نظام مراحل الصعوبة المتدرجة =====
function getDifficulty(w){
  if(w <= 3)  return { label: 'سهل 🥱',   speedMult: 0.55, diveMult: 0.5,  fireMult: 0.5,  extraRows: -1 };
  if(w <= 7)  return { label: 'متوسط 🤔', speedMult: 1.0,  diveMult: 1.0,  fireMult: 1.0,  extraRows: 0 };
  if(w <= 12) return { label: 'صعب 🔥',   speedMult: 1.4,  diveMult: 1.35, fireMult: 1.3,  extraRows: 1 };
  return          { label: 'جحيم 💀',   speedMult: 1.9,  diveMult: 1.75, fireMult: 1.6,  extraRows: 2 };
}

function drawLaserBeam(){
  ctx.save();
  const w1 = 6, w2 = 20;
  const grad = ctx.createLinearGradient(player.x, player.y, player.x, 0);
  grad.addColorStop(0, 'rgba(62,201,214,0.95)');
  grad.addColorStop(1, 'rgba(62,201,214,0.05)');
  ctx.fillStyle = grad;
  ctx.shadowColor = 'rgba(62,201,214,0.9)';
  ctx.shadowBlur = 16;
  ctx.beginPath();
  ctx.moveTo(player.x - w1, player.y - player.r);
  ctx.lineTo(player.x - w2, 0);
  ctx.lineTo(player.x + w2, 0);
  ctx.lineTo(player.x + w1, player.y - player.r);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ===== enemies (تشكيلة + غطسة انتحارية + رجوع، زي اللعبة الأصلية) =====
const ENEMY_TYPES = {
  drifter: { hp: 1, color: '#ff3d7f', score: 10, r: 14 },
  weaver:  { hp: 2, color: '#ff7a3d', score: 18, r: 17 },
  chaser:  { hp: 3, color: '#c23df2', score: 26, r: 19 },
  elite:   { hp: 5, color: '#f2b134', score: 45, r: 24 }
};

let fleetDirection = 1;
let fleetXOffset = 0;
let diveCooldown = 70;

function spawnWave(){
  enemies = [];
  fleetXOffset = 0;
  fleetDirection = 1;

  const diff = getDifficulty(wave);
  diveCooldown = Math.floor(70 / diff.diveMult);

  const colsCount = clamp(Math.floor(W / 70), 4, 8);
  const rowsCount = Math.max(2, 3 + diff.extraRows);
  const spacingX = Math.min(60, (W - 40) / colsCount);
  const spacingY = 44;
  const startX = (W - (colsCount * spacingX)) / 2 + spacingX / 2;
  const startY = 66;

  const types = ['drifter', 'drifter'];
  if(wave >= 2) types.push('weaver', 'weaver');
  if(wave >= 3) types.push('chaser');
  if(wave >= 8) types.push('elite');

  for(let r = 0; r < rowsCount; r++){
    for(let c = 0; c < colsCount; c++){
      const type = types[Math.floor(Math.random() * types.length)];
      const t = ENEMY_TYPES[type];
      const homeX = startX + c * spacingX;
      const homeY = startY + r * spacingY;
      enemies.push({
        type, homeX, homeY, x: homeX, y: homeY,
        state: 'grid', hp: t.hp, maxHp: t.hp,
        shootCooldown: Math.floor(rand(60, 160) / diff.fireMult)
      });
    }
  }
}

function updateEnemies(){
  const diff = getDifficulty(wave);

  fleetXOffset += fleetDirection * (0.4 + wave * 0.03) * diff.speedMult;
  if(Math.abs(fleetXOffset) > 40) fleetDirection *= -1;

  for(let i = enemies.length - 1; i >= 0; i--){
    const e = enemies[i];
    const t = ENEMY_TYPES[e.type];

    if(e.state === 'grid'){
      e.x = e.homeX + fleetXOffset;
      e.y = e.homeY;

      e.shootCooldown--;
      if(e.shootCooldown <= 0){
        e.shootCooldown = Math.floor(rand(90, 170) / diff.fireMult);
        enemyBullets.push({ x: e.x, y: e.y + 16, vx: 0, vy: (3.6 + wave * 0.1) * diff.speedMult });
      }
    }
    else if(e.state === 'diving'){
      e.y += e.diveSpeedY;
      e.diveProgress = Math.min(1, e.diveProgress + (e.diveSpeedY / H));
      const eased = 1 - Math.pow(1 - e.diveProgress, 2);
      const arcBulge = Math.sin(e.diveProgress * Math.PI) * 50;
      e.x = e.diveStartX + (e.diveTargetX - e.diveStartX) * eased + arcBulge;

      if(e.y > H + 30){
        e.y = -30;
        e.state = 'returning';
      }
    }
    else if(e.state === 'returning'){
      const dx = (e.homeX + fleetXOffset) - e.x;
      const dy = e.homeY - e.y;
      e.x += dx * 0.07;
      e.y += dy * 0.07;
      if(Math.abs(dx) < 2 && Math.abs(dy) < 2) e.state = 'grid';
    }

    e.x = clamp(e.x, 20, W - 20);

    if(!bossFightActive && dist(e.x, e.y, player.x, player.y) < t.r + player.r - 4 && shieldTimer <= 0){
      spawnExplosion(player.x, player.y, '#3ec9d6');
      spawnExplosion(e.x, e.y, t.color);
      enemies.splice(i, 1);
      damagePlayer();
    }
  }

  // كل شوية عدو من التشكيلة يعمل غطسة انتحارية تجاه اللاعب (بمعدل بيزيد مع الصعوبة)
  diveCooldown--;
  if(diveCooldown <= 0 && !bossFightActive){
    const gridEnemies = enemies.filter(e => e.state === 'grid');
    if(gridEnemies.length > 0){
      const diver = gridEnemies[Math.floor(Math.random() * gridEnemies.length)];
      diver.state = 'diving';
      diver.diveStartX = diver.x;
      diver.diveTargetX = clamp(player.x, 20, W - 20);
      diver.diveProgress = 0;
      diver.diveSpeedY = (3 + wave * 0.25) * diff.diveMult;
    }
    diveCooldown = Math.floor(rand(55, 95) / diff.diveMult);
  }
}

function drawEnemies(){
  enemies.forEach(e => {
    const t = ENEMY_TYPES[e.type];
    ctx.save();
    ctx.translate(e.x, e.y);
    ctx.rotate(Math.PI);
    ctx.shadowColor = t.color;
    ctx.shadowBlur = 10;
    ctx.fillStyle = t.color;

    if(e.type === 'drifter'){
      // سهم بسيط - أضعف عدو
      ctx.beginPath();
      ctx.moveTo(0, -t.r);
      ctx.lineTo(t.r*0.85, t.r*0.7);
      ctx.lineTo(0, t.r*0.3);
      ctx.lineTo(-t.r*0.85, t.r*0.7);
      ctx.closePath();
      ctx.fill();
    }
    else if(e.type === 'weaver'){
      // شكل شعاعي (سمكة راي) بأجنحة جانبية
      ctx.beginPath();
      ctx.moveTo(0, -t.r);
      ctx.lineTo(t.r*0.95, t.r*0.15);
      ctx.lineTo(t.r*0.5, t.r*0.95);
      ctx.lineTo(0, t.r*0.5);
      ctx.lineTo(-t.r*0.5, t.r*0.95);
      ctx.lineTo(-t.r*0.95, t.r*0.15);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.arc(0, -t.r*0.1, t.r*0.14, 0, Math.PI*2);
      ctx.fill();
    }
    else if(e.type === 'chaser'){
      // نجمة نينجا حادة - عدائي وملاحق
      const spikes = 6;
      ctx.beginPath();
      for(let i=0;i<spikes*2;i++){
        const ang = (Math.PI/spikes)*i;
        const rr = i%2===0 ? t.r : t.r*0.42;
        const px = Math.sin(ang)*rr, py = -Math.cos(ang)*rr;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath();
      ctx.fillStyle = t.color;
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = '#1a0510';
      ctx.arc(0,0,t.r*0.3,0,Math.PI*2);
      ctx.fill();
    }
    else if(e.type === 'elite'){
      // سداسي ضخم بقلب متوهج - نخبة نادرة وقوية
      const pts = 6;
      ctx.beginPath();
      for(let i=0;i<pts;i++){
        const ang = (Math.PI*2/pts)*i;
        const px = Math.cos(ang)*t.r, py = Math.sin(ang)*t.r;
        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      }
      ctx.closePath();
      const g = ctx.createLinearGradient(0,-t.r,0,t.r);
      g.addColorStop(0, '#ffe08a');
      g.addColorStop(1, t.color);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${0.5+Math.sin(frame*0.15)*0.3})`;
      ctx.arc(0,0,t.r*0.32,0,Math.PI*2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.restore();

    if(e.hp < e.maxHp){
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.fillRect(e.x - t.r, e.y - t.r - 8, t.r*2, 3);
      ctx.fillStyle = '#52d17c';
      ctx.fillRect(e.x - t.r, e.y - t.r - 8, (t.r*2) * (e.hp/e.maxHp), 3);
    }
  });
}

// ===== boss =====
function spawnBoss(){
  bossFightActive = true;
  const diff = getDifficulty(wave);
  boss = {
    x: W/2, y: -120, targetY: 100,
    hp: (60 + wave*18) * (0.8 + diff.speedMult*0.3), maxHp: 1,
    dir: 1, dashTimer: 0, r: 55,
    dropped66: false, dropped33: false
  };
  boss.maxHp = boss.hp;
}

function updateBoss(){
  if(!boss) return;
  const diff = getDifficulty(wave);
  if(boss.y < boss.targetY){
    boss.y += 2.2;
    return;
  }
  boss.dashTimer++;
  if(boss.dashTimer > 200 && boss.dashTimer < 260){
    const targetX = clamp(player.x, 70, W-70);
    boss.x += (targetX - boss.x) * 0.05 * diff.diveMult;
  } else {
    boss.x += boss.dir * 2.4 * diff.speedMult;
    if(boss.x < 70 || boss.x > W-70) boss.dir *= -1;
  }
  if(boss.dashTimer >= 260) boss.dashTimer = 0;
  boss.y = boss.targetY + Math.sin(frame*0.04)*12;

  // الزعيم بيسيب جايزة تساعدك عند وصوله لعتبات دم معينة
  if(!boss.dropped66 && boss.hp <= boss.maxHp*0.66){ boss.dropped66 = true; dropBossPowerup(); }
  if(!boss.dropped33 && boss.hp <= boss.maxHp*0.33){ boss.dropped33 = true; dropBossPowerup(); }

  const fireGap = Math.max(22, Math.round(55 / diff.fireMult));
  if(frame % fireGap === 0){
    for(let a=-2;a<=2;a++){
      enemyBullets.push({ x: boss.x, y: boss.y+boss.r*0.6, vx: a*1.6, vy: 4.4 * diff.speedMult });
    }
  }

  if(dist(boss.x,boss.y,player.x,player.y) < boss.r*0.6 + player.r && shieldTimer<=0){
    damagePlayer();
  }
}

function drawBoss(){
  if(!boss) return;
  ctx.save();
  ctx.translate(boss.x, boss.y);

  // هالة طاقة خلفية
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,61,127,0.16)';
  ctx.arc(0,0, boss.r+22 + Math.sin(frame*0.15)*5, 0, Math.PI*2);
  ctx.fill();

  // جسم المركبة الأم - هيئة مانتا-راي عريضة بأجنحة ممتدة
  const r = boss.r;
  const pts = [
    [0, 0.95],
    [0.32, 0.58],
    [0.75, 0.35],
    [1.35, 0.12],
    [0.95, -0.08],
    [0.55, -0.55],
    [0.22, -0.85],
    [0, -0.68]
  ];
  ctx.beginPath();
  pts.forEach((p,i) => {
    const px = p[0]*r, py = p[1]*r;
    if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
  });
  for(let i=pts.length-2;i>=1;i--){
    ctx.lineTo(-pts[i][0]*r, pts[i][1]*r);
  }
  ctx.closePath();

  const g = ctx.createLinearGradient(0,-r,0,r);
  g.addColorStop(0, '#7a3dff');
  g.addColorStop(0.55, '#c23df2');
  g.addColorStop(1, '#4a0e6b');
  ctx.fillStyle = g;
  ctx.shadowColor = 'rgba(194,61,242,0.65)';
  ctx.shadowBlur = 22;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.stroke();

  // مدفعين جانبيين عند طرفي الجناحين
  [-1,1].forEach(side => {
    ctx.beginPath();
    ctx.fillStyle = '#ff7a3d';
    ctx.shadowColor = '#ff7a3d';
    ctx.shadowBlur = 10;
    ctx.arc(side*r*1.28, r*0.13, r*0.14, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;
  });

  // قلب طاقة نابض في المنتصف
  ctx.beginPath();
  ctx.arc(0,-r*0.08,14,0,Math.PI*2);
  ctx.fillStyle = '#f2b134';
  ctx.shadowColor = '#f2b134';
  ctx.shadowBlur = 14;
  ctx.globalAlpha = 0.6 + Math.sin(frame*0.2)*0.4;
  ctx.fill();
  ctx.restore();

  // hp bar
  const barW = Math.min(W*0.6, 340);
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.fillRect(W/2-barW/2, 58, barW, 8);
  ctx.fillStyle = '#ff3d7f';
  ctx.fillRect(W/2-barW/2, 58, barW * (boss.hp/boss.maxHp), 8);
}

// ===== powerups =====
// أوزان الظهور: العادي أكتر، النادر (حياة/قنبلة) أقل بكتير جدًا
const POWERUP_POOL = [
  'shield','shield','rapid','rapid','rapid',
  'spread','spread','spread','laser','missile','missile',
  'life','nuke'
];

function maybeDropPowerup(x,y){
  if(Math.random() < 0.18){
    const type = POWERUP_POOL[Math.floor(Math.random()*POWERUP_POOL.length)];
    powerups.push({ x, y, type, vy: 2, ttl: 480, persistent: false });
  }
}

// جايزة خاصة من الزعيم: بتفضل ثابتة معلّقة ومتهزّش، ومتختفيش بمرور الوقت ولا مع تغيّر الموجات،
// وبتتشال بس لو الزعيم رمى جايزة جديدة قبل ما تتاخد
function dropBossPowerup(){
  powerups = powerups.filter(p => !p.persistent);
  const bossPool = ['shield','shield','life','rapid','rapid','spread','laser','missile'];
  const type = bossPool[Math.floor(Math.random()*bossPool.length)];
  const px = clamp(boss.x + rand(-40,40), 30, W-30);
  const py = Math.min(H-80, boss.y + boss.r + 30);
  powerups.push({
    x: px, y: py, baseY: py, type,
    vy: 0, ttl: Infinity, persistent: true, bobPhase: rand(0,Math.PI*2)
  });
}

function updatePowerups(){
  for(let i=powerups.length-1;i>=0;i--){
    const p = powerups[i];

    if(p.persistent){
      p.bobPhase += 0.045;
      p.y = p.baseY + Math.sin(p.bobPhase) * 8;
    } else {
      p.y += p.vy;
      p.ttl--;
      if(p.y > H+20 || p.ttl <= 0){ powerups.splice(i,1); continue; }
    }

    if(dist(p.x,p.y,player.x,player.y) < player.r + 14){
      applyPowerup(p.type);
      powerups.splice(i,1);
    }
  }
}

function applyPowerup(type){
  if(type === 'shield'){
    shieldTimer = 360;
  }
  else if(type === 'rapid'){
    rapidTimer = 360;
  }
  else if(type === 'spread' || type === 'laser' || type === 'missile'){
    weaponMode = type;
  }
  else if(type === 'life'){
    lives = Math.min(5, lives + 1);
    hudLives.innerText = '❤️'.repeat(lives);
    spawnExplosion(player.x, player.y, '#52d17c');
  }
  else if(type === 'nuke'){
    triggerNuke();
  }
}

function triggerNuke(){
  enemies.forEach(e => {
    const t = ENEMY_TYPES[e.type];
    spawnExplosion(e.x, e.y, t.color);
    registerKill(t.score);
  });
  enemies = [];
  enemyBullets = [];
  if(boss){
    boss.hp -= boss.maxHp * 0.35;
    spawnExplosion(boss.x, boss.y, '#ff7a3d');
    if(boss.hp <= 0){
      registerKill(300);
      boss = null; bossFightActive = false;
      nextWave();
    }
  }
  nukeFlash.style.transition = 'none';
  nukeFlash.style.opacity = '0.85';
  requestAnimationFrame(() => {
    nukeFlash.style.transition = 'opacity 0.5s ease';
    nukeFlash.style.opacity = '0';
  });
}

function drawPickupShapePath(type, r){
  ctx.beginPath();
  if(type === 'shield'){
    for(let i=0;i<6;i++){
      const ang = (Math.PI/3)*i - Math.PI/2;
      const px = Math.cos(ang)*r, py = Math.sin(ang)*r;
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
  }
  else if(type === 'rapid'){
    ctx.moveTo(0,-r);
    ctx.lineTo(r*0.9, r*0.55);
    ctx.lineTo(-r*0.9, r*0.55);
    ctx.closePath();
  }
  else if(type === 'spread'){
    ctx.moveTo(0,-r);
    ctx.lineTo(r,0);
    ctx.lineTo(0,r);
    ctx.lineTo(-r,0);
    ctx.closePath();
  }
  else if(type === 'missile'){
    for(let i=0;i<5;i++){
      const ang = (Math.PI*2/5)*i - Math.PI/2;
      const px = Math.cos(ang)*r, py = Math.sin(ang)*r;
      if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    }
    ctx.closePath();
  }
  else if(type === 'life'){
    ctx.moveTo(0, r*0.35);
    ctx.bezierCurveTo(r*1.1, -r*0.55, r*0.55, -r*1.05, 0, -r*0.3);
    ctx.bezierCurveTo(-r*0.55, -r*1.05, -r*1.1, -r*0.55, 0, r*0.35);
    ctx.closePath();
  }
  else {
    // laser وأي نوع تاني: دائرة
    ctx.arc(0,0,r,0,Math.PI*2);
  }
}

function drawPowerups(){
  const colors = { shield:'#3ec9d6', rapid:'#f2b134', spread:'#ff3d7f', laser:'#3ec9d6', missile:'#f2b134', life:'#52d17c', nuke:'#ff3d7f' };
  const icons = { shield:'🛡', rapid:'⚡', spread:'🔱', laser:'🔦', missile:'🚀', life:'❤️', nuke:'💣' };
  powerups.forEach(p => {
    const radius = p.persistent ? 18 : 14;
    ctx.save();
    ctx.translate(p.x,p.y);

    if(p.persistent){
      ctx.save();
      ctx.rotate(frame*0.03);
      ctx.strokeStyle = colors[p.type];
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 2;
      ctx.setLineDash([5,5]);
      ctx.beginPath();
      ctx.arc(0,0,radius+8,0,Math.PI*2);
      ctx.stroke();
      ctx.restore();
    }

    // جوايز المركبة (الثابتة) بتاخد شكل حاوية مختلف لكل نوع، الجوايز العادية دايرة موحّدة
    if(p.persistent){
      drawPickupShapePath(p.type, radius);
    } else {
      ctx.beginPath();
      ctx.arc(0,0,radius,0,Math.PI*2);
    }
    ctx.fillStyle = 'rgba(18,21,28,0.85)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = colors[p.type];
    ctx.shadowColor = colors[p.type];
    ctx.shadowBlur = p.persistent ? 16 : 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.font = (p.persistent ? '16px' : '13px') + ' sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(icons[p.type], 0, 1);
    ctx.restore();
  });
}

// ===== particles =====
function spawnExplosion(x,y,color){
  for(let i=0;i<14;i++){
    const ang = rand(0,Math.PI*2);
    const spd = rand(1,4.5);
    particles.push({ x,y, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, life: rand(18,32), color });
  }
}

function updateParticles(){
  for(let i=particles.length-1;i>=0;i--){
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.vx *= 0.94; p.vy *= 0.94;
    p.life--;
    if(p.life <= 0) particles.splice(i,1);
  }
}

function drawParticles(){
  particles.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.life/32);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x,p.y, 2.4, 0, Math.PI*2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

// ===== combat resolution =====
function resolveCollisions(){
  for(let i=bullets.length-1;i>=0;i--){
    const b = bullets[i];
    let hit = false;

    for(let j=enemies.length-1;j>=0;j--){
      const e = enemies[j];
      const t = ENEMY_TYPES[e.type];
      if(dist(b.x,b.y,e.x,e.y) < t.r){
        e.hp--;
        hit = true;
        if(e.hp <= 0){
          spawnExplosion(e.x,e.y,t.color);
          maybeDropPowerup(e.x,e.y);
          registerKill(t.score);
          enemies.splice(j,1);
        }
        break;
      }
    }

    if(!hit && boss && dist(b.x,b.y,boss.x,boss.y) < boss.r*0.75){
      boss.hp--;
      hit = true;
      spawnExplosion(b.x,b.y,'#ff7a3d');
      if(boss.hp <= 0){
        registerKill(300);
        spawnExplosion(boss.x,boss.y,'#ff3d7f');
        spawnExplosion(boss.x,boss.y,'#f2b134');
        boss = null;
        bossFightActive = false;
        nextWave();
      }
    }

    if(hit) bullets.splice(i,1);
  }

  for(let i=enemyBullets.length-1;i>=0;i--){
    const b = enemyBullets[i];
    if(dist(b.x,b.y,player.x,player.y) < player.r && shieldTimer<=0){
      enemyBullets.splice(i,1);
      damagePlayer();
    }
  }
}

function registerKill(baseScore){
  comboTimer = 90;
  comboCount++;
  const mult = 1 + Math.floor(comboCount/5)*0.5;
  score += Math.round(baseScore * mult);
  hudScore.innerText = score;
  if(comboCount >= 3){
    comboPill.style.display = 'flex';
    hudCombo.innerText = 'x' + mult.toFixed(1);
  }
}

function damagePlayer(){
  lives--;
  hudLives.innerText = '❤️'.repeat(Math.max(0,lives));
  spawnExplosion(player.x, player.y, '#3ec9d6');
  flashDamage();
  if(lives <= 0) endGame();
}

function flashDamage(){
  stage.style.filter = 'brightness(1.6) saturate(1.3)';
  setTimeout(() => { stage.style.filter = ''; }, 90);
}

function nextWave(){
  wave++;
  hudWave.innerText = wave;
  hudDiff.innerText = getDifficulty(wave).label;
  if(wave % 5 === 0){
    setTimeout(() => { if(gameActive) spawnBoss(); }, 700);
  } else {
    setTimeout(() => { if(gameActive) spawnWave(); }, 700);
  }
}

// ===== main loop =====
function update(){
  frame++;

  if(keys['arrowleft'] || keys['a']) player.x -= player.speed;
  if(keys['arrowright'] || keys['d']) player.x += player.speed;
  if(keys['arrowup'] || keys['w']) player.y -= player.speed;
  if(keys['arrowdown'] || keys['s']) player.y += player.speed;
  player.x = clamp(player.x, player.r, W-player.r);
  player.y = clamp(player.y, player.r, H-player.r);

  if(rapidTimer > 0) rapidTimer--;
  if(shieldTimer > 0) shieldTimer--;
  chipShield.style.display = shieldTimer>0 ? 'flex' : 'none';
  chipRapid.style.display = rapidTimer>0 ? 'flex' : 'none';
  if(weaponMode !== 'normal'){
    const info = WEAPON_INFO[weaponMode];
    chipWeapon.style.display = 'flex';
    chipWeapon.style.color = info.color;
    chipWeapon.innerText = info.icon + ' ' + info.label;
  } else {
    chipWeapon.style.display = 'none';
  }

  fireTimer--;
  const curInterval = rapidTimer>0 ? Math.round(fireInterval*0.5) : fireInterval;
  if(fireTimer <= 0){
    playerShoot();
    fireTimer = curInterval;
  }

  if(weaponMode === 'laser') updateLaserBeam();

  if(comboTimer > 0){ comboTimer--; }
  else if(comboCount > 0){ comboCount = 0; comboPill.style.display='none'; }

  updateStars();
  updateBullets();
  updateEnemies();
  updateBoss();
  updatePowerups();
  updateParticles();
  resolveCollisions();

  if(!bossFightActive && enemies.length === 0 && wave % 5 !== 0 && frame % 30 === 0 && !waveClearing){
    waveClearing = true;
    nextWave();
    setTimeout(() => waveClearing = false, 800);
  }
}
let waveClearing = false;

function render(){
  ctx.clearRect(0,0,W,H);
  const bgGrad = ctx.createRadialGradient(W/2,H*0.3,10,W/2,H*0.3,Math.max(W,H)*0.8);
  bgGrad.addColorStop(0,'#0b0f19');
  bgGrad.addColorStop(1,'#020307');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0,0,W,H);

  drawStars();
  drawParticles();
  drawPowerups();
  drawEnemies();
  drawBoss();
  if(weaponMode === 'laser') drawLaserBeam();
  drawBullets();
  drawPlayer();
}

function loop(){
  if(!gameActive) return;
  update();
  render();
  rafId = requestAnimationFrame(loop);
}

// ===== lifecycle =====
function startGame(){
  score = 0; wave = 1; lives = 3; comboCount = 0; comboTimer = 0;
  bullets = []; enemyBullets = []; enemies = []; particles = []; powerups = [];
  boss = null; bossFightActive = false; waveClearing = false;

  hudScore.innerText = 0;
  hudWave.innerText = 1;
  hudDiff.innerText = getDifficulty(1).label;
  hudLives.innerText = '❤️❤️❤️';
  comboPill.style.display = 'none';

  resetPlayer();
  initStars();

  startScreen.style.display = 'none';
  gameOverScreen.style.display = 'none';
  pauseOverlay.style.display = 'none';

  gameActive = true;
  cancelAnimationFrame(rafId);
  spawnWave();
  loop();
}

function endGame(){
  gameActive = false;
  cancelAnimationFrame(rafId);
  goTitle.innerText = '💥 سقطت مركبتك';
  goDesc.innerHTML = `وصلت للموجة <b>${wave}</b>\nسكورك النهائي: <b>${score}</b>`;
  gameOverScreen.style.display = 'flex';
}

function pauseGame(){
  if(!gameActive) return;
  gameActive = false;
  cancelAnimationFrame(rafId);
  pauseOverlay.style.display = 'flex';
}

function resumeGame(){
  gameActive = true;
  pauseOverlay.style.display = 'none';
  loop();
}
