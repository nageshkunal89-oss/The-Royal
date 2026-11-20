// 1. MULTI-PAGE SWITCHING
function openPage(index) {
    const pages = document.querySelectorAll('.page');
    const tabs = document.querySelectorAll('.tab-btn');

    pages.forEach((p, i) => {
        p.classList.toggle('active', i === index);
    });

    tabs.forEach((t, i) => {
        t.classList.toggle('active', i === index);
    });
}

// Replay 3D Zoom Animation
function replayAnimation() {
    const board = document.getElementById('cardBoard');
    board.classList.remove('zoom-entry');
    void board.offsetWidth; // Trigger reflow
    board.classList.add('zoom-entry');
    openPage(0);
}

// 2. 3D WATER POOL, FLOATING LOTUS & FALLING PETALS ANIMATION
const canvas = document.getElementById('sceneCanvas');
const ctx = canvas.getContext('2d');

let width, height;
function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Floating Pink Lotus Objects in the Bottom Pool
const lotuses = [];
for (let i = 0; i < 22; i++) {
    lotuses.push({
        x: Math.random() * width,
        y: height * 0.68 + Math.random() * (height * 0.28),
        size: 14 + Math.random() * 14,
        speedX: (Math.random() - 0.5) * 0.3,
        phase: Math.random() * Math.PI * 2
    });
}

// Falling Purple Wisteria Petals
const petals = [];
for (let i = 0; i < 35; i++) {
    petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 3 + Math.random() * 4,
        speedY: 0.6 + Math.random() * 1.2,
        sway: Math.random() * 2,
        color: Math.random() > 0.5 ? '#c77dff' : '#e0aaff'
    });
}

let time = 0;

function drawScene() {
    time += 0.03;
    ctx.clearRect(0, 0, width, height);

    const horizonY = height * 0.65;

    // Draw Reflecting Blue Pool (Bottom 35% of screen like video)
    const waterGrad = ctx.createLinearGradient(0, horizonY, 0, height);
    waterGrad.addColorStop(0, '#3a86ff');
    waterGrad.addColorStop(0.5, '#1d4ed8');
    waterGrad.addColorStop(1, '#0f295c');
    ctx.fillStyle = waterGrad;
    ctx.fillRect(0, horizonY, width, height - horizonY);

    // Water Ripples
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 12; i++) {
        const y = horizonY + 15 + i * 22;
        ctx.beginPath();
        for (let x = 0; x < width; x += 20) {
            const wave = Math.sin(x * 0.02 + time + i) * 3;
            if (x === 0) ctx.moveTo(x, y + wave);
            else ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
    }

    // Draw Floating Green Pads & Pink Lotus Flowers
    lotuses.forEach(l => {
        l.x += l.speedX;
        if (l.x > width + 30) l.x = -30;
        if (l.x < -30) l.x = width + 30;

        const bobY = l.y + Math.sin(time + l.phase) * 2.5;

        // Green Lily Pad
        ctx.fillStyle = '#2d6a4f';
        ctx.beginPath();
        ctx.ellipse(l.x, bobY + 4, l.size * 1.2, l.size * 0.45, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pink Lotus Petals
        ctx.fillStyle = '#ff758f';
        ctx.beginPath();
        ctx.arc(l.x, bobY - 2, l.size * 0.55, Math.PI, 0);
        ctx.fill();

        ctx.fillStyle = '#ffb3c1';
        ctx.beginPath();
        ctx.arc(l.x, bobY - 4, l.size * 0.35, Math.PI, 0);
        ctx.fill();
    });

    // Draw Falling Purple Petals
    petals.forEach(p => {
        p.y += p.speedY;
        p.x += Math.sin(time + p.sway) * 0.5;
        if (p.y > height) {
            p.y = -10;
            p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.r, p.r * 0.6, time, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(drawScene);
}

drawScene();
