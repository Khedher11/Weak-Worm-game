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
const worm = { x: W*0.2, y:0, w:50, h:28, vy:0 };
let groundY = H - groundHeight;

const holes = [];
let holeSpawnTick = 0;
const holeFreq = 100; // frames
const holeSpeed = 5;
const minHoleWidth = 70;
const maxHoleWidth = 120;

let score = 0;
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
            if(score === 5){
                // show love message briefly
                showTempMessage("❤ I love you Sarah! ❤", 2000);
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

    // worm
    ctx.fillStyle="#ff4fa8";
    ctx.fillRect(worm.x, worm.y, worm.w, worm.h);
    // worm eye
    ctx.fillStyle="#ffffff";
    ctx.beginPath();
    ctx.arc(worm.x + worm.w*0.75, worm.y + worm.h*0.35, 4, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle="#000";
    ctx.beginPath();
    ctx.arc(worm.x + worm.w*0.75, worm.y + worm.h*0.35, 2, 0, 2*Math.PI);
    ctx.fill();

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
