/**
 * Plastic Soldiers RTS
 * A tiny real-time strategy game inspired by the little green (and tan)
 * plastic army men kids used to line up on the carpet before video games.
 *
 * Usage:
 *   import initPlasticSoldiersGame from './plastic-soldiers-game.js';
 *   const destroy = initPlasticSoldiersGame(rootElement);
 *   // later, if needed: destroy();
 */

const WORLD_W = 900;
const WORLD_H = 560;

const UNIT_TYPES = {
    rifleman: {
        key: 'rifleman',
        label: 'Rifleman',
        icon: '🪖',
        cost: 50,
        buildTime: 4,
        hp: 36,
        dmg: 6,
        range: 85,
        atkSpd: 1.1, // attacks per second
        speed: 70, // px per second
        radius: 9,
    },
    gunner: {
        key: 'gunner',
        label: 'Machine Gunner',
        icon: '🔫',
        cost: 90,
        buildTime: 7,
        hp: 50,
        dmg: 4,
        range: 100,
        atkSpd: 2.6,
        speed: 55,
        radius: 10,
    },
    bazooka: {
        key: 'bazooka',
        label: 'Bazooka',
        icon: '💥',
        cost: 130,
        buildTime: 9,
        hp: 42,
        dmg: 22,
        range: 120,
        atkSpd: 0.6,
        speed: 50,
        radius: 10,
    },
};

const TEAM_COLORS = {
    player: { body: '#3f6b2b', dark: '#294718', bright: '#6fae43', label: 'Green Army' },
    enemy: { body: '#a9915a', dark: '#75603a', bright: '#cdb583', label: 'Tan Army' },
};

const STYLE_ID = 'plastic-soldiers-game-styles';
const STYLES = `
.ps-wrap {
    max-width: 960px;
    margin: 0 auto;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #222;
}
.ps-hud {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #2b3a1f;
    color: #eef5e4;
    padding: 10px 16px;
    border-radius: 8px 8px 0 0;
    font-size: 14px;
    flex-wrap: wrap;
    gap: 8px;
}
.ps-resource strong { color: #ffd166; }
.ps-status { font-weight: 600; }
.ps-canvas-holder {
    position: relative;
    width: 100%;
    line-height: 0;
    background: #4c7a30;
    overflow: hidden;
}
.ps-canvas {
    display: block;
    width: 100%;
    height: auto;
    cursor: crosshair;
    background: #4c7a30;
}
.ps-buildbar {
    display: flex;
    gap: 10px;
    padding: 12px 16px;
    background: #eef2e6;
    border-radius: 0 0 8px 8px;
    flex-wrap: wrap;
    align-items: center;
}
.ps-build-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    background: #fff;
    border: 2px solid #cdd8c0;
    border-radius: 8px;
    padding: 8px 12px;
    cursor: pointer;
    font-size: 13px;
    color: #263015;
    transition: border-color 0.15s, transform 0.1s;
    min-width: 92px;
}
.ps-build-btn:hover { border-color: #6fae43; }
.ps-build-btn:active { transform: scale(0.96); }
.ps-build-btn .ps-icon { font-size: 20px; }
.ps-build-btn .ps-cost { color: #6b7a5a; font-size: 12px; }
.ps-build-btn.ps-disabled { opacity: 0.5; cursor: not-allowed; }
.ps-build-btn.ps-flash { border-color: #d9534f; }
.ps-queue {
    margin-left: auto;
    font-size: 13px;
    color: #4c5a3a;
    min-width: 160px;
}
.ps-queue-bar {
    width: 100%;
    height: 6px;
    background: #d7ddc9;
    border-radius: 3px;
    overflow: hidden;
    margin-top: 4px;
}
.ps-queue-bar-fill {
    height: 100%;
    background: #6fae43;
}
.ps-help {
    font-size: 13px;
    color: #556047;
    padding: 8px 16px 0;
    margin: 0;
}
.ps-overlay {
    position: absolute;
    inset: 0;
    background: rgba(20, 26, 12, 0.82);
    display: flex;
    align-items: center;
    justify-content: center;
}
.ps-overlay[hidden] { display: none; }
.ps-overlay-card {
    background: #fff;
    padding: 28px 36px;
    border-radius: 10px;
    text-align: center;
}
.ps-overlay-card h2 { margin: 0 0 16px; color: #222; }
.ps-restart {
    background: #6fae43;
    color: #fff;
    border: none;
    padding: 10px 22px;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
}
.ps-restart:hover { background: #5b9235; }
`;

function ensureStyles() {
    if (typeof document === 'undefined') return;
    if (document.getElementById(STYLE_ID)) return;
    const styleEl = document.createElement('style');
    styleEl.id = STYLE_ID;
    styleEl.textContent = STYLES;
    document.head.appendChild(styleEl);
}

function dist(a, b) {
    return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

export default function initPlasticSoldiersGame(root) {
    ensureStyles();

    root.innerHTML = `
        <div class="ps-wrap">
            <div class="ps-hud">
                <div class="ps-resource">Toy Box Reserves: <strong class="ps-resource-val">0</strong></div>
                <div class="ps-status"></div>
            </div>
            <div class="ps-canvas-holder">
                <canvas class="ps-canvas" width="${WORLD_W}" height="${WORLD_H}"></canvas>
                <div class="ps-overlay" hidden>
                    <div class="ps-overlay-card">
                        <h2 class="ps-overlay-title"></h2>
                        <button class="ps-restart" type="button">Play Again</button>
                    </div>
                </div>
            </div>
            <div class="ps-buildbar">
                <button class="ps-build-btn" data-type="rifleman" type="button">
                    <span class="ps-icon">🪖</span>
                    <span class="ps-label">Rifleman</span>
                    <span class="ps-cost">50</span>
                </button>
                <button class="ps-build-btn" data-type="gunner" type="button">
                    <span class="ps-icon">🔫</span>
                    <span class="ps-label">Gunner</span>
                    <span class="ps-cost">90</span>
                </button>
                <button class="ps-build-btn" data-type="bazooka" type="button">
                    <span class="ps-icon">💥</span>
                    <span class="ps-label">Bazooka</span>
                    <span class="ps-cost">130</span>
                </button>
                <div class="ps-queue"></div>
            </div>
            <p class="ps-help">Drag to select your green army men &middot; right-click to move &middot; right-click an enemy to attack.</p>
        </div>
    `;

    const canvas = root.querySelector('.ps-canvas');
    const ctx = canvas.getContext('2d');
    const resourceEl = root.querySelector('.ps-resource-val');
    const statusEl = root.querySelector('.ps-status');
    const overlayEl = root.querySelector('.ps-overlay');
    const overlayTitleEl = root.querySelector('.ps-overlay-title');
    const restartBtn = root.querySelector('.ps-restart');
    const queueEl = root.querySelector('.ps-queue');
    const buildButtons = Array.from(root.querySelectorAll('.ps-build-btn'));

    // Static decorative pebbles/tufts, generated once.
    const decorations = [];
    for (let i = 0; i < 40; i++) {
        decorations.push({
            x: Math.random() * WORLD_W,
            y: Math.random() * WORLD_H,
            r: 2 + Math.random() * 3,
            shade: Math.random() > 0.5 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
        });
    }

    let player, enemy, selected, dragBox, gameOver, lastTs, rafId, aiTimer;
    let particles, decals, corpses, projectiles, screenShake;

    function makeBase(team, x, y) {
        const size = 84;
        return {
            team,
            isBase: true,
            x: x + size / 2,
            y: y + size / 2,
            w: size,
            h: size,
            hp: 400,
            maxHp: 400,
            alive: true,
            range: 150,
            dmg: 5,
            atkSpd: 1,
            atkCooldown: 0,
            attackTarget: null,
            hitFlash: 0,
            tracer: null,
        };
    }

    function makeSide(team, base) {
        return {
            team,
            resource: 200,
            resourceRate: 12,
            units: [],
            queue: [],
            base,
        };
    }

    function spawnUnit(side, typeKey) {
        const cfg = UNIT_TYPES[typeKey];
        const base = side.base;
        const enemySide = side === player ? enemy : player;
        const dx = enemySide.base.x - base.x;
        const dy = enemySide.base.y - base.y;
        const d = Math.hypot(dx, dy) || 1;
        const spawnX = base.x + (dx / d) * (base.w / 2 + 26) + (Math.random() - 0.5) * 30;
        const spawnY = base.y + (dy / d) * (base.h / 2 + 26) + (Math.random() - 0.5) * 30;
        side.units.push({
            team: side.team,
            type: typeKey,
            x: clamp(spawnX, 12, WORLD_W - 12),
            y: clamp(spawnY, 12, WORLD_H - 12),
            hp: cfg.hp,
            maxHp: cfg.hp,
            dmg: cfg.dmg,
            range: cfg.range,
            atkSpd: cfg.atkSpd,
            speed: cfg.speed,
            radius: cfg.radius,
            alive: true,
            selected: false,
            dest: null,
            attackTarget: null,
            orderedAttack: false,
            atkCooldown: 0,
            hitFlash: 0,
            tracer: null,
        });
    }

    function resetGame() {
        player = makeSide('player', makeBase('player', 30, WORLD_H - 30 - 84));
        enemy = makeSide('enemy', makeBase('enemy', WORLD_W - 30 - 84, 30));
        selected = [];
        dragBox = null;
        gameOver = false;
        aiTimer = 3;
        particles = [];
        decals = [];
        corpses = [];
        projectiles = [];
        screenShake = { ttl: 0, mag: 0 };
        overlayEl.hidden = true;
        statusEl.textContent = '';
    }

    function findNearestEnemy(from, side, maxRange) {
        let best = null;
        let bestD = Infinity;
        for (const u of side.units) {
            if (!u.alive) continue;
            const d = dist(from, u);
            if (d <= maxRange && d < bestD) {
                best = u;
                bestD = d;
            }
        }
        if (side.base.alive) {
            const d = dist(from, side.base);
            if (d <= maxRange && d < bestD) {
                best = side.base;
                bestD = d;
            }
        }
        return best;
    }

    function isAlive(entity) {
        return !!entity && entity.alive;
    }

    // --- Visual effects: particles, blood/scorch decals, corpses, screen shake ---

    function triggerShake(mag, dur) {
        if (mag >= screenShake.mag) screenShake.mag = mag;
        screenShake.ttl = Math.max(screenShake.ttl, dur);
    }

    function spawnParticle(p) {
        particles.push(Object.assign({ vx: 0, vy: 0, drag: 0, gravity: 0, rot: 0, vrot: 0, growth: 0 }, p));
    }

    function spawnBloodBurst(x, y, count) {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * 90;
            spawnParticle({
                type: 'blood',
                x,
                y,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                drag: 3,
                gravity: 50,
                size: 1.4 + Math.random() * 2.4,
                life: 0.35 + Math.random() * 0.4,
                maxLife: 0.75,
                color: Math.random() > 0.3 ? '#8c1c1c' : '#c22b2b',
            });
        }
    }

    function addDecal(kind, x, y) {
        decals.push({
            kind,
            x: x + (Math.random() - 0.5) * 6,
            y: y + (Math.random() - 0.5) * 6,
            r: kind === 'scorch' ? 13 + Math.random() * 9 : 5 + Math.random() * 6,
            rot: Math.random() * Math.PI * 2,
            alpha: kind === 'scorch' ? 0.55 : 0.7,
        });
        if (decals.length > 160) decals.shift();
    }

    function spawnDebris(x, y, colorDark, colorBody, count) {
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2;
            const speed = 30 + Math.random() * 70;
            spawnParticle({
                type: 'debris',
                x,
                y,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                drag: 2.5,
                gravity: 40,
                size: 2 + Math.random() * 2.5,
                rot: Math.random() * Math.PI * 2,
                vrot: (Math.random() - 0.5) * 10,
                life: 0.6 + Math.random() * 0.5,
                maxLife: 1.1,
                color: Math.random() > 0.5 ? colorDark : colorBody,
            });
        }
    }

    function spawnSmoke(x, y, count) {
        for (let i = 0; i < count; i++) {
            spawnParticle({
                type: 'smoke',
                x: x + (Math.random() - 0.5) * 8,
                y: y + (Math.random() - 0.5) * 8,
                vx: (Math.random() - 0.5) * 18,
                vy: -14 - Math.random() * 18,
                drag: 1.2,
                gravity: -4,
                size: 5 + Math.random() * 6,
                growth: 8 + Math.random() * 6,
                life: 0.6 + Math.random() * 0.6,
                maxLife: 1.2,
            });
        }
    }

    function spawnSparks(x, y, angle, count) {
        for (let i = 0; i < count; i++) {
            const a = angle + (Math.random() - 0.5) * 0.8;
            const speed = 90 + Math.random() * 110;
            spawnParticle({
                type: 'spark',
                x,
                y,
                vx: Math.cos(a) * speed,
                vy: Math.sin(a) * speed,
                drag: 5,
                gravity: 20,
                life: 0.07 + Math.random() * 0.08,
                maxLife: 0.15,
                color: '#ffe066',
            });
        }
    }

    function spawnSparksOmni(x, y, count) {
        for (let i = 0; i < count; i++) {
            spawnSparks(x, y, Math.random() * Math.PI * 2, 1);
        }
    }

    function spawnDamageText(x, y, amount) {
        spawnParticle({
            type: 'text',
            x,
            y: y - 14,
            vx: (Math.random() - 0.5) * 6,
            vy: -26,
            life: 0.7,
            maxLife: 0.7,
            text: '-' + amount,
            color: '#fff5cc',
        });
    }

    function explode(x, y, big) {
        spawnParticle({
            type: 'shock',
            x,
            y,
            size: big ? 6 : 3,
            growth: big ? 260 : 160,
            life: 0.28,
            maxLife: 0.28,
            color: '#ffcf6b',
        });
        spawnSmoke(x, y, big ? 9 : 5);
        spawnSparksOmni(x, y, big ? 16 : 8);
        spawnDebris(x, y, '#3a3a3a', '#6b6b6b', big ? 8 : 4);
        addDecal('scorch', x, y);
        triggerShake(big ? 9 : 4, big ? 0.35 : 0.16);
    }

    function killUnit(u) {
        const colors = TEAM_COLORS[u.team];
        corpses.push({
            x: u.x,
            y: u.y,
            team: u.team,
            angle: Math.random() * Math.PI * 2,
            ttl: 5,
        });
        spawnBloodBurst(u.x, u.y, 12);
        spawnDebris(u.x, u.y, colors.dark, colors.body, 5);
        addDecal('blood', u.x, u.y);
    }

    function applyDamage(attacker, target, opts = {}) {
        if (!target.alive) return;
        const amount = Math.min(target.hp, Math.round(attacker.dmg));
        target.hp = Math.max(0, target.hp - attacker.dmg);
        target.hitFlash = 0.15;
        if (amount > 0) spawnDamageText(target.x, target.y, amount);
        spawnBloodBurst(target.x, target.y, target.isBase ? 0 : 3);

        if (!opts.skipTracer) {
            attacker.tracer = { x1: attacker.x, y1: attacker.y, x2: target.x, y2: target.y, ttl: 0.08 };
            const ang = Math.atan2(target.y - attacker.y, target.x - attacker.x);
            const originR = attacker.radius || (attacker.w ? attacker.w / 2 : 10);
            spawnSparks(attacker.x + Math.cos(ang) * originR, attacker.y + Math.sin(ang) * originR, ang, 3);
        }

        if (target.hp <= 0) {
            target.alive = false;
            if (target.isBase) {
                explode(target.x, target.y, true);
                explode(target.x + (Math.random() - 0.5) * 34, target.y + (Math.random() - 0.5) * 34, true);
                triggerShake(14, 0.6);
                gameOver = true;
                statusEl.textContent = target.team === 'player' ? 'Defeat! Your toy box was overrun.' : 'Victory! The enemy base is scattered!';
                overlayTitleEl.textContent = target.team === 'player' ? 'Defeat' : 'Victory!';
                overlayEl.hidden = false;
            } else {
                killUnit(target);
            }
        }
    }

    function fireAt(attacker, target) {
        if (attacker.type === 'bazooka') {
            const ang = Math.atan2(target.y - attacker.y, target.x - attacker.x);
            spawnSparks(attacker.x + Math.cos(ang) * (attacker.radius + 8), attacker.y + Math.sin(ang) * (attacker.radius + 8), ang, 4);
            projectiles.push({
                x: attacker.x,
                y: attacker.y,
                tx: target.x,
                ty: target.y,
                primaryTarget: target,
                team: attacker.team,
                dmg: attacker.dmg,
                speed: 260,
                smokeTimer: 0,
                hit: false,
            });
        } else {
            applyDamage(attacker, target);
        }
    }

    function resolveProjectileImpact(pr) {
        const enemySide = pr.team === 'player' ? enemy : player;
        explode(pr.x, pr.y, true);

        if (pr.primaryTarget && isAlive(pr.primaryTarget)) {
            applyDamage({ dmg: pr.dmg, x: pr.x, y: pr.y, team: pr.team }, pr.primaryTarget, { skipTracer: true });
        }
        for (const u of enemySide.units) {
            if (!u.alive || u === pr.primaryTarget) continue;
            if (dist(u, pr) <= 32) {
                applyDamage({ dmg: Math.round(pr.dmg * 0.5), x: pr.x, y: pr.y, team: pr.team }, u, { skipTracer: true });
            }
        }
        if (enemySide.base.alive && enemySide.base !== pr.primaryTarget && dist(enemySide.base, pr) <= 50) {
            applyDamage({ dmg: Math.round(pr.dmg * 0.5), x: pr.x, y: pr.y, team: pr.team }, enemySide.base, { skipTracer: true });
        }
    }

    function updateProjectiles(dt) {
        for (const pr of projectiles) {
            if (pr.hit) continue;
            pr.smokeTimer -= dt;
            if (pr.smokeTimer <= 0) {
                spawnSmoke(pr.x, pr.y, 1);
                pr.smokeTimer = 0.035;
            }
            if (pr.primaryTarget && isAlive(pr.primaryTarget)) {
                pr.tx = pr.primaryTarget.x;
                pr.ty = pr.primaryTarget.y;
            }
            const dx = pr.tx - pr.x;
            const dy = pr.ty - pr.y;
            const d = Math.hypot(dx, dy);
            const step = pr.speed * dt;
            if (d <= step || d < 6) {
                pr.x = pr.tx;
                pr.y = pr.ty;
                pr.hit = true;
                resolveProjectileImpact(pr);
            } else {
                pr.x += (dx / d) * step;
                pr.y += (dy / d) * step;
            }
        }
        projectiles = projectiles.filter((pr) => !pr.hit);
    }

    function updateEffects(dt) {
        for (const p of particles) {
            p.life -= dt;
            const damp = Math.min(1, p.drag * dt);
            p.vx *= 1 - damp;
            p.vy += p.gravity * dt;
            p.vy *= 1 - damp;
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.rot += p.vrot * dt;
            p.size = (p.size || 0) + p.growth * dt;
        }
        particles = particles.filter((p) => p.life > 0);
        if (particles.length > 420) particles.splice(0, particles.length - 420);

        for (const d of decals) d.alpha -= dt * 0.006;
        decals = decals.filter((d) => d.alpha > 0.03);

        for (const c of corpses) c.ttl -= dt;
        corpses = corpses.filter((c) => c.ttl > 0);

        screenShake.ttl = Math.max(0, screenShake.ttl - dt);
        if (screenShake.ttl === 0) screenShake.mag = 0;
    }

    function moveToward(u, target, dt) {
        const dx = target.x - u.x;
        const dy = target.y - u.y;
        const d = Math.hypot(dx, dy);
        if (d < 1) return;
        const step = Math.min(d, u.speed * dt);
        u.x = clamp(u.x + (dx / d) * step, 8, WORLD_W - 8);
        u.y = clamp(u.y + (dy / d) * step, 8, WORLD_H - 8);
    }

    function updateCombatant(u, dt, enemySide, opts) {
        u.atkCooldown = Math.max(0, u.atkCooldown - dt);
        if (u.tracer) {
            u.tracer.ttl -= dt;
            if (u.tracer.ttl <= 0) u.tracer = null;
        }
        u.hitFlash = Math.max(0, u.hitFlash - dt);

        if (u.attackTarget && !isAlive(u.attackTarget)) u.attackTarget = null;

        if (!u.attackTarget) {
            const candidate = findNearestEnemy(u, enemySide, u.range);
            if (candidate) u.attackTarget = candidate;
        }

        if (u.attackTarget) {
            const d = dist(u, u.attackTarget);
            if (d <= u.range) {
                if (u.atkCooldown <= 0) {
                    fireAt(u, u.attackTarget);
                    u.atkCooldown = 1 / u.atkSpd;
                }
                return;
            } else if (opts.canChase && u.orderedAttack) {
                moveToward(u, u.attackTarget, dt);
                return;
            } else {
                u.attackTarget = null;
            }
        }

        if (opts.canMove && u.dest) {
            moveToward(u, u.dest, dt);
            if (dist(u, u.dest) < 4) u.dest = null;
        }
    }

    function update(dt) {
        updateEffects(dt);
        updateProjectiles(dt);
        if (gameOver) return;

        player.resource += player.resourceRate * dt;
        enemy.resource += enemy.resourceRate * dt;

        for (const side of [player, enemy]) {
            if (side.queue.length) {
                const item = side.queue[0];
                item.timeLeft -= dt;
                if (item.timeLeft <= 0) {
                    side.queue.shift();
                    spawnUnit(side, item.type);
                }
            }
        }

        for (const u of player.units) {
            if (u.alive) updateCombatant(u, dt, enemy, { canChase: true, canMove: true });
        }
        for (const u of enemy.units) {
            if (u.alive) updateCombatant(u, dt, player, { canChase: true, canMove: true });
        }
        if (player.base.alive) updateCombatant(player.base, dt, enemy, { canChase: false, canMove: false });
        if (enemy.base.alive) updateCombatant(enemy.base, dt, player, { canChase: false, canMove: false });

        player.units = player.units.filter((u) => u.alive);
        enemy.units = enemy.units.filter((u) => u.alive);

        runAi(dt);
    }

    function cheapestAffordable(resource) {
        const affordable = Object.values(UNIT_TYPES).filter((t) => t.cost <= resource);
        if (!affordable.length) return null;
        return affordable[Math.floor(Math.random() * affordable.length)];
    }

    function runAi(dt) {
        if (enemy.units.length < 24 && enemy.queue.length < 2) {
            const pick = cheapestAffordable(enemy.resource);
            if (pick) {
                enemy.resource -= pick.cost;
                enemy.queue.push({ type: pick.key, timeLeft: pick.buildTime });
            }
        }

        aiTimer -= dt;
        if (aiTimer <= 0) {
            aiTimer = 10 + Math.random() * 4;
            const idle = enemy.units.filter((u) => u.alive && !u.dest && !u.attackTarget);
            if (idle.length >= 4) {
                for (const u of idle) {
                    u.dest = {
                        x: clamp(player.base.x + (Math.random() - 0.5) * 60, 20, WORLD_W - 20),
                        y: clamp(player.base.y + (Math.random() - 0.5) * 60, 20, WORLD_H - 20),
                    };
                    u.orderedAttack = false;
                }
            }
        }
    }

    // --- Rendering ---

    function drawSoldier(u) {
        const colors = TEAM_COLORS[u.team];

        ctx.beginPath();
        ctx.ellipse(u.x, u.y + u.radius * 0.55, u.radius * 0.95, u.radius * 0.4, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fill();

        ctx.save();
        ctx.translate(u.x, u.y);

        if (u.selected) {
            ctx.beginPath();
            ctx.arc(0, 0, u.radius + 5, 0, Math.PI * 2);
            ctx.strokeStyle = '#ffd166';
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        let angle = 0;
        if (u.attackTarget) angle = Math.atan2(u.attackTarget.y - u.y, u.attackTarget.x - u.x);
        else if (u.dest) angle = Math.atan2(u.dest.y - u.y, u.dest.x - u.x);

        ctx.save();
        ctx.rotate(angle);
        ctx.strokeStyle = colors.dark;
        if (u.type === 'bazooka') {
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(-2, 0);
            ctx.lineTo(u.radius + 11, 0);
            ctx.stroke();
            ctx.fillStyle = colors.dark;
            ctx.beginPath();
            ctx.arc(u.radius + 11, 0, 2.6, 0, Math.PI * 2);
            ctx.fill();
        } else if (u.type === 'gunner') {
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(0, -1.5);
            ctx.lineTo(u.radius + 9, -1.5);
            ctx.moveTo(0, 1.5);
            ctx.lineTo(u.radius + 6, 1.5);
            ctx.stroke();
        } else {
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(u.radius + 8, 0);
            ctx.stroke();
        }
        ctx.restore();

        if (u.hitFlash > 0) {
            ctx.fillStyle = '#fff';
        } else {
            const grad = ctx.createRadialGradient(-u.radius * 0.3, -u.radius * 0.3, 1, 0, 0, u.radius);
            grad.addColorStop(0, colors.bright);
            grad.addColorStop(1, colors.body);
            ctx.fillStyle = grad;
        }
        ctx.beginPath();
        ctx.arc(0, 0, u.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = colors.dark;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(-u.radius * 0.25, -u.radius * 0.25, u.radius * 0.32, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,255,0.22)';
        ctx.fill();

        ctx.restore();

        if (u.hp < u.maxHp) {
            const w = 20;
            const barX = u.x - w / 2;
            const barY = u.y - u.radius - 10;
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(barX, barY, w, 4);
            ctx.fillStyle = u.hp / u.maxHp > 0.4 ? '#6fae43' : '#d9534f';
            ctx.fillRect(barX, barY, w * (u.hp / u.maxHp), 4);
        }

        if (u.tracer) {
            ctx.strokeStyle = '#ffe066';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(u.tracer.x1, u.tracer.y1);
            ctx.lineTo(u.tracer.x2, u.tracer.y2);
            ctx.stroke();
        }
    }

    function drawBase(base) {
        const colors = TEAM_COLORS[base.team];
        const x = base.x - base.w / 2;
        const y = base.y - base.h / 2;
        ctx.fillStyle = base.hitFlash > 0 ? '#fff' : colors.body;
        ctx.strokeStyle = colors.dark;
        ctx.lineWidth = 3;
        ctx.fillRect(x, y, base.w, base.h);
        ctx.strokeRect(x, y, base.w, base.h);

        ctx.fillStyle = colors.dark;
        for (let i = 0; i < 4; i++) {
            const sx = x + 7 + (i * (base.w - 14)) / 3;
            ctx.beginPath();
            ctx.ellipse(sx, y + base.h - 4, 7, 4, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.strokeStyle = colors.dark;
        ctx.beginPath();
        ctx.moveTo(base.x, y);
        ctx.lineTo(base.x, y - 18);
        ctx.stroke();
        ctx.fillStyle = colors.bright;
        ctx.fillRect(base.x, y - 18, 16, 10);

        const w = base.w;
        const barX = x;
        const barY = y - 26;
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.fillRect(barX, barY, w, 6);
        ctx.fillStyle = base.hp / base.maxHp > 0.4 ? '#6fae43' : '#d9534f';
        ctx.fillRect(barX, barY, w * (base.hp / base.maxHp), 6);

        if (base.tracer) {
            ctx.strokeStyle = '#ffe066';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(base.tracer.x1, base.tracer.y1);
            ctx.lineTo(base.tracer.x2, base.tracer.y2);
            ctx.stroke();
        }
    }

    function drawDecal(d) {
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(d.rot);
        ctx.globalAlpha = d.alpha;
        if (d.kind === 'scorch') {
            ctx.fillStyle = '#1a1410';
            ctx.beginPath();
            ctx.ellipse(0, 0, d.r, d.r * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#7a1414';
            ctx.beginPath();
            ctx.ellipse(0, 0, d.r, d.r * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(d.r * 0.75, d.r * 0.35, d.r * 0.28, d.r * 0.18, 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    function drawCorpse(c) {
        const colors = TEAM_COLORS[c.team];
        ctx.save();
        ctx.globalAlpha = c.ttl < 1 ? Math.max(0, c.ttl) : 1;
        ctx.translate(c.x, c.y);
        ctx.rotate(c.angle);
        ctx.fillStyle = colors.dark;
        ctx.beginPath();
        ctx.ellipse(0, 0, 12, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = colors.body;
        ctx.beginPath();
        ctx.ellipse(-2, 0, 8, 3.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawProjectile(pr) {
        const angle = Math.atan2(pr.ty - pr.y, pr.tx - pr.x);
        ctx.save();
        ctx.translate(pr.x, pr.y);
        ctx.rotate(angle);
        ctx.fillStyle = '#2b2b2b';
        ctx.fillRect(-6, -2, 12, 4);
        ctx.fillStyle = '#ff9d3d';
        ctx.beginPath();
        ctx.arc(-6, 0, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawParticle(p) {
        const t = clamp(p.life / p.maxLife, 0, 1);
        ctx.save();
        if (p.type === 'blood') {
            ctx.globalAlpha = t;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'debris') {
            ctx.globalAlpha = t;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.type === 'smoke') {
            ctx.globalAlpha = t * 0.35;
            ctx.fillStyle = '#555';
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === 'spark') {
            ctx.globalAlpha = t;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03);
            ctx.stroke();
        } else if (p.type === 'shock') {
            ctx.globalAlpha = t * 0.8;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(p.x, p.y, Math.max(0, p.size), 0, Math.PI * 2);
            ctx.stroke();
        } else if (p.type === 'text') {
            ctx.globalAlpha = t;
            ctx.fillStyle = p.color;
            ctx.font = 'bold 11px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(p.text, p.x, p.y);
        }
        ctx.restore();
    }

    function render() {
        ctx.clearRect(0, 0, WORLD_W, WORLD_H);

        let sx = 0;
        let sy = 0;
        if (screenShake.ttl > 0) {
            sx = (Math.random() - 0.5) * screenShake.mag;
            sy = (Math.random() - 0.5) * screenShake.mag;
        }

        ctx.save();
        ctx.translate(sx, sy);

        ctx.fillStyle = '#4c7a30';
        ctx.fillRect(-20, -20, WORLD_W + 40, WORLD_H + 40);

        for (const d of decorations) {
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = d.shade;
            ctx.fill();
        }

        for (const d of decals) drawDecal(d);
        for (const c of corpses) drawCorpse(c);

        if (player.base.alive) drawBase(player.base);
        if (enemy.base.alive) drawBase(enemy.base);

        for (const u of enemy.units) drawSoldier(u);
        for (const u of player.units) drawSoldier(u);

        for (const pr of projectiles) drawProjectile(pr);
        for (const p of particles) drawParticle(p);

        if (dragBox) {
            const x = Math.min(dragBox.x0, dragBox.x1);
            const y = Math.min(dragBox.y0, dragBox.y1);
            const w = Math.abs(dragBox.x1 - dragBox.x0);
            const h = Math.abs(dragBox.y1 - dragBox.y0);
            ctx.strokeStyle = 'rgba(255,209,102,0.9)';
            ctx.fillStyle = 'rgba(255,209,102,0.15)';
            ctx.lineWidth = 1;
            ctx.fillRect(x, y, w, h);
            ctx.strokeRect(x, y, w, h);
        }

        ctx.restore();
    }

    function updateHud() {
        resourceEl.textContent = Math.floor(player.resource);

        buildButtons.forEach((btn) => {
            const type = btn.getAttribute('data-type');
            const cfg = UNIT_TYPES[type];
            btn.classList.toggle('ps-disabled', player.resource < cfg.cost);
        });

        if (player.queue.length) {
            const item = player.queue[0];
            const cfg = UNIT_TYPES[item.type];
            const pct = clamp(1 - item.timeLeft / cfg.buildTime, 0, 1) * 100;
            queueEl.innerHTML = `Building ${cfg.label}&hellip; (${player.queue.length} in queue)
                <div class="ps-queue-bar"><div class="ps-queue-bar-fill" style="width:${pct}%"></div></div>`;
        } else {
            queueEl.textContent = '';
        }
    }

    function loop(ts) {
        if (lastTs == null) lastTs = ts;
        const dt = Math.min(0.05, (ts - lastTs) / 1000);
        lastTs = ts;
        update(dt);
        render();
        updateHud();
        rafId = requestAnimationFrame(loop);
    }

    // --- Input handling ---

    function toWorld(evt) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = WORLD_W / rect.width;
        const scaleY = WORLD_H / rect.height;
        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY,
        };
    }

    function clearSelection() {
        for (const u of selected) u.selected = false;
        selected = [];
    }

    function onMouseDown(evt) {
        if (evt.button !== 0) return;
        const p = toWorld(evt);
        dragBox = { x0: p.x, y0: p.y, x1: p.x, y1: p.y };
    }

    function onMouseMove(evt) {
        if (!dragBox) return;
        const p = toWorld(evt);
        dragBox.x1 = p.x;
        dragBox.y1 = p.y;
    }

    function onMouseUp(evt) {
        if (!dragBox) return;
        const p = toWorld(evt);
        dragBox.x1 = p.x;
        dragBox.y1 = p.y;

        const w = Math.abs(dragBox.x1 - dragBox.x0);
        const h = Math.abs(dragBox.y1 - dragBox.y0);

        if (!evt.shiftKey) clearSelection();

        if (w < 6 && h < 6) {
            let closest = null;
            let closestD = 18;
            for (const u of player.units) {
                if (!u.alive) continue;
                const d = dist(u, dragBox);
                if (d < closestD) {
                    closest = u;
                    closestD = d;
                }
            }
            if (closest) {
                closest.selected = true;
                if (!selected.includes(closest)) selected.push(closest);
            }
        } else {
            const minX = Math.min(dragBox.x0, dragBox.x1);
            const maxX = Math.max(dragBox.x0, dragBox.x1);
            const minY = Math.min(dragBox.y0, dragBox.y1);
            const maxY = Math.max(dragBox.y0, dragBox.y1);
            for (const u of player.units) {
                if (!u.alive) continue;
                if (u.x >= minX && u.x <= maxX && u.y >= minY && u.y <= maxY) {
                    u.selected = true;
                    if (!selected.includes(u)) selected.push(u);
                }
            }
        }
        dragBox = null;
    }

    function onContextMenu(evt) {
        evt.preventDefault();
        if (!selected.length) return;
        const p = toWorld(evt);

        let target = null;
        for (const u of enemy.units) {
            if (u.alive && dist(u, p) <= u.radius + 6) {
                target = u;
                break;
            }
        }
        if (!target && enemy.base.alive && dist(enemy.base, p) <= enemy.base.w / 2 + 6) {
            target = enemy.base;
        }

        for (const u of selected) {
            if (target) {
                u.attackTarget = target;
                u.orderedAttack = true;
                u.dest = null;
            } else {
                u.dest = { x: clamp(p.x, 10, WORLD_W - 10), y: clamp(p.y, 10, WORLD_H - 10) };
                u.attackTarget = null;
                u.orderedAttack = false;
            }
        }
    }

    function onBuildClick(evt) {
        const btn = evt.currentTarget;
        const type = btn.getAttribute('data-type');
        const cfg = UNIT_TYPES[type];
        if (player.resource >= cfg.cost) {
            player.resource -= cfg.cost;
            player.queue.push({ type, timeLeft: cfg.buildTime });
        } else {
            btn.classList.add('ps-flash');
            setTimeout(() => btn.classList.remove('ps-flash'), 250);
        }
    }

    function onRestart() {
        resetGame();
    }

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('contextmenu', onContextMenu);
    buildButtons.forEach((btn) => btn.addEventListener('click', onBuildClick));
    restartBtn.addEventListener('click', onRestart);

    resetGame();
    rafId = requestAnimationFrame(loop);

    return function destroy() {
        cancelAnimationFrame(rafId);
        canvas.removeEventListener('mousedown', onMouseDown);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
        canvas.removeEventListener('contextmenu', onContextMenu);
        buildButtons.forEach((btn) => btn.removeEventListener('click', onBuildClick));
        restartBtn.removeEventListener('click', onRestart);
    };
}
