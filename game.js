(()=>{

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

window.addEventListener("resize", ()=>{
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    groundY = H - groundHeight;
});

// Game constants
const gravity = 0.6;
const jumpVelocity = -11;
const groundHeight = 60;
// Worm dimensions control drawing only; body visually segmented
const worm = { x: W*0.2, y:0, w:50, h:28, vy:0 };
let groundY = H - groundHeight;

const holes = [];
let holeSpawnTick = 0;
const holeFreq = 100; // frames
const holeSpeed = 5;
const minHoleWidth = 70;
const maxHoleWidth = 120;

let score = 0;
const milestone = 10; // show message after 10 jumps
let gameOver = false;
let started = false;

const overlay = document.getElementById("overlay");
const msg = document.getElementById("message");
const subMsg = document.getElementById("subMessage");
const restartBtn = document.getElementById("restartBtn");

function reset() {
    holes.length = 0;
    worm.y = groundY - worm.h;
    worm.vy = 0;
    score = 0;
    holeSpawnTick = 0;
    gameOver = false;
}

function startGame(){
    reset();
    started = true;
    overlay.style.display="none";
    loop();
}

function endGame(){
    gameOver = true;
    overlay.style.display="flex";
    msg.textContent = "Game Over";
    subMsg.textContent = "Score: "+score+"  – Tap Restart";
    restartBtn.style.display="block";
}

function spawnHole(){
    const width = Math.random()*(maxHoleWidth-minHoleWidth)+minHoleWidth;
    holes.push({ x: W + width, w: width });
}

function update(){
    // Worm physics
    worm.vy += gravity;
    worm.y += worm.vy;
    if(worm.y > groundY - worm.h){
        worm.y = groundY - worm.h;
        worm.vy = 0;
    }

    // Hole logic
    holeSpawnTick++;
    if(holeSpawnTick > holeFreq){
        spawnHole();
        holeSpawnTick = 0;
    }

    for(let i=holes.length-1;i>=0;i--){
        const h = holes[i];
        h.x -= holeSpeed;
        // collision
        const inHoleX = worm.x + worm.w > h.x && worm.x < h.x + h.w;
        const wormFoot = worm.y + worm.h;
        if(inHoleX && wormFoot >= groundY){
            endGame();
        }
        // score
        if(h.x + h.w < worm.x && !h.passed){
            score++;
            h.passed = true;
            if(score === milestone){
                // show love message briefly
                showTempMessage("❤ I love you Sarah! ❤", 2500);
            }
        }
        if(h.x + h.w < -20){
            holes.splice(i,1);
        }
    }
}

let tempMsgTimeout;
function showTempMessage(text, duration){
    clearTimeout(tempMsgTimeout);
    overlay.style.display="flex";
    msg.textContent = text;
    subMsg.textContent = "";
    tempMsgTimeout = setTimeout(()=>{ overlay.style.display="none"; }, duration);
}

function draw(){
    ctx.clearRect(0,0,W,H);

    // sky background
    ctx.fillStyle="#ffd6e7";
    ctx.fillRect(0,0,W,H);

    // ground
    ctx.fillStyle="#ffacd9";
    ctx.fillRect(0,groundY,W,groundHeight);

    // draw worm: use segmented circles for a cute rounded body
    drawWorm();

    // holes
    ctx.fillStyle="#372c2e";
    holes.forEach(h =>{
        ctx.fillRect(h.x, groundY, h.w, groundHeight);
    });

    // score
    ctx.fillStyle="#ff4fa8";
    ctx.font="bold 24px Helvetica Neue, Arial";
    ctx.fillText("Score: "+score, 20, 40);
}

function drawWorm(){
    const segmentCount = 5;
    const segRadius = worm.h/2;
    const gap = (worm.w - segRadius*2) / (segmentCount - 1);

    for(let i=0;i<segmentCount;i++){
        const cx = worm.x + segRadius + i*gap;
        const cy = worm.y + segRadius;
        ctx.beginPath();
        ctx.fillStyle = "#ff4fa8";
        ctx.arc(cx, cy, segRadius, 0, Math.PI*2);
        ctx.fill();
        // subtle highlight for cuteness
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        ctx.beginPath();
        ctx.arc(cx - segRadius*0.4, cy - segRadius*0.4, segRadius*0.4, 0, Math.PI*2);
        ctx.fill();
    }
    // eye on the front segment
    ctx.fillStyle="#ffffff";
    ctx.beginPath();
    ctx.arc(worm.x + worm.w - segRadius*0.7, worm.y + segRadius*0.7, segRadius*0.4, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle="#000";
    ctx.beginPath();
    ctx.arc(worm.x + worm.w - segRadius*0.6, worm.y + segRadius*0.7, segRadius*0.2, 0, Math.PI*2);
    ctx.fill();
}

function loop(){
    if(gameOver){ return; }
    update();
    draw();
    requestAnimationFrame(loop);
}

// Controls
function jump(){
    if(!started){
        startGame();
        return;
    }
    if(worm.vy === 0){
        worm.vy = jumpVelocity;
    }
}

// Touch & click
canvas.addEventListener("touchstart", e=>{ e.preventDefault(); jump(); });
canvas.addEventListener("mousedown", jump);

restartBtn.addEventListener("click",()=>{
    restartBtn.style.display="none";
    startGame();
});

// Initialize worm position
worm.y = groundY - worm.h;
draw();

})();
