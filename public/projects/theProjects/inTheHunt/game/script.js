let gameOver = false;

let playerLives = 3;
let isInvincible = false;
const INVINCIBLE_TIME = 1000;

const bg = document.getElementById("bgImg");
let bgX = 0;
const bgSpeed = 100;

const player = document.getElementById("player");
const playerWidth = 150;
const playerHeight = 100;
const speedH = 350;
const speedV = 300;

let x = 300;
let y = 400;

const keys = {};
let projectiles = [];
let lastShotTime = 0;

let score = 0;
let highScore = getHighScore();

const scoreBoard = document.createElement("div");
scoreBoard.id = "leaderboard";
scoreBoard.innerHTML = `
  <div class="lb-row">SCORE <span id="score">0</span></div>
  <div class="lb-row">HIGH <span id="highScore">${highScore}</span></div>
  <div class="lb-row">LIVES <span id="lives">${playerLives}</span></div>
`;
document.getElementById("game").appendChild(scoreBoard);

let enemies = [];
let enemyProjectiles = [];

const enemySpeed = 60;
const enemyProjectileSpeed = 400;

const chargerSpeed = 950;
const chargerWaitTime = 1.2;

function playExplosion(x, y, size = 140) {
  const explosion = document.createElement("div");
  explosion.className = "explosion";
  explosion.style.position = "absolute";
  explosion.style.width = size + "px";
  explosion.style.height = size + "px";
  explosion.style.left = x - size / 2 + "px";
  explosion.style.top = y - size / 2 + "px";
  explosion.style.pointerEvents = "none";

  document.getElementById("game").appendChild(explosion);

  let frame = 1;
  const totalFrames = 14;

  const anim = setInterval(() => {
    explosion.style.backgroundImage =
      `url("images/explosionEffect/Explosions${frame}.png")`;
    frame++;
    if (frame > totalFrames) {
      clearInterval(anim);
      explosion.remove();
    }
  }, 40);
}

function triggerGameOver() {
  gameOver = true;

  const overlay = document.createElement("div");
  overlay.id = "gameOverScreen";
  overlay.innerHTML = `
    <div class="game-over-box">
      <h1>GAME OVER</h1>
      <p>SCORE: ${score}</p>
      <button id="restartBtn">RESTART</button>
      <button id="titleBtn">TITLE</button>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("restartBtn").onclick = () => location.reload();
  document.getElementById("titleBtn").onclick = () =>
    window.location.href = "/gameInTheHunt/public/index.html";
}

window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;

  if (e.code === "Space" && !gameOver) {
    const now = Date.now();
    if (now - lastShotTime > 500) {
      const projectile = document.createElement("div");
      projectile.className = "projectile";

      const spawnX = x + playerWidth - 10;
      const spawnY = y + playerHeight / 2 - 10;

      projectile.style.left = spawnX + "px";
      projectile.style.top = spawnY + "px";

      document.getElementById("game").appendChild(projectile);

      projectiles.push({
        element: projectile,
        x: spawnX,
        y: spawnY,
        speed: 600
      });

      lastShotTime = now;
    }
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

function spawnEnemy() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.className = "enemy";

  const enemyX = window.innerWidth + 100;
  const enemyY = Math.random() * (window.innerHeight - playerHeight);

  enemy.style.left = enemyX + "px";
  enemy.style.top = enemyY + "px";

  document.getElementById("game").appendChild(enemy);

  enemies.push({
    type: "normal",
    element: enemy,
    x: enemyX,
    y: enemyY,
    baseY: enemyY,
    alive: true,
    shootTimer: Math.random() * 2 + 1,
    waveOffset: Math.random() * Math.PI * 2
  });

  setTimeout(spawnEnemy, Math.random() * 4000 + 2000);
}
spawnEnemy();

function spawnCharger() {
  if (gameOver) return;

  const enemy = document.createElement("div");
  enemy.className = "enemy charger";

  const enemyX = window.innerWidth + 180;
  const enemyY = Math.random() * (window.innerHeight - playerHeight);

  enemy.style.left = enemyX + "px";
  enemy.style.top = enemyY + "px";

  document.getElementById("game").appendChild(enemy);

  enemies.push({
    type: "charger",
    element: enemy,
    x: enemyX,
    y: enemyY,
    vx: 0,
    vy: 0,
    wait: chargerWaitTime,
    active: false
  });

  setTimeout(spawnCharger, Math.random() * 7000 + 5000);
}
spawnCharger();

function enemyShoot(enemy) {
  const proj = document.createElement("div");
  proj.className = "enemyProjectile";

  const px = enemy.x - 20;
  const py = enemy.y + playerHeight / 2 - 10;

  proj.style.left = px + "px";
  proj.style.top = py + "px";

  document.getElementById("game").appendChild(proj);
  enemyProjectiles.push({ element: proj, x: px, y: py });
}

function setHighScore(value) {
  document.cookie = `highScore=${value}; path=/; max-age=31536000`;
}
function getHighScore() {
  const match = document.cookie.match(/(^| )highScore=([^;]+)/);
  return match ? parseInt(match[2]) : 0;
}

let lastTime = 0;
function gameLoop(currentTime) {
  if (gameOver) return;

  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  bgX -= bgSpeed * deltaTime;
  bg.style.backgroundPosition = bgX + "px 0";

  if (keys["w"] || keys["arrowup"]) y -= speedV * deltaTime;
  if (keys["s"] || keys["arrowdown"]) y += speedV * deltaTime;
  if (keys["a"] || keys["arrowleft"]) x -= speedH * deltaTime;
  if (keys["d"] || keys["arrowright"]) x += speedH * deltaTime;

  x = Math.max(0, Math.min(x, window.innerWidth - playerWidth));
  y = Math.max(0, Math.min(y, window.innerHeight - playerHeight));

  player.style.left = x + "px";
  player.style.top = y + "px";

  for (let i = projectiles.length - 1; i >= 0; i--) {
    const p = projectiles[i];
    p.x += p.speed * deltaTime;
    p.element.style.left = p.x + "px";

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      if (e.type !== "normal" || !e.alive) continue;

      if (
        p.x < e.x + playerWidth &&
        p.x + 20 > e.x &&
        p.y < e.y + playerHeight &&
        p.y + 20 > e.y
      ) {
        e.alive = false;
        playExplosion(e.x + playerWidth / 2, e.y + playerHeight / 2);

        score += 100;
        document.getElementById("score").innerText = score;

        if (score > highScore) {
          highScore = score;
          document.getElementById("highScore").innerText = highScore;
          setHighScore(highScore);
        }

        p.element.remove();
        projectiles.splice(i, 1);
        break;
      }
    }

    if (p.x > window.innerWidth) {
      p.element.remove();
      projectiles.splice(i, 1);
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];

    if (e.type === "normal") {
      if (e.alive) {
        e.x -= enemySpeed * deltaTime;
        e.waveOffset += deltaTime * 3;
        e.y = e.baseY + Math.sin(e.waveOffset) * 60;

        e.shootTimer -= deltaTime;
        if (e.shootTimer <= 0) {
          enemyShoot(e);
          e.shootTimer = Math.random() * 2 + 1;
        }
      } else {
        e.y += 350 * deltaTime;
      }
    }

    if (e.type === "charger") {
      if (!e.active) {
        e.wait -= deltaTime;
        const angle = Math.atan2(y - e.y, x - e.x);
        e.element.style.transform = `rotate(${angle}rad) scaleX(-1)`;

        if (e.wait <= 0) {
          e.active = true;
          e.vx = Math.cos(angle) * chargerSpeed;
          e.vy = Math.sin(angle) * chargerSpeed;
        }
      } else {
        e.x += e.vx * deltaTime;
        e.y += e.vy * deltaTime;
      }
    }

    e.element.style.left = e.x + "px";
    e.element.style.top = e.y + "px";

    if (!isInvincible) {
      const hit =
        e.x < x + playerWidth &&
        e.x + playerWidth > x &&
        e.y < y + playerHeight &&
        e.y + playerHeight > y;

      if (hit) {
        playerLives--;
        document.getElementById("lives").innerText = playerLives;

        isInvincible = true;
        setTimeout(() => (isInvincible = false), INVINCIBLE_TIME);

        playExplosion(x + playerWidth / 2, y + playerHeight / 2, 200);

        if (e.type === "charger") {
          playExplosion(e.x + playerWidth / 2, e.y + playerHeight / 2, 180);
          e.element.remove();
          enemies.splice(i, 1);
        }

        if (playerLives <= 0) {
          triggerGameOver();
          return;
        }
      }
    }

    if (
      e.x < -600 ||
      e.x > window.innerWidth + 600 ||
      e.y < -600 ||
      e.y > window.innerHeight + 600
    ) {
      e.element.remove();
      enemies.splice(i, 1);
    }
  }

  for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
    const p = enemyProjectiles[i];
    p.x -= enemyProjectileSpeed * deltaTime;
    p.element.style.left = p.x + "px";

    if (
      !isInvincible &&
      p.x < x + playerWidth &&
      p.x + 20 > x &&
      p.y < y + playerHeight &&
      p.y + 20 > y
    ) {
      playerLives--;
      document.getElementById("lives").innerText = playerLives;

      isInvincible = true;
      setTimeout(() => (isInvincible = false), INVINCIBLE_TIME);

      playExplosion(x + playerWidth / 2, y + playerHeight / 2, 160);

      p.element.remove();
      enemyProjectiles.splice(i, 1);

      if (playerLives <= 0) {
        triggerGameOver();
        return;
      }
    }

    if (p.x < -50) {
      p.element.remove();
      enemyProjectiles.splice(i, 1);
    }
  }

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
